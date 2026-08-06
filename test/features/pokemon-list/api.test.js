import { http, HttpResponse } from 'msw';
import { server } from 'test/msw/server.js';
import { makeStore } from 'src/app/store.js';
import { pokemonListApi } from 'src/features/pokemon-list/api.js';
import { pokemonApi } from 'src/services/pokemonApi.js';
import { POKEAPI_BASE_URL, POKEMON_TAG_TYPE } from 'src/shared/lib/constants/api.js';
import { PAGE_SIZE, POKEMON_INDEX_TAG_ID } from 'src/features/pokemon-list/constants.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { createPokemonIndexResponse } from 'test/msw/fixtures/createPokemonIndexResponse.js';
import { typeResponse } from 'test/msw/fixtures/typeResponse.js';
import { generationResponse } from 'test/msw/fixtures/generationResponse.js';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;
const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;
const TYPE_URL = `${POKEAPI_BASE_URL}type/:name`;
const GENERATION_URL = `${POKEAPI_BASE_URL}generation/:id`;

const SPECIES_IN_INDEX = PAGE_SIZE + 5;

const fetchIndex = () => makeStore().dispatch(pokemonListApi.endpoints.getPokemonIndex.initiate());

const indexHandler = () =>
  http.get(INDEX_URL, () => HttpResponse.json(createPokemonIndexResponse(SPECIES_IN_INDEX)));

const detailHandler = (failingId) =>
  http.get(DETAIL_URL, ({ params }) => {
    if (params.id === failingId) {
      return HttpResponse.json({ message: 'Server Error' }, { status: 500 });
    }

    return HttpResponse.json({
      ...pokemonDetailResponse,
      id: Number(params.id),
      name: `pokemon-${params.id}`,
    });
  });

const typeHandler = (failingName) =>
  http.get(TYPE_URL, ({ params }) => {
    if (params.name === 'nonexistent') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    if (params.name === failingName) {
      return HttpResponse.json({ message: 'Server Error' }, { status: 500 });
    }

    return HttpResponse.json(typeResponse);
  });

const generationHandler = () =>
  http.get(GENERATION_URL, () => HttpResponse.json(generationResponse));

describe('getPokemonIndex', () => {
  it('returns the base species, without the alternate forms', async () => {
    server.use(http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)));

    const { data } = await fetchIndex();

    expect(data).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      { id: 3, name: 'venusaur' },
      { id: 386, name: 'deoxys-normal' },
      { id: 1025, name: 'pecharunt' },
    ]);
  });

  it('asks for the whole index in a single request', async () => {
    let requestedUrl;
    server.use(
      http.get(INDEX_URL, ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json(pokemonIndexResponse);
      }),
    );

    await fetchIndex();

    expect(requestedUrl.searchParams.get('limit')).toBe('100000');
  });

  it('normalizes a failing response into a status and a message', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json({ message: 'Server Error' }, { status: 500 })),
    );

    const { error } = await fetchIndex();

    expect(error).toEqual({ status: 500, message: 'Server Error' });
  });

  it('provides the index tag, so invalidating it reaches this query', async () => {
    server.use(http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)));
    const store = makeStore();

    await store.dispatch(pokemonListApi.endpoints.getPokemonIndex.initiate());

    expect(
      pokemonListApi.util.selectInvalidatedBy(store.getState(), [
        { type: POKEMON_TAG_TYPE, id: POKEMON_INDEX_TAG_ID },
      ]),
    ).toEqual([expect.objectContaining({ endpointName: 'getPokemonIndex' })]);
  });
});

