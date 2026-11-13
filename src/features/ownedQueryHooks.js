import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { retainQuery } from './queryOwnership';

// All exported detail query hooks participate, including lazy and eager callers.
export const createOwnedQueryHook = (api, endpoint) => function useOwnedQuery(arg, options) {
  const dispatch = useDispatch();
  const result = api.endpoints[endpoint].useQuery(arg, options);
  const enabled = !options?.skip;
  useEffect(() => {
    if (enabled) return retainQuery(dispatch, api, endpoint, arg);
    return undefined;
  }, [dispatch, arg, enabled]);
  return result;
};

export const createOwnedLazyQueryHook = (api, endpoint) => function useOwnedLazyQuery(options) {
  const dispatch = useDispatch();
  const result = api.endpoints[endpoint].useLazyQuery(options);
  const arg = result[1].originalArgs;
  const enabled = !result[1].isUninitialized;
  useEffect(() => {
    if (enabled) return retainQuery(dispatch, api, endpoint, arg);
    return undefined;
  }, [dispatch, arg, enabled]);
  return result;
};
