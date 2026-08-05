import { http, HttpResponse } from 'msw';
import { KEY_PREFIX } from 'redux-persist';
import { server } from 'test/msw/server.js';
import store from 'src/app/store.js';
import { persistor } from 'src/app/persistor.js';
import { pokemonListApi } from 'src/features/pokemon-list/api.js';
import {
  BASE_API_REDUCER_PATH,
  POKEAPI_BASE_URL,
  POKEMON_TAG_TYPE,
} from 'src/shared/lib/constants/api.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { POKEMON_INDEX_TAG_ID } from 'src/features/pokemon-list/constants.js';
import {
  API_PERSIST_KEY,
  ROOT_PERSIST_KEY,
  UI_PERSIST_KEY,
} from 'src/shared/lib/constants/persist.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';

const INDEX_CACHE_KEY = 'getPokemonIndex(undefined)';

const readPersisted = (key) => JSON.parse(localStorage.getItem(`${KEY_PREFIX}${key}`));

const whenBootstrapped = (subject) =>
  new Promise((resolve) => {
    if (subject.getState().bootstrapped) return resolve();

    const unsubscribe = subject.subscribe(() => {
      if (!subject.getState().bootstrapped) return;

      unsubscribe();
      resolve();
    });
  });

describe('persistor', () => {
  it('writes the fulfilled cache into localStorage, and nothing else', async () => {
    server.use(
      http.get(`${POKEAPI_BASE_URL}pokemon`, () => HttpResponse.json(pokemonIndexResponse)),
    );
    await whenBootstrapped(persistor);

    await store.dispatch(pokemonListApi.endpoints.getPokemonIndex.initiate());

    const persistedApi = await vi.waitFor(
      () => {
        const raw = readPersisted(API_PERSIST_KEY);
        expect(raw).not.toBeNull();

        return raw;
      },
      { timeout: 3000 },
    );

    expect(JSON.parse(persistedApi.queries)).toHaveProperty(INDEX_CACHE_KEY);
    expect(persistedApi).not.toHaveProperty('subscriptions');
    expect(persistedApi).not.toHaveProperty('config');
    expect(persistedApi).not.toHaveProperty('mutations');
  });

  it('leaves the root free of the branches that persist themselves', () => {
    const persistedRoot = readPersisted(ROOT_PERSIST_KEY);

    expect(persistedRoot).not.toHaveProperty(BASE_API_REDUCER_PATH);
    expect(persistedRoot).not.toHaveProperty(UI_REDUCER_PATH);
  });

  it('starts the next session from what it wrote', async () => {
    expect(readPersisted(API_PERSIST_KEY)).not.toBeNull();
    expect(readPersisted(UI_PERSIST_KEY)).not.toBeNull();
    vi.resetModules();

    const { default: nextStore } = await import('src/app/store.js');
    const { persistor: nextPersistor } = await import('src/app/persistor.js');
    const { pokemonListApi: nextApi } = await import('src/features/pokemon-list/api.js');
    await whenBootstrapped(nextPersistor);

    const state = nextStore.getState();

    expect(state[BASE_API_REDUCER_PATH].queries).toHaveProperty(INDEX_CACHE_KEY);
    expect(state[UI_REDUCER_PATH].hydratedAt).toEqual(expect.any(Number));
    expect(
      nextApi.util.selectInvalidatedBy(state, [
        { type: POKEMON_TAG_TYPE, id: POKEMON_INDEX_TAG_ID },
      ]),
    ).toEqual([expect.objectContaining({ endpointName: 'getPokemonIndex' })]);
  });
});
