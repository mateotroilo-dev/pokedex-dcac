import teamReducer, {
  addToTeam,
  moveTeamMember,
  removeFromTeam,
  selectIsInTeam,
  selectIsTeamFull,
  selectTeamIds,
} from 'src/features/team/teamSlice.js';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { MAX_TEAM_SIZE } from 'src/features/team/constants.js';

describe('teamSlice', () => {
  it('starts with an empty team', () => {
    expect(teamReducer(undefined, { type: 'unknown' })).toEqual({ ids: [] });
  });

  it('adds a pokemon to the team', () => {
    const state = teamReducer(undefined, addToTeam(1));

    expect(state.ids).toEqual([1]);
  });

  it('ignores adding a pokemon already in the team', () => {
    const state = teamReducer({ ids: [1] }, addToTeam(1));

    expect(state.ids).toEqual([1]);
  });

  it('ignores adding a 7th pokemon when the team is full', () => {
    const fullTeam = { ids: [1, 2, 3, 4, 5, 6] };

    const state = teamReducer(fullTeam, addToTeam(7));

    expect(state.ids).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('removes a pokemon from the team', () => {
    const state = teamReducer({ ids: [1, 2, 3] }, removeFromTeam(2));

    expect(state.ids).toEqual([1, 3]);
  });

  it('moves a team member, changing the order', () => {
    const state = teamReducer({ ids: [1, 2, 3] }, moveTeamMember({ from: 0, to: 2 }));

    expect(state.ids).toEqual([2, 3, 1]);
  });
});

describe('selectTeamIds', () => {
  it('reads the ids out of the team branch', () => {
    expect(selectTeamIds({ [TEAM_REDUCER_PATH]: { ids: [1, 2] } })).toEqual([1, 2]);
  });
});

describe('selectIsInTeam', () => {
  it('is true when the id is in the team', () => {
    expect(selectIsInTeam({ [TEAM_REDUCER_PATH]: { ids: [1, 2] } }, 1)).toBe(true);
  });

  it('is false when the id is not in the team', () => {
    expect(selectIsInTeam({ [TEAM_REDUCER_PATH]: { ids: [1, 2] } }, 3)).toBe(false);
  });
});

describe('selectIsTeamFull', () => {
  it('is false when the team has room left', () => {
    expect(selectIsTeamFull({ [TEAM_REDUCER_PATH]: { ids: [1] } })).toBe(false);
  });

  it('is true when the team reached the max size', () => {
    const ids = Array.from({ length: MAX_TEAM_SIZE }, (_, index) => index + 1);

    expect(selectIsTeamFull({ [TEAM_REDUCER_PATH]: { ids } })).toBe(true);
  });
});
