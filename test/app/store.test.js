import { PERSIST } from 'redux-persist';
import { makeStore } from 'src/app/store.js';
import { rootPersistConfig, uiPersistConfig } from 'src/app/persistConfig.js';
import uiReducer from 'src/app/uiSlice.js';
import { baseApi } from 'src/services/baseApi.js';
import { TEAM_REDUCER_PATH, UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';

describe('makeStore', () => {
  it('mounts the baseApi reducer in the state', () => {
    const store = makeStore();

    expect(store.getState()).toHaveProperty(baseApi.reducerPath);
  });

  it('mounts the ui reducer in the state', () => {
    const store = makeStore();

    expect(store.getState()).toHaveProperty(UI_REDUCER_PATH);
  });

  it('mounts the team reducer in the state', () => {
    const store = makeStore();

    expect(store.getState()).toHaveProperty(TEAM_REDUCER_PATH);
  });

  it('does not warn about serializability when redux-persist dispatches PERSIST', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const store = makeStore();

    store.dispatch({ type: PERSIST, register: () => {}, rehydrate: () => {} });

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('rootPersistConfig', () => {
  it('blacklists the branches that persist themselves', () => {
    expect(rootPersistConfig.blacklist).toEqual([baseApi.reducerPath, UI_REDUCER_PATH]);
  });
});

describe('uiPersistConfig', () => {
  // Si alguien renombra el campo en el slice, el blacklist deja de coincidir en silencio y
  // `hydratedAt` vuelve a persistirse, que es el bug que este blacklist existe para evitar.
  it('blacklists fields the ui state actually has', () => {
    const state = uiReducer(undefined, { type: 'unknown' });

    uiPersistConfig.blacklist.forEach((field) => expect(state).toHaveProperty(field));
  });
});
