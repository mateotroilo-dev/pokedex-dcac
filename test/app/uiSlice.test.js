import { REHYDRATE } from 'redux-persist';
import uiReducer, { selectHydratedAt } from 'src/app/uiSlice.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { API_PERSIST_KEY, UI_PERSIST_KEY } from 'src/shared/lib/constants/persist.js';

const rehydrate = (action) => uiReducer(undefined, { type: REHYDRATE, ...action });

describe('uiSlice', () => {
  it('starts without a hydration timestamp', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual({ hydratedAt: null });
  });

  it('stays unhydrated when REHYDRATE brings no payload', () => {
    expect(rehydrate({ key: UI_PERSIST_KEY })).toEqual({ hydratedAt: null });
  });

  it('records that the session started from cache', () => {
    const state = rehydrate({ key: UI_PERSIST_KEY, payload: { hydratedAt: null } });

    expect(state.hydratedAt).toEqual(expect.any(Number));
  });

  it('records it too when the REHYDRATE belongs to another branch', () => {
    const state = rehydrate({ key: API_PERSIST_KEY, payload: { queries: {} } });

    expect(state.hydratedAt).toEqual(expect.any(Number));
  });
});

describe('selectHydratedAt', () => {
  it('reads the timestamp out of the ui branch', () => {
    expect(selectHydratedAt({ [UI_REDUCER_PATH]: { hydratedAt: 1234 } })).toBe(1234);
  });
});
