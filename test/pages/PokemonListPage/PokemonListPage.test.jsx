import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonListPage from 'src/pages/PokemonListPage/PokemonListPage.jsx';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { PAGE_SIZE } from 'src/features/pokemon-list/constants.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { DEX_COMPLETE_MESSAGE } from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.constants.js';
import { EMPTY_MESSAGE } from 'src/pages/PokemonListPage/PokemonListPage.constants.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { createPokemonIndexResponse } from 'test/msw/fixtures/createPokemonIndexResponse.js';
import { mockIntersectionObserver } from 'test/utils/mockIntersectionObserver.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;
const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;

const FIRST_POKEMON_NAME = 'pokemon-1';
const SERVER_ERROR_MESSAGE = 'Server Error';

// Una pagina entera mas un resto: la segunda pagina de scroll infinito es la ultima, y el archivo
// entero se mantiene en un par de decenas de requests por MSW.
const SPECIES_IN_LAST_PAGE = 5;
const SPECIES_IN_INDEX = PAGE_SIZE + SPECIES_IN_LAST_PAGE;
const SECOND_PAGE_FIRST_ID = PAGE_SIZE + 1;
const SECOND_PAGE_FIRST_NAME = `pokemon-${SECOND_PAGE_FIRST_ID}`;

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
const findSecondPageFirstCardName = () =>
  screen.findByRole('heading', { name: SECOND_PAGE_FIRST_NAME });
const getSentinel = () => screen.getByRole('presentation', { hidden: true });

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

  it(
    'brings the next page into view when the sentinel enters the viewport, adding to the cards already there',
    async () => {
      server.use(indexHandler(SPECIES_IN_INDEX), detailHandler());

      renderWithProviders(<PokemonListPage />);
      await findFirstCardName();
      expect(screen.getAllByRole('article')).toHaveLength(PAGE_SIZE);

      mockIntersectionObserver.intersect(getSentinel());

      await findSecondPageFirstCardName();
      expect(screen.getAllByRole('article')).toHaveLength(SPECIES_IN_INDEX);
    },
    FULL_PAGE_TIMEOUT_MS,
  );

  it(
    'keeps the earlier cards and moves the error to the footer when the next page fails, and a retry adds it',
    async () => {
      const user = userEvent.setup();
      let secondPageAttempts = 0;
      server.use(
        indexHandler(SPECIES_IN_INDEX),
        http.get(DETAIL_URL, ({ params }) => {
          const id = Number(params.id);
          const isFirstAttemptAtSecondPage =
            id >= SECOND_PAGE_FIRST_ID && secondPageAttempts < SPECIES_IN_LAST_PAGE;
          if (isFirstAttemptAtSecondPage) {
            secondPageAttempts += 1;
            return HttpResponse.json({ message: SERVER_ERROR_MESSAGE }, { status: 500 });
          }

          return HttpResponse.json({ ...pokemonDetailResponse, id, name: `pokemon-${id}` });
        }),
      );

      renderWithProviders(<PokemonListPage />);
      await findFirstCardName();

      mockIntersectionObserver.intersect(getSentinel());

      const retry = await screen.findByRole('button', { name: RETRY_LABEL });
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(PAGE_SIZE);

      await user.click(retry);

      await findSecondPageFirstCardName();
      expect(screen.getAllByRole('article')).toHaveLength(SPECIES_IN_INDEX);
    },
    FULL_PAGE_TIMEOUT_MS,
  );

  it(
    'shows the closing message once the last page is in, and stops the sentinel from firing',
    async () => {
      server.use(indexHandler(SPECIES_IN_INDEX), detailHandler());

      renderWithProviders(<PokemonListPage />);
      await findFirstCardName();

      mockIntersectionObserver.intersect(getSentinel());
      await findSecondPageFirstCardName();

      expect(await screen.findByText(DEX_COMPLETE_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByRole('presentation', { hidden: true })).not.toBeInTheDocument();
    },
    FULL_PAGE_TIMEOUT_MS,
  );
});
