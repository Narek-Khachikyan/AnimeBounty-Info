import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { fetchDataApi } from '../features/apiSlice';

const store = configureStore({
  reducer: {
    [fetchDataApi.reducerPath]: fetchDataApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fetchDataApi.middleware),
});

setupListeners(store.dispatch);
export default store;
