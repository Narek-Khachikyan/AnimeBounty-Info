import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Run the production scheduler with a deterministic clock and fixture transport.
// No requests reach Jikan, and assertions describe observable request outcomes.
const source = readFileSync(new URL('../src/features/jikanScheduler.js', import.meta.url), 'utf8')
  .replace(/export (const|function|class) /g, '$1 ');
const flush = () => new Promise((resolve) => setImmediate(resolve));

const setup = (respond) => {
  let now = 0;
  let serial = 0;
  const timers = new Map();
  const starts = [];
  const setTimer = (callback, ms = 0) => {
    const id = ++serial;
    timers.set(id, { id, at: now + Math.max(0, Number(ms)), callback });
    return id;
  };
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const sleep = (ms) => new Promise((resolve) => setTimer(resolve, ms));
  const context = vm.createContext({
    Date: ClockDate, setTimeout: setTimer, clearTimeout: (id) => timers.delete(id),
    AbortController, DOMException, Headers, console,
  });
  context.raw = async (args, api, options) => {
    starts.push({ args, at: now });
    return respond({ args, api, options, starts, sleep, now });
  };
  vm.runInContext(`${source}\nglobalThis.query = createJikanBaseQuery(raw);`, context);
  const query = (args, controller = new AbortController()) => context.query(args, {
    signal: controller.signal, endpoint: 'fixture', type: 'query', getState: () => ({}),
  }, {});
  const advanceTo = async (target) => {
    assert.ok(target >= now);
    for (let count = 0; count < 1000; count += 1) {
      await flush();
      const next = [...timers.values()].sort((a, b) => a.at - b.at || a.id - b.id)[0];
      if (!next || next.at > target) { now = target; await flush(); return; }
      now = next.at;
      timers.delete(next.id);
      next.callback();
    }
    assert.fail('Virtual timer did not settle');
  };
  const finish = async (promise) => {
    let settled = false;
    let failure;
    let value;
    Promise.resolve(promise).then((result) => { settled = true; value = result; }, (error) => { settled = true; failure = error; });
    for (let count = 0; !settled && count < 1000; count += 1) {
      await flush();
      if (settled) break;
      const next = [...timers.values()].sort((a, b) => a.at - b.at || a.id - b.id)[0];
      assert.ok(next, 'Request stalled without a scheduled wakeup');
      await advanceTo(next.at);
    }
    assert.ok(settled, 'Request did not terminate within bounded virtual steps');
    if (failure) throw failure;
    return value;
  };
  const assertPaced = () => starts.slice(1).forEach((start, index) => {
    assert.ok(start.at - starts[index].at >= 900, `Unpaced attempt: ${starts[index].at} → ${start.at}`);
  });
  return { query, starts, sleep, advanceTo, finish, assertPaced, now: () => now };
};
const ok = (value = 'ready') => ({ data: value });
const error = (status, retryAfter) => ({
  error: { status, data: 'Fixture failure' },
  meta: { response: { headers: new Headers(retryAfter === undefined ? {} : { 'Retry-After': retryAfter }) } },
});
let count = 0;
const check = async (label, run) => {
  await run();
  count += 1;
  console.log(`PASS ${label}`);
};

await check('slow gallery does not block reviews or episodes', async () => {
  const env = setup(async ({ args, sleep }) => { if (args === 'gallery') await sleep(3000); return ok(args); });
  const requests = ['gallery', 'reviews', 'episodes'].map((args) => env.query(args));
  await env.advanceTo(1800);
  assert.deepEqual(env.starts.map(({ args, at }) => [args, at]), [['gallery', 0], ['reviews', 900], ['episodes', 1800]]);
  assert.equal((await requests[1]).data, 'reviews');
  assert.equal((await requests[2]).data, 'episodes');
  await env.finish(Promise.all(requests));
  env.assertPaced();
});

for (const status of [503, 'FETCH_ERROR', 'TIMEOUT_ERROR']) {
  await check(`persistent ${status} terminates after three attempts and unrelated work progresses`, async () => {
    const env = setup(({ args }) => args === 'bad' ? error(status) : ok());
    const bad = env.query('bad');
    const good = env.query('good');
    const [failure, success] = await env.finish(Promise.all([bad, good]));
    assert.equal(failure.error.status, status);
    assert.equal(success.data, 'ready');
    assert.equal(env.starts.filter(({ args }) => args === 'bad').length, 3);
    env.assertPaced();
  });
}

await check('404 does not retry', async () => {
  const env = setup(() => error(404));
  assert.equal((await env.finish(env.query('missing'))).error.status, 404);
  assert.equal(env.starts.length, 1);
});

