import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import AppLayout from 'src/app/AppLayout/AppLayout.jsx';
import PokemonDetailPage from 'src/pages/PokemonDetailPage/PokemonDetailPage.jsx';
import { CACHED_LABEL } from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { HOME_LINK_LABEL } from 'src/shared/ui/HomeLink/HomeLink.constants.js';
import { ADD_TO_TEAM_LABEL } from 'src/features/team/components/TeamToggleButton/TeamToggleButton.constants.js';
import { POKEMON_NOT_FOUND_MESSAGE } from 'src/pages/PokemonDetailPage/PokemonDetailPage.constants.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;
const SERVER_ERROR_MESSAGE = 'Server Error';

const bulbasaur = toPokemon(pokemonDetailResponse);

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
    expect(screen.getByText('0,7 m')).toBeInTheDocument();
    expect(screen.getByText('6,9 kg')).toBeInTheDocument();
    expect(screen.getByText('overgrow')).toBeInTheDocument();
  });

  it('shows the team toggle once the pokemon comes back', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    renderAt('/pokemon/1');

    expect(await screen.findByRole('button', { name: ADD_TO_TEAM_LABEL })).toBeInTheDocument();
  });

  it('leaves the gallery main image as the only named image on the screen', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    renderAt('/pokemon/1');

    // Las miniaturas van con alt="", asi que no cuentan como img para getAllByRole. Que quede una
    // sola es lo que verifica que el summary ya no trae su propia copia del artwork.
    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();

    const images = screen.getAllByRole('img');

    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', bulbasaur.sprites.artwork);
  });

  it('shows the not-found message, without a retry button, for a 404', async () => {
    server.use(
      http.get(DETAIL_URL, () => HttpResponse.json({ message: 'Not Found' }, { status: 404 })),
    );

    renderAt('/pokemon/99999');

    expect(await screen.findByText(POKEMON_NOT_FOUND_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: HOME_LINK_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RETRY_LABEL })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: ADD_TO_TEAM_LABEL })).not.toBeInTheDocument();
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
    expect(screen.queryByRole('button', { name: ADD_TO_TEAM_LABEL })).not.toBeInTheDocument();
  });

  it('shows the not-found message for an id that is not a number, without asking the API', async () => {
    renderAt('/pokemon/abc');

    expect(await screen.findByText(POKEMON_NOT_FOUND_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RETRY_LABEL })).not.toBeInTheDocument();
  });

  it('reports its freshness to the header, which shows the page as cached when it hydrated after the fetch', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    // La pagina sola no trae header: hay que montar la ruta con AppLayout, que la envuelve en el
    // FreshnessProvider real. El hydratedAt "de disco" se simula mas adelante que el fetch en vivo
    // de MSW, que es la misma relacion de orden que produce una sesion que rehidrato despues de
    // haber cacheado el dato.
    renderWithProviders(null, {
      routes: [
        {
          path: '/',
          element: <AppLayout />,
          children: [{ path: ROUTES.POKEMON_DETAIL, element: <PokemonDetailPage /> }],
        },
      ],
      initialEntries: ['/pokemon/1'],
      preloadedState: { [UI_REDUCER_PATH]: { hydratedAt: Date.now() + 60_000 } },
    });

    await screen.findByRole('heading', { name: 'bulbasaur' });

    expect(await screen.findByText(new RegExp(CACHED_LABEL))).toBeInTheDocument();
  });
});
