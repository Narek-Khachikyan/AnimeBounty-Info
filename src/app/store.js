import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import recomendationApi from '../features/apiSlice';


// Создаем Redux store и подключаем RTK Query
const store = configureStore({
  reducer: {
    [recomendationApi.reducerPath]: recomendationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(recomendationApi.middleware),
});

// Подключаем слушатели для обработки запросов и мутаций
setupListeners(store.dispatch);

export default store;
