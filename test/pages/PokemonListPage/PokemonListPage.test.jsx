import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppLayout from 'src/app/AppLayout/AppLayout.jsx';
import PokemonListPage from 'src/pages/PokemonListPage/PokemonListPage.jsx';
import { CACHED_LABEL } from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { PAGE_SIZE } from 'src/features/pokemon-list/constants.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { DEX_COMPLETE_MESSAGE } from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.constants.js';
import { CLEAR_SEARCH_LABEL } from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.constants.js';
import { GENERATION_PARAM, SEARCH_PARAM, TYPE_PARAM } from 'src/features/filters/constants.js';
import {
  EMPTY_DEX_MESSAGE,
  NO_SEARCH_RESULTS_MESSAGE,
} from 'src/pages/PokemonListPage/PokemonListPage.constants.js';
import { SENTINEL_TEST_ID } from 'src/shared/ui/InfiniteScrollSentinel/InfiniteScrollSentinel.constants.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';
import { createPokemonIndexResponse } from 'test/msw/fixtures/createPokemonIndexResponse.js';
import { typeIndexResponse } from 'test/msw/fixtures/typeIndexResponse.js';
import { generationIndexResponse } from 'test/msw/fixtures/generationIndexResponse.js';
import { typeResponse } from 'test/msw/fixtures/typeResponse.js';
import { generationResponse } from 'test/msw/fixtures/generationResponse.js';
import { mockIntersectionObserver } from 'test/utils/mockIntersectionObserver.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;
const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;
const TYPE_URL = `${POKEAPI_BASE_URL}type`;
const GENERATION_URL = `${POKEAPI_BASE_URL}generation`;
const TYPE_DETAIL_URL = `${POKEAPI_BASE_URL}type/:name`;
const GENERATION_DETAIL_URL = `${POKEAPI_BASE_URL}generation/:id`;

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

// El fixture real, no la factory: sus nombres no llevan digitos, que es lo que necesita la Tarea 1
// para distinguir el criterio de id del de nombre (ver Tarea 2 en el plan). El detalle tiene que
// devolver ese mismo nombre por id, o la card muestra "pokemon-N" y el test de matcheo no prueba
// nada.
const searchIndexHandler = () => http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse));

const detailNameById = Object.fromEntries(
  pokemonIndexResponse.results.map((result) => [
    Number(result.url.split('/').filter(Boolean).at(-1)),
    result.name,
  ]),
);

const namedDetailHandler = () =>
  http.get(DETAIL_URL, ({ params }) =>
    HttpResponse.json({
      ...pokemonDetailResponse,
      id: Number(params.id),
      name: detailNameById[Number(params.id)],
    }),
  );

// PokemonFilterBar monta los dos selects ademas del buscador: cualquier caso que renderice la
// pagina pide /type y /generation, y con onUnhandledRequest: 'error' eso falla el test sin ellos.
const typesHandler = () => http.get(TYPE_URL, () => HttpResponse.json(typeIndexResponse));
const generationsHandler = () =>
  http.get(GENERATION_URL, () => HttpResponse.json(generationIndexResponse));

// typeResponse trae los ids [1, 2, 10001]: la forma alterna prueba que la interseccion contra el
// indice la descarta, igual que en la Tarea 3. Un tipo que no existe sale 404 -> null, sin error.
const typeDetailHandler = () =>
  http.get(TYPE_DETAIL_URL, ({ params }) => {
    if (params.name === 'banana') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    return HttpResponse.json(typeResponse);
  });

const generationDetailHandler = () =>
  http.get(GENERATION_DETAIL_URL, () => HttpResponse.json(generationResponse));

const findFirstCardName = () => screen.findByRole('heading', { name: FIRST_POKEMON_NAME });
const findSecondPageFirstCardName = () =>
  screen.findByRole('heading', { name: SECOND_PAGE_FIRST_NAME });
const getSentinel = () => screen.getByTestId(SENTINEL_TEST_ID);

// Traer la pagina entera son 21 requests por MSW: con los archivos de test corriendo en paralelo no
// entra en los 5 s del default.
const FULL_PAGE_TIMEOUT_MS = 20000;

