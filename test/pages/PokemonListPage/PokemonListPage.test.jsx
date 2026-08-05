import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonListPage from 'src/pages/PokemonListPage/PokemonListPage.jsx';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { PAGE_SIZE } from 'src/features/pokemon-list/constants.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { EMPTY_MESSAGE } from 'src/pages/PokemonListPage/PokemonListPage.constants.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { createPokemonIndexResponse } from 'test/msw/fixtures/createPokemonIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;
const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;

const FIRST_POKEMON_NAME = 'pokemon-1';
const SERVER_ERROR_MESSAGE = 'Server Error';

const indexHandler = (speciesCount = PAGE_SIZE) =>
  http.get(INDEX_URL, () => HttpResponse.json(createPokemonIndexResponse(speciesCount)));

const detailHandler = () =>
  http.get(DETAIL_URL, ({ params }) =>
    HttpResponse.json({
      ...pokemonDetailResponse,
      id: Number(params.id),
      name: `pokemon-${params.id}`,
    }),
  );

const failingIndexHandler = () =>
  http.get(INDEX_URL, () => HttpResponse.json({ message: SERVER_ERROR_MESSAGE }, { status: 500 }));

const findFirstCardName = () => screen.findByRole('heading', { name: FIRST_POKEMON_NAME });

// Traer la pagina entera son 21 requests por MSW: con los archivos de test corriendo en paralelo no
// entra en los 5 s del default.
const FULL_PAGE_TIMEOUT_MS = 20000;

describe('PokemonListPage', () => {
  it(
    'holds the grid with skeletons and swaps them for the cards',
    async () => {
      server.use(indexHandler(), detailHandler());

      renderWithProviders(<PokemonListPage />);

      // Los skeletons reservan una card por pokemon de la pagina antes de que llegue ninguno.
      expect(screen.getAllByRole('article')).toHaveLength(PAGE_SIZE);
      expect(screen.queryByRole('heading', { name: FIRST_POKEMON_NAME })).not.toBeInTheDocument();

      await findFirstCardName();

      expect(screen.getAllByRole('article')).toHaveLength(PAGE_SIZE);
      expect(screen.getByText('#0001')).toBeInTheDocument();
    },
    FULL_PAGE_TIMEOUT_MS,
  );

  it(
    'offers a retry that asks again after the page fails',
    async () => {
      const user = userEvent.setup();
      let indexRequests = 0;
      server.use(
        http.get(INDEX_URL, () => {
          indexRequests += 1;

          return indexRequests === 1
            ? HttpResponse.json({ message: SERVER_ERROR_MESSAGE }, { status: 500 })
            : HttpResponse.json(createPokemonIndexResponse(PAGE_SIZE));
        }),
        detailHandler(),
      );

      renderWithProviders(<PokemonListPage />);

      const retry = await screen.findByRole('button', { name: RETRY_LABEL });

      expect(indexRequests).toBe(1);

      await user.click(retry);

      expect(await findFirstCardName()).toBeInTheDocument();
      expect(indexRequests).toBe(2);
    },
    FULL_PAGE_TIMEOUT_MS,
  );

  it('surfaces the message that parseApiError normalized', async () => {
    server.use(failingIndexHandler());

    renderWithProviders(<PokemonListPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(SERVER_ERROR_MESSAGE);
  });

  it('says so when the dex comes back empty', async () => {
    server.use(indexHandler(0));

    renderWithProviders(<PokemonListPage />);

    expect(await screen.findByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });
});
