import { createSlice } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';

const initialState = { hydratedAt: null };

const uiSlice = createSlice({
  name: UI_REDUCER_PATH,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Sin filtrar por `action.key`: llega un REHYDRATE por rama persistida, y esto responde "esta
    // sesion arranco desde cache", no "la rama ui arranco desde cache".
    builder.addCase(REHYDRATE, (state, action) => {
      if (!action.payload) return;

      state.hydratedAt = Date.now();
    });
  },
});

export const selectHydratedAt = (state) => state[UI_REDUCER_PATH].hydratedAt;

export default uiSlice.reducer;
