import { makeStore } from 'src/app/store.js';
import { baseApi } from 'src/services/baseApi.js';

describe('makeStore', () => {
  it('mounts the baseApi reducer in the state', () => {
    const store = makeStore();

    expect(store.getState()).toHaveProperty(baseApi.reducerPath);
  });
});
