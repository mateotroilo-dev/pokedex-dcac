import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import PokemonDetailPage from 'src/pages/PokemonDetailPage/PokemonDetailPage.jsx';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { HOME_LINK_LABEL } from 'src/shared/ui/HomeLink/HomeLink.constants.js';
import { POKEMON_NOT_FOUND_MESSAGE } from 'src/pages/PokemonDetailPage/PokemonDetailPage.constants.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;
const SERVER_ERROR_MESSAGE = 'Server Error';

const routes = [{ path: ROUTES.POKEMON_DETAIL, element: <PokemonDetailPage /> }];

const renderAt = (path) => renderWithProviders(null, { routes, initialEntries: [path] });

describe('PokemonDetailPage', () => {
  it('shows the name, number and types once the pokemon comes back', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    renderAt('/pokemon/1');

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });

  it('shows the not-found message, without a retry button, for a 404', async () => {
    server.use(
      http.get(DETAIL_URL, () => HttpResponse.json({ message: 'Not Found' }, { status: 404 })),
    );

    renderAt('/pokemon/99999');

    expect(await screen.findByText(POKEMON_NOT_FOUND_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: HOME_LINK_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RETRY_LABEL })).not.toBeInTheDocument();
  });

  it('offers a retry for any other failure', async () => {
    server.use(
      http.get(DETAIL_URL, () =>
        HttpResponse.json({ message: SERVER_ERROR_MESSAGE }, { status: 500 }),
      ),
    );

    renderAt('/pokemon/1');

    expect(await screen.findByRole('button', { name: RETRY_LABEL })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(SERVER_ERROR_MESSAGE);
  });

  it('shows the not-found message for an id that is not a number, without asking the API', async () => {
    renderAt('/pokemon/abc');

    expect(await screen.findByText(POKEMON_NOT_FOUND_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RETRY_LABEL })).not.toBeInTheDocument();
  });
});
