import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamMemberCard from 'src/features/team/components/TeamMemberCard/TeamMemberCard.jsx';
import { TOAST_DISMISS_LABEL } from 'src/shared/ui/Toast/Toast.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;

const preloadedState = { [TEAM_REDUCER_PATH]: { ids: [1] } };

describe('TeamMemberCard', () => {
  it('shows the sprite, number, name and types once the pokemon comes back', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    renderWithProviders(<TeamMemberCard id={1} />, { preloadedState });

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/1');
  });

  it('removes the card from the team without opening a toast', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));
    const user = userEvent.setup();

    const { store } = renderWithProviders(<TeamMemberCard id={1} />, { preloadedState });
    await screen.findByRole('heading', { name: 'bulbasaur' });

    await user.click(screen.getByRole('button'));

    expect(store.getState()[TEAM_REDUCER_PATH].ids).toEqual([]);
    expect(screen.queryByRole('button', { name: TOAST_DISMISS_LABEL })).not.toBeInTheDocument();
  });

  it('still draws the remove button, titled with the id, when the pokemon fails to load', async () => {
    server.use(
      http.get(DETAIL_URL, () => HttpResponse.json({ message: 'Not Found' }, { status: 404 })),
    );

    renderWithProviders(<TeamMemberCard id={9999} />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [9999] } },
    });

    const removeButton = await screen.findByRole('button');
    expect(removeButton).toHaveAttribute('title', 'Quitar a 9999 del equipo');
  });
});
