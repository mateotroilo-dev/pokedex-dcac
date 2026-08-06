import { pickFulfilledQueries } from 'src/shared/lib/pickFulfilledQueries.js';
import { PROVIDED_STATE_KEY, QUERIES_STATE_KEY } from 'src/shared/lib/constants/persist.js';

const INDEX_KEY = 'getPokemonIndex(undefined)';
const PAGE_PENDING_KEY = 'getPokemonPage(undefined)';
const SEARCH_KEY = 'getPokemonPage("pikachu")';
const DETAIL_KEY = 'getPokemonById(25)';

const apiState = {
  queries: {
    [INDEX_KEY]: {
      status: 'fulfilled',
      endpointName: 'getPokemonIndex',
      originalArgs: undefined,
      data: [{ id: 1, name: 'bulbasaur' }],
    },
    [PAGE_PENDING_KEY]: {
      status: 'pending',
      endpointName: 'getPokemonPage',
      originalArgs: undefined,
    },
    [SEARCH_KEY]: {
      status: 'fulfilled',
      endpointName: 'getPokemonPage',
      originalArgs: 'pikachu',
      data: [{ id: 25, name: 'pikachu' }],
    },
    [DETAIL_KEY]: {
      status: 'fulfilled',
      endpointName: 'getPokemonById',
      originalArgs: 25,
      data: { id: 25, name: 'pikachu' },
    },
  },
  provided: {
    tags: {
      Pokemon: {
        INDEX: [INDEX_KEY],
        1: [PAGE_PENDING_KEY],
        25: [SEARCH_KEY, DETAIL_KEY],
      },
      Generation: {
        1: [PAGE_PENDING_KEY],
      },
    },
    keys: {
      [INDEX_KEY]: [{ type: 'Pokemon', id: 'INDEX' }],
      [PAGE_PENDING_KEY]: [{ type: 'Pokemon', id: 1 }],
      [SEARCH_KEY]: [{ type: 'Pokemon', id: 25 }],
      [DETAIL_KEY]: [{ type: 'Pokemon', id: 25 }],
    },
  },
  subscriptions: { [INDEX_KEY]: { abc: {} } },
};

// Refleja la regla real de app/persistConfig.js sin importar de app/ (shared/ es hoja): un
// getPokemonPage con arg definido (un termino de busqueda) no se persiste; todo lo demas fulfilled
// si, incluido getPokemonById con arg definido, para probar que la regla mira endpointName y no
// solo si el arg esta definido.
const isPersistable = (query) =>
  !(query.endpointName === 'getPokemonPage' && query.originalArgs !== undefined);

const transform = (key) => pickFulfilledQueries(isPersistable).in(apiState[key], key, apiState);

describe('pickFulfilledQueries', () => {
  it('keeps the fulfilled queries the predicate allows', () => {
    expect(transform(QUERIES_STATE_KEY)).toEqual({
      [INDEX_KEY]: apiState.queries[INDEX_KEY],
      [DETAIL_KEY]: apiState.queries[DETAIL_KEY],
    });
  });

  it('drops the pending queries, which rehydrate stuck forever', () => {
    expect(transform(QUERIES_STATE_KEY)).not.toHaveProperty(PAGE_PENDING_KEY);
  });

  it('drops a fulfilled query the predicate rejects, like a search page', () => {
    expect(transform(QUERIES_STATE_KEY)).not.toHaveProperty(SEARCH_KEY);
  });

  it('keeps a fulfilled query with a defined arg when it is not the one the predicate targets, like getPokemonById', () => {
    expect(transform(QUERIES_STATE_KEY)).toHaveProperty(DETAIL_KEY);
  });

  it('prunes provided down to the queries it kept', () => {
    expect(transform(PROVIDED_STATE_KEY)).toEqual({
      tags: {
        Pokemon: { INDEX: [INDEX_KEY], 25: [DETAIL_KEY] },
      },
      keys: {
        [INDEX_KEY]: [{ type: 'Pokemon', id: 'INDEX' }],
        [DETAIL_KEY]: [{ type: 'Pokemon', id: 25 }],
      },
    });
  });

  it('leaves alone the keys it does not know about', () => {
    expect(transform('subscriptions')).toBe(apiState.subscriptions);
  });
});
