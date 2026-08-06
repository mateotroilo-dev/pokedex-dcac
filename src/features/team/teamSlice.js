import { createSlice } from '@reduxjs/toolkit';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { MAX_TEAM_SIZE } from 'src/features/team/constants.js';

const initialState = { ids: [] };

const teamSlice = createSlice({
  name: TEAM_REDUCER_PATH,
  initialState,
  reducers: {
    addToTeam: (state, action) => {
      if (state.ids.includes(action.payload)) return;
      if (state.ids.length >= MAX_TEAM_SIZE) return;

      state.ids.push(action.payload);
    },
    removeFromTeam: (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    moveTeamMember: (state, action) => {
      const { from, to } = action.payload;
      if (from < 0 || from >= state.ids.length) return;

      const clampedTo = Math.min(Math.max(to, 0), state.ids.length - 1);
      const [moved] = state.ids.splice(from, 1);
      state.ids.splice(clampedTo, 0, moved);
    },
  },
});

export const { addToTeam, removeFromTeam, moveTeamMember } = teamSlice.actions;

export const selectTeamIds = (state) => state[TEAM_REDUCER_PATH].ids;
export const selectIsInTeam = (state, id) => state[TEAM_REDUCER_PATH].ids.includes(id);
export const selectIsTeamFull = (state) => state[TEAM_REDUCER_PATH].ids.length >= MAX_TEAM_SIZE;

export default teamSlice.reducer;
