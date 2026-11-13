const JIKAN_REQUEST_GAP_MS = 900;
const JIKAN_429_COOLDOWN_MS = 5000;
const MAX_RETRIES = 2;
const MAX_IN_FLIGHT = 2;

const abortedResult = () => ({ error: { status: 'FETCH_ERROR', error: 'AbortError: request canceled' } });
const isTransient = (status) => status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR' ||
  (typeof status === 'number' && status >= 500 && status <= 599);

// One admission queue per API instance. Responses never own the start gate.
export const createJikanBaseQuery = (rawBaseQuery) => {
  const pending = [];
  let nextRequestAt = 0;
  let cooldownUntil = 0;
  let timer;
  let inFlight = 0;

  const pump = () => {
    clearTimeout(timer);
    if (!pending.length || inFlight >= MAX_IN_FLIGHT) return;
    const delay = Math.max(nextRequestAt - Date.now(), cooldownUntil - Date.now(), 0);
    if (delay > 0) {
      timer = setTimeout(pump, delay);
      return;
    }
    const entry = pending.shift();
    entry.signal?.removeEventListener('abort', entry.cancel);
    inFlight += 1;
    nextRequestAt = Date.now() + JIKAN_REQUEST_GAP_MS;
    entry.resolve(true);
    pump();
  };

  const acquire = (signal) => new Promise((resolve) => {
    if (signal?.aborted) { resolve(false); return; }
    const entry = { signal, resolve };
    entry.cancel = () => {
      const index = pending.indexOf(entry);
      if (index !== -1) pending.splice(index, 1);
      signal.removeEventListener('abort', entry.cancel);
      resolve(false);
      pump();
    };
    signal?.addEventListener('abort', entry.cancel, { once: true });
    pending.push(entry);
    pump();
  });

  return async (args, api, extraOptions) => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      if (!await acquire(api.signal)) return abortedResult();
      let result;
      try {
        result = api.signal?.aborted ? abortedResult() : await rawBaseQuery(args, api, extraOptions);
      } catch (error) {
        result = { error: { status: 'FETCH_ERROR', error: String(error) } };
      } finally {
        inFlight -= 1;
      }
      const status = result.error?.status;
      if (status === 429) {
        const retryAfter = result.meta?.response?.headers?.get('Retry-After');
        const seconds = retryAfter === null || retryAfter === undefined ? NaN : Number(retryAfter);
        const retryAt = Number.isFinite(seconds) ? Date.now() + Math.max(0, seconds) * 1000 : Date.parse(retryAfter);
        cooldownUntil = Math.max(cooldownUntil, Date.now() + JIKAN_429_COOLDOWN_MS, Number.isFinite(retryAt) ? retryAt : 0);
      }
      pump();
      if (api.signal?.aborted) return abortedResult();
      if (status !== 429 && !isTransient(status)) return result;
      if (attempt === MAX_RETRIES) return result;
    }
  };
};
