import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamToggleButton from 'src/features/team/components/TeamToggleButton/TeamToggleButton.jsx';
import {
  ADD_TO_TEAM_LABEL,
  REMOVE_FROM_TEAM_LABEL,
  TEAM_FULL_TOAST_MESSAGE,
} from 'src/features/team/components/TeamToggleButton/TeamToggleButton.constants.js';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const POKEMON = { id: 1, name: 'bulbasaur' };

describe('TeamToggleButton', () => {
  it('adds the pokemon to the team and shows a toast', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<TeamToggleButton pokemon={POKEMON} />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [] } },
    });

    await user.click(screen.getByRole('button', { name: ADD_TO_TEAM_LABEL }));

    expect(store.getState()[TEAM_REDUCER_PATH].ids).toEqual([1]);
    expect(screen.getByText('bulbasaur se agregó al equipo')).toBeInTheDocument();
  });

  it('removes the pokemon from the team and shows a toast', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<TeamToggleButton pokemon={POKEMON} />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [1] } },
    });

    await user.click(screen.getByRole('button', { name: REMOVE_FROM_TEAM_LABEL }));

    expect(store.getState()[TEAM_REDUCER_PATH].ids).toEqual([]);
    expect(screen.getByText('bulbasaur se quitó del equipo')).toBeInTheDocument();
  });

  it('does not add a 7th pokemon and warns that the team is full', async () => {
    const user = userEvent.setup();
    const fullTeam = [2, 3, 4, 5, 6, 7];
    const { store } = renderWithProviders(<TeamToggleButton pokemon={POKEMON} />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: fullTeam } },
    });

    await user.click(screen.getByRole('button', { name: ADD_TO_TEAM_LABEL }));

    expect(store.getState()[TEAM_REDUCER_PATH].ids).toEqual(fullTeam);
    expect(screen.getByText(TEAM_FULL_TOAST_MESSAGE)).toBeInTheDocument();
  });
});
