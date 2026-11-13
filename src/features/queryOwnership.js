// Store-specific ownership, shared by eager and lazy detail hooks.
const stores = new WeakMap();

export const retainQuery = (dispatch, api, endpoint, arg) => {
  let owners = stores.get(dispatch);
  if (!owners) { owners = new Map(); stores.set(dispatch, owners); }
  const key = JSON.stringify([endpoint, arg]);
  owners.set(key, (owners.get(key) || 0) + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const remaining = owners.get(key) - 1;
    if (remaining) { owners.set(key, remaining); return; }
    owners.delete(key);
    // Allow same-commit replacement/StrictMode subscribers to claim the request.
    queueMicrotask(() => {
      if (!owners.has(key)) dispatch(api.util.getRunningQueryThunk(endpoint, arg))?.abort();
    });
  };
};
