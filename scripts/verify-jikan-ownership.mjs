import assert from 'node:assert/strict';
import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
import { createJikanBaseQuery } from '../src/features/jikanScheduler.js';
import { retainQuery } from '../src/features/queryOwnership.js';

// Exercise actual RTK handles and getRunningQueryThunk cancellation together.
const flush = () => new Promise((resolve) => setImmediate(resolve));
const setup = () => {
  const starts = [];
  const requests = new Map();
  const api = createApi({
    reducerPath: 'ownershipFixture',
    baseQuery: createJikanBaseQuery((arg, { signal }) => {
      starts.push({ arg, at: Date.now() });
      return new Promise((resolve) => {
        const abort = () => resolve({ error: { status: 'FETCH_ERROR', error: 'aborted fixture' } });
        signal.addEventListener('abort', abort, { once: true });
        requests.set(arg, {
          signal,
          complete: () => {
            signal.removeEventListener('abort', abort);
            resolve({ data: `content:${arg}` });
          },
        });
      });
    }),
    endpoints: (builder) => ({ record: builder.query({ query: (arg) => arg }) }),
  });
  const store = configureStore({ reducer: { [api.reducerPath]: api.reducer }, middleware: (getDefault) => getDefault().concat(api.middleware) });
  const handles = [];
  const claim = (arg) => {
    const release = retainQuery(store.dispatch, api, 'record', arg);
    const handle = store.dispatch(api.endpoints.record.initiate(arg));
    handles.push(handle);
    return { handle, release };
  };
  const cleanup = () => {
    handles.forEach((handle) => { handle.abort(); handle.unsubscribe(); });
    store.dispatch(api.util.resetApiState());
  };
  return { starts, requests, claim, cleanup };
};

{
  const env = setup();
  try {
    const first = env.claim('shared');
    const second = env.claim('shared');
    await flush();
    assert.equal(env.starts.length, 1, 'RTK must deduplicate the two shared owners');
    const { signal } = env.requests.get('shared');
    first.release();
    await flush();
    assert.equal(signal.aborted, false, 'One remaining owner must keep the shared transport alive');
    second.release();
    await flush();
    assert.equal(signal.aborted, true, 'Final owner release must abort the actual running query');
    assert.equal((await first.handle).error.name, 'AbortError');
    assert.equal((await second.handle).error.name, 'AbortError');
    console.log('PASS shared transport survives one release and aborts after final release');
  } finally { env.cleanup(); }
}

{
  const env = setup();
  try {
    const first = env.claim('shared-success');
    const second = env.claim('shared-success');
    await flush();
    first.release();
    await flush();
    env.requests.get('shared-success').complete();
    assert.equal((await second.handle).data, 'content:shared-success');
    assert.equal((await first.handle).data, 'content:shared-success');
    second.release();
    console.log('PASS remaining shared owner receives successful content');
  } finally { env.cleanup(); }
}

{
  const env = setup();
  try {
    const first = env.claim('strict-replacement');
    await flush();
    first.release();
    const replacement = env.claim('strict-replacement');
    await flush();
    assert.equal(env.requests.get('strict-replacement').signal.aborted, false);
    assert.equal(env.starts.length, 1);
    env.requests.get('strict-replacement').complete();
    assert.equal((await replacement.handle).data, 'content:strict-replacement');
    replacement.release();
    console.log('PASS same-tick StrictMode replacement retains the original request');
  } finally { env.cleanup(); }
}

{
  const env = setup();
  try {
    const active = env.claim('active');
    const obsolete = env.claim('obsolete');
    const current = env.claim('current');
    await flush();
    obsolete.release();
    assert.equal((await obsolete.handle).error.name, 'AbortError');
    const deadline = Date.now() + 1700;
    while (!env.requests.has('current') && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 10));
    assert.ok(env.requests.has('current'), 'Current query should use the next 900ms slot, not wait for an obsolete 1800ms slot');
    assert.deepEqual(env.starts.map(({ arg }) => arg), ['active', 'current']);
    assert.ok(env.starts[1].at - env.starts[0].at >= 900);
    env.requests.get('active').complete();
    env.requests.get('current').complete();
    assert.equal((await current.handle).data, 'content:current');
    await active.handle;
    active.release();
    current.release();
    console.log('PASS obsolete queued owner cancels without fetching or consuming current slot');
  } finally { env.cleanup(); }
}

console.log('Jikan ownership integration checks passed (4 scenarios).');
