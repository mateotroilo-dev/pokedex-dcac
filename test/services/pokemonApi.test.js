import { http, HttpResponse } from 'msw';
import { server } from 'test/msw/server.js';
import { makeStore } from 'src/app/store.js';
import { pokemonApi } from 'src/services/pokemonApi.js';
import { POKEAPI_BASE_URL, POKEMON_TAG_TYPE } from 'src/shared/lib/constants/api.js';
import { POKEMON_INDEX_TAG_ID } from 'src/shared/lib/constants/pokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/1`;
const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;

const fetchById = (id) => makeStore().dispatch(pokemonApi.endpoints.getPokemonById.initiate(id));

const fetchIndex = () => makeStore().dispatch(pokemonApi.endpoints.getPokemonIndex.initiate());

describe('getPokemonById', () => {
  it('returns the pokemon, already transformed', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    const { data } = await fetchById(1);

    expect(data).toEqual(
      expect.objectContaining({ id: 1, name: 'bulbasaur', types: ['grass', 'poison'] }),
    );
  });

  it('normalizes a 404 into a status and a message', async () => {
    server.use(
      http.get(DETAIL_URL, () => HttpResponse.json({ message: 'Not Found' }, { status: 404 })),
    );

    const { error } = await fetchById(1);

    expect(error).toEqual({ status: 404, message: 'Not Found' });
  });
});

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

    await store.dispatch(pokemonApi.endpoints.getPokemonIndex.initiate());

    expect(
      pokemonApi.util.selectInvalidatedBy(store.getState(), [
        { type: POKEMON_TAG_TYPE, id: POKEMON_INDEX_TAG_ID },
      ]),
    ).toEqual([expect.objectContaining({ endpointName: 'getPokemonIndex' })]);
  });
});
