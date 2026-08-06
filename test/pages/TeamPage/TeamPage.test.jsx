import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamPage from 'src/pages/TeamPage/TeamPage.jsx';
import { EMPTY_TEAM_MESSAGE } from 'src/pages/TeamPage/TeamPage.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const NAMES_BY_ID = { 1: 'bulbasaur', 2: 'ivysaur' };

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;

describe('TeamPage', () => {
  it('shows the empty state when the team has no members', () => {
    renderWithProviders(<TeamPage />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [] } },
    });

    expect(screen.getByText(EMPTY_TEAM_MESSAGE)).toBeInTheDocument();
  });

  it('shows one card per team member', async () => {
    server.use(
      http.get(DETAIL_URL, ({ params }) =>
        HttpResponse.json({ ...pokemonDetailResponse, id: Number(params.id) }),
      ),
    );

    renderWithProviders(<TeamPage />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [1, 2] } },
    });

    expect(await screen.findAllByText('bulbasaur')).toHaveLength(2);
    expect(screen.queryByText(EMPTY_TEAM_MESSAGE)).not.toBeInTheDocument();
  });

  it('moves a card and announces the new position through the aria-live region', async () => {
    server.use(
      http.get(DETAIL_URL, ({ params }) =>
        HttpResponse.json({
          ...pokemonDetailResponse,
          id: Number(params.id),
          name: NAMES_BY_ID[params.id],
        }),
      ),
    );
    const user = userEvent.setup();

    renderWithProviders(<TeamPage />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [1, 2] } },
    });
    await screen.findByRole('heading', { name: 'bulbasaur' });
    await screen.findByRole('heading', { name: 'ivysaur' });

    const namesBeforeMove = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(namesBeforeMove).toEqual(['bulbasaur', 'ivysaur']);

    await user.click(
      screen.getByRole('button', { name: 'Mover a bulbasaur a la posición siguiente' }),
    );

    const namesAfterMove = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(namesAfterMove).toEqual(['ivysaur', 'bulbasaur']);
    expect(screen.getByText('bulbasaur movido a la posición 2 de 2')).toBeInTheDocument();
  });
});