describe('PokemonListPage', () => {
  it(
    'holds the grid with skeletons and swaps them for the cards',
    async () => {
      server.use(indexHandler(), detailHandler(), typesHandler(), generationsHandler());

      renderWithProviders(<PokemonListPage />);

      // Los skeletons reservan una card por pokemon de la pagina antes de que llegue ninguno.
      expect(screen.getAllByRole('article')).toHaveLength(PAGE_SIZE);
      expect(screen.queryByRole('heading', { name: FIRST_POKEMON_NAME })).not.toBeInTheDocument();

      await findFirstCardName();

      // Cargada, cada card es un link: el rol article solo aplica mientras es skeleton.
      expect(screen.getAllByRole('link')).toHaveLength(PAGE_SIZE);
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
        typesHandler(),
        generationsHandler(),
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
    server.use(failingIndexHandler(), typesHandler(), generationsHandler());

    renderWithProviders(<PokemonListPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(SERVER_ERROR_MESSAGE);
  });

  it('says so when the dex comes back empty', async () => {
    server.use(indexHandler(0), typesHandler(), generationsHandler());

    renderWithProviders(<PokemonListPage />);

    expect(await screen.findByText(EMPTY_DEX_MESSAGE)).toBeInTheDocument();
  });

  it(
    'brings the next page into view when the sentinel enters the viewport, adding to the cards already there',
    async () => {
      server.use(
        indexHandler(SPECIES_IN_INDEX),
        detailHandler(),
        typesHandler(),
        generationsHandler(),
      );

      renderWithProviders(<PokemonListPage />);
      await findFirstCardName();
      expect(screen.getAllByRole('link')).toHaveLength(PAGE_SIZE);

      mockIntersectionObserver.intersect(getSentinel());

      await findSecondPageFirstCardName();
      expect(screen.getAllByRole('link')).toHaveLength(SPECIES_IN_INDEX);
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
        typesHandler(),
        generationsHandler(),
      );

      renderWithProviders(<PokemonListPage />);
      await findFirstCardName();

      mockIntersectionObserver.intersect(getSentinel());

      const retry = await screen.findByRole('button', { name: RETRY_LABEL });
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(PAGE_SIZE);

      await user.click(retry);

      await findSecondPageFirstCardName();
      expect(screen.getAllByRole('link')).toHaveLength(SPECIES_IN_INDEX);
    },
    FULL_PAGE_TIMEOUT_MS,
  );

  it(
    'shows the closing message once the last page is in, and stops the sentinel from firing',
    async () => {
      server.use(
        indexHandler(SPECIES_IN_INDEX),
        detailHandler(),
        typesHandler(),
        generationsHandler(),
      );

      renderWithProviders(<PokemonListPage />);
      await findFirstCardName();

      mockIntersectionObserver.intersect(getSentinel());
      await findSecondPageFirstCardName();

      expect(await screen.findByText(DEX_COMPLETE_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByTestId(SENTINEL_TEST_ID)).not.toBeInTheDocument();
    },
    FULL_PAGE_TIMEOUT_MS,
  );

  it('paints only the cards that match the search term already in the URL', async () => {
    server.use(searchIndexHandler(), namedDetailHandler(), typesHandler(), generationsHandler());

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${SEARCH_PARAM}=venusaur`],
    });

    expect(await screen.findByRole('heading', { name: 'venusaur' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.queryByRole('heading', { name: 'bulbasaur' })).not.toBeInTheDocument();
  });

  it('shows the no-results empty state and no footer for a term with no matches', async () => {
    server.use(searchIndexHandler(), typesHandler(), generationsHandler());

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${SEARCH_PARAM}=zzz`],
    });

    expect(await screen.findByText(NO_SEARCH_RESULTS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByTestId(SENTINEL_TEST_ID)).not.toBeInTheDocument();
    expect(screen.queryByText(DEX_COMPLETE_MESSAGE)).not.toBeInTheDocument();
  });

  it('shows the full listing again after clearing the search term', async () => {
    const user = userEvent.setup();
    server.use(searchIndexHandler(), namedDetailHandler(), typesHandler(), generationsHandler());

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${SEARCH_PARAM}=venusaur`],
    });

    await screen.findByRole('heading', { name: 'venusaur' });
    expect(screen.getAllByRole('link')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: CLEAR_SEARCH_LABEL }));

    await screen.findByRole('heading', { name: 'bulbasaur' });
    expect(screen.getAllByRole('link')).toHaveLength(5);
  });

  it('paints only the cards that match the type already in the URL', async () => {
    server.use(
      searchIndexHandler(),
      namedDetailHandler(),
      typesHandler(),
      generationsHandler(),
      typeDetailHandler(),
      generationDetailHandler(),
    );

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${TYPE_PARAM}=grass`],
    });

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ivysaur' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('paints only the cards that match the generation already in the URL', async () => {
    server.use(
      searchIndexHandler(),
      namedDetailHandler(),
      typesHandler(),
      generationsHandler(),
      typeDetailHandler(),
      generationDetailHandler(),
    );

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${GENERATION_PARAM}=1`],
    });

    expect(await screen.findByRole('heading', { name: 'venusaur' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('combines a type and a search term in the URL', async () => {
    server.use(
      searchIndexHandler(),
      namedDetailHandler(),
      typesHandler(),
      generationsHandler(),
      typeDetailHandler(),
      generationDetailHandler(),
    );

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${TYPE_PARAM}=grass&${SEARCH_PARAM}=ivy`],
    });

    expect(await screen.findByRole('heading', { name: 'ivysaur' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('shows the full listing for a type that does not exist', async () => {
    server.use(
      searchIndexHandler(),
      namedDetailHandler(),
      typesHandler(),
      generationsHandler(),
      typeDetailHandler(),
      generationDetailHandler(),
    );

    renderWithProviders(<PokemonListPage />, {
      initialEntries: [`/?${TYPE_PARAM}=banana`],
    });

    await screen.findByRole('heading', { name: 'bulbasaur' });
    expect(screen.getAllByRole('link')).toHaveLength(5);
  });

  it('reports its freshness to the header, which shows the page as cached when it hydrated after the fetch', async () => {
    server.use(indexHandler(), detailHandler(), typesHandler(), generationsHandler());

    // La pagina sola no trae header (ver renderIndicator en los otros tests de esta suite): hay que
    // montar la ruta con AppLayout, que es quien la envuelve en el FreshnessProvider real. El
    // hydratedAt "de disco" se simula mas adelante que el fetch en vivo de MSW, que es la misma
    // relacion de orden que produce una sesion que rehidrato despues de haber cacheado el dato.
    renderWithProviders(null, {
      routes: [
        {
          path: '/',
          element: <AppLayout />,
          children: [{ index: true, element: <PokemonListPage /> }],
        },
      ],
      initialEntries: ['/'],
      preloadedState: { [UI_REDUCER_PATH]: { hydratedAt: Date.now() + 60_000 } },
    });

    await findFirstCardName();

    expect(await screen.findByText(new RegExp(CACHED_LABEL))).toBeInTheDocument();
  });
});