describe('getPokemonPage', () => {
  const fetchFirstPage = (store) =>
    store.dispatch(pokemonListApi.endpoints.getPokemonPage.initiate());

  const fetchNextPage = (store) =>
    store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate(undefined, {
        direction: 'forward',
      }),
    );

  it('brings a window of the index, already transformed into pokemon', async () => {
    server.use(indexHandler(), detailHandler());

    const { data } = await fetchFirstPage(makeStore());

    expect(data.pages).toHaveLength(1);
    expect(data.pages[0]).toHaveLength(PAGE_SIZE);
    expect(data.pages[0][0]).toEqual(
      expect.objectContaining({ id: 1, name: 'pokemon-1', types: ['grass', 'poison'] }),
    );
  });

  it('advances the window by a page and stops when the last one comes back short', async () => {
    server.use(indexHandler(), detailHandler());
    const store = makeStore();

    await fetchFirstPage(store);
    const { data, hasNextPage } = await fetchNextPage(store);

    expect(data.pageParams).toEqual([0, PAGE_SIZE]);
    expect(data.pages[1]).toHaveLength(SPECIES_IN_INDEX - PAGE_SIZE);
    expect(hasNextPage).toBe(false);
  });

  it('fails the whole page when a single detail fails', async () => {
    server.use(indexHandler(), detailHandler('3'));

    const { data, error } = await fetchFirstPage(makeStore());

    expect(error).toEqual({ status: 500, message: 'Server Error' });
    expect(data).toBeUndefined();
  });

  it('surfaces the index error when the index itself fails', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json({ message: 'Server Error' }, { status: 500 })),
    );

    const { error } = await fetchFirstPage(makeStore());

    expect(error).toEqual({ status: 500, message: 'Server Error' });
  });

  it('provides a tag per pokemon brought, so invalidating one reaches the page and its seeded getPokemonById entry', async () => {
    server.use(indexHandler(), detailHandler());
    const store = makeStore();

    await fetchFirstPage(store);

    const invalidated = pokemonListApi.util.selectInvalidatedBy(store.getState(), [
      { type: POKEMON_TAG_TYPE, id: 7 },
    ]);

    expect(invalidated).toHaveLength(2);
    expect(invalidated).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ endpointName: 'getPokemonPage' }),
        expect.objectContaining({ endpointName: 'getPokemonById' }),
      ]),
    );
  });

  it('only re-requests the first page on refetch, not every page already cached', async () => {
    server.use(indexHandler(), detailHandler());
    const store = makeStore();

    await fetchFirstPage(store);
    await fetchNextPage(store);

    let detailRequests = 0;
    server.use(
      http.get(DETAIL_URL, ({ params }) => {
        detailRequests += 1;
        return HttpResponse.json({
          ...pokemonDetailResponse,
          id: Number(params.id),
          name: `pokemon-${params.id}`,
        });
      }),
    );

    const subscription = fetchFirstPage(store);
    await subscription;
    await subscription.refetch();

    expect(detailRequests).toBe(PAGE_SIZE);
  });

  it('seeds getPokemonById, so reading a pokemon already brought by the page does not request it again', async () => {
    server.use(indexHandler(), detailHandler());
    const store = makeStore();

    await fetchFirstPage(store);

    let detailRequests = 0;
    server.use(
      http.get(DETAIL_URL, ({ params }) => {
        detailRequests += 1;
        return HttpResponse.json({
          ...pokemonDetailResponse,
          id: Number(params.id),
          name: `pokemon-${params.id}`,
        });
      }),
    );

    const { data } = await store.dispatch(pokemonApi.endpoints.getPokemonById.initiate(1));

    expect(data).toEqual(expect.objectContaining({ id: 1, name: 'pokemon-1' }));
    expect(detailRequests).toBe(0);
  });

  it('brings only the pokemon that match the search term', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
    );
    const store = makeStore();

    const { data } = await store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate({ term: 'deoxys' }),
    );

    expect(data.pages[0]).toHaveLength(1);
    expect(data.pages[0][0]).toEqual(expect.objectContaining({ id: 386 }));
  });

  it('keeps the search and the plain page as separate cache entries', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
    );
    const store = makeStore();

    await store.dispatch(pokemonListApi.endpoints.getPokemonPage.initiate());
    await store.dispatch(pokemonListApi.endpoints.getPokemonPage.initiate({ term: 'venusaur' }));

    const plainPage = pokemonListApi.endpoints.getPokemonPage.select(undefined)(store.getState());
    const searchPage = pokemonListApi.endpoints.getPokemonPage.select({ term: 'venusaur' })(
      store.getState(),
    );

    expect(plainPage.data.pages[0].map((pokemon) => pokemon.id)).toEqual([1, 2, 3, 386, 1025]);
    expect(searchPage.data.pages[0]).toHaveLength(1);
    expect(searchPage.data.pages[0][0]).toEqual(expect.objectContaining({ id: 3 }));
  });

  it('brings only the pokemon that match the type', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
      typeHandler(),
    );
    const store = makeStore();

    const { data } = await store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate({ type: 'grass' }),
    );

    expect(data.pages[0].map((pokemon) => pokemon.id)).toEqual([1, 2]);
  });

  it('brings only the pokemon that match the generation', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
      generationHandler(),
    );
    const store = makeStore();

    const { data } = await store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate({ generation: 1 }),
    );

    expect(data.pages[0].map((pokemon) => pokemon.id)).toEqual([1, 2, 3]);
  });

  it('combines type and search term in AND', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
      typeHandler(),
    );
    const store = makeStore();

    const { data } = await store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate({ type: 'grass', term: 'ivy' }),
    );

    expect(data.pages[0].map((pokemon) => pokemon.id)).toEqual([2]);
  });

  it('ignores a type that does not exist and brings the full listing', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
      typeHandler(),
    );
    const store = makeStore();

    const { data, error } = await store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate({ type: 'nonexistent' }),
    );

    expect(error).toBeUndefined();
    expect(data.pages[0].map((pokemon) => pokemon.id)).toEqual([1, 2, 3, 386, 1025]);
  });

  it('fails the page when getIdsByType fails with something other than a 404', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      detailHandler(),
      typeHandler('grass'),
    );
    const store = makeStore();

    const { data, error } = await store.dispatch(
      pokemonListApi.endpoints.getPokemonPage.initiate({ type: 'grass' }),
    );

    expect(error).toEqual({ status: 500, message: 'Server Error' });
    expect(data).toBeUndefined();
  });
});