await check('transient recovery attempts and following query all obey pacing', async () => {
  let attempts = 0;
  const env = setup(({ args }) => args === 'recover' && ++attempts < 3 ? error(500) : ok(args));
  const recovered = await env.finish(env.query('recover'));
  assert.equal(recovered.data, 'recover');
  assert.equal((await env.finish(env.query('next'))).data, 'next');
  assert.equal(attempts, 3);
  env.assertPaced();
});

await check('mixed 429 and 503 share one bounded retry budget', async () => {
  let attempts = 0;
  const env = setup(() => error(++attempts % 2 ? 429 : 503));
  assert.ok((await env.finish(env.query('mixed'))).error);
  assert.equal(env.starts.length, 3);
  assert.ok(env.starts[1].at >= 5000);
  env.assertPaced();
});

await check('late 429 response extends a queued wait globally', async () => {
  let slowAttempts = 0;
  const env = setup(async ({ args, sleep }) => {
    if (args === 'slow' && ++slowAttempts === 1) { await sleep(1200); return error(429); }
    return ok(args);
  });
  const requests = ['slow', 'second', 'third'].map((args) => env.query(args));
  await env.advanceTo(6199);
  assert.equal(env.starts.filter(({ args }) => args === 'third').length, 0);
  await env.finish(Promise.all(requests));
  assert.ok(env.starts.find(({ args }) => args === 'third').at >= 6200);
  env.assertPaced();
});

for (const retryAfter of ['8', 'Thu, 01 Jan 1970 00:00:08 GMT']) {
  await check(`429 respects Retry-After ${retryAfter}`, async () => {
    let attempts = 0;
    const env = setup(() => ++attempts === 1 ? error(429, retryAfter) : ok());
    assert.equal((await env.finish(env.query('limited'))).data, 'ready');
    assert.ok(env.starts[1].at >= 8000);
    env.assertPaced();
  });
}

await check('canceled queued work settles promptly without consuming a slot', async () => {
  const env = setup(() => ok());
  const first = env.query('first');
  const controller = new AbortController();
  let canceledSettled = false;
  const canceled = env.query('canceled', controller).then((result) => { canceledSettled = true; return result; });
  const next = env.query('next');
  await env.advanceTo(100);
  controller.abort();
  await flush();
  assert.ok(canceledSettled, 'Cancellation must settle before the pacing wait expires');
  assert.ok((await canceled).error);
  await env.finish(Promise.all([first, next]));
  assert.deepEqual(env.starts.map(({ args, at }) => [args, at]), [['first', 0], ['next', 900]]);
});

await check('abort during cooldown avoids a retry fetch', async () => {
  const env = setup(() => error(429));
  const controller = new AbortController();
  let settled = false;
  const request = env.query('limited', controller).then((result) => { settled = true; return result; });
  await env.advanceTo(100);
  controller.abort();
  await flush();
  assert.ok(settled);
  assert.ok((await request).error);
  await env.advanceTo(6000);
  assert.equal(env.starts.length, 1);
});

await check('slow transports stay within two in flight and capacity-wait cancellation is prompt', async () => {
  let active = 0;
  let peak = 0;
  const env = setup(async ({ args, sleep }) => {
    active += 1;
    peak = Math.max(peak, active);
    try { await sleep(3000); return ok(args); } finally { active -= 1; }
  });
  const requests = ['one', 'two', 'three', 'four'].map((args) => env.query(args));
  const controller = new AbortController();
  let canceledSettled = false;
  const canceled = env.query('canceled', controller).then((result) => { canceledSettled = true; return result; });
  await env.advanceTo(1800);
  assert.equal(active, 2);
  assert.equal(env.starts.length, 2, 'Third slow transport must wait for capacity');
  controller.abort();
  await flush();
  assert.ok(canceledSettled, 'Capacity-wait cancellation must settle before a transport completes');
  assert.ok((await canceled).error);
  const results = await env.finish(Promise.all(requests));
  assert.equal(peak, 2);
  assert.equal(active, 0);
  assert.deepEqual(results.map(({ data }) => data), ['one', 'two', 'three', 'four']);
  assert.equal(env.starts.some(({ args }) => args === 'canceled'), false);
  env.assertPaced();
});

await check('thrown transports release capacity and terminate with bounded retries', async () => {
  const env = setup(({ args }) => {
    if (args.startsWith('throw')) throw new Error('Fixture transport exception');
    return ok(args);
  });
  const results = await env.finish(Promise.all(['throw-one', 'throw-two', 'healthy'].map((args) => env.query(args))));
  assert.equal(results[0].error.status, 'FETCH_ERROR');
  assert.equal(results[1].error.status, 'FETCH_ERROR');
  assert.equal(results[2].data, 'healthy');
  assert.equal(env.starts.filter(({ args }) => args === 'throw-one').length, 3);
  assert.equal(env.starts.filter(({ args }) => args === 'throw-two').length, 3);
  env.assertPaced();
});

console.log(`Jikan scheduler checks passed (${count} scenarios).`);
