import { http, HttpResponse } from 'msw';
import { server } from 'test/msw/server.js';
import { makeStore } from 'src/app/store.js';
import { pokemonApi } from 'src/services/pokemonApi.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/1`;

const fetchById = (id) => makeStore().dispatch(pokemonApi.endpoints.getPokemonById.initiate(id));

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
