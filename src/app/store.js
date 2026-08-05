import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'src/services/baseApi.js';

export const makeStore = (preloadedState) =>
  configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState,
  });

const store = makeStore();
export default store;
