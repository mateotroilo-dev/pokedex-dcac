import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import { baseApi } from 'src/services/baseApi.js';
import uiReducer from 'src/app/uiSlice.js';
import { apiPersistConfig, rootPersistConfig, uiPersistConfig } from 'src/app/persistConfig.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';

// Los reducers persistidos se arman por store y no una sola vez a nivel modulo: `persistReducer`
// guarda estado propio en su closure, y compartirlo entre los stores que arma cada test los
// acopla entre si.
const makePersistedReducer = () =>
  persistReducer(
    rootPersistConfig,
    combineReducers({
      [baseApi.reducerPath]: persistReducer(apiPersistConfig, baseApi.reducer),
      [UI_REDUCER_PATH]: persistReducer(uiPersistConfig, uiReducer),
    }),
  );

export const makeStore = (preloadedState) =>
  configureStore({
    reducer: makePersistedReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
    preloadedState,
  });

const store = makeStore();
export default store;
