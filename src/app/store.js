import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { recomendationApi, topApi } from '../features/apiSlice';

const store = configureStore({
  reducer: {
    [topApi.reducerPath]: topApi.reducer,
    [recomendationApi.reducerPath]: recomendationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(recomendationApi.middleware, topApi.middleware),
});

setupListeners(store.dispatch);
export default store;
