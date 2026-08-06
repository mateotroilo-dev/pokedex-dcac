import { apiPersistConfig } from 'src/app/persistConfig.js';
import { QUERIES_STATE_KEY } from 'src/shared/lib/constants/persist.js';

const PLAIN_PAGE_KEY = 'getPokemonPage(undefined)';
const FILTERED_PAGE_KEY = 'getPokemonPage({"type":"grass"})';

const apiState = {
  queries: {
    [PLAIN_PAGE_KEY]: {
      status: 'fulfilled',
      endpointName: 'getPokemonPage',
      originalArgs: undefined,
      data: { pages: [[{ id: 1, name: 'bulbasaur' }]] },
    },
    [FILTERED_PAGE_KEY]: {
      status: 'fulfilled',
      endpointName: 'getPokemonPage',
      originalArgs: { type: 'grass' },
      data: { pages: [[{ id: 1, name: 'bulbasaur' }]] },
    },
  },
  provided: { tags: {}, keys: {} },
};

const transform = (key) => apiPersistConfig.transforms[0].in(apiState[key], key, apiState);

describe('apiPersistConfig', () => {
  it('does not persist a getPokemonPage with a filter arg, like a type', () => {
    expect(transform(QUERIES_STATE_KEY)).not.toHaveProperty(FILTERED_PAGE_KEY);
  });

  it('persists the plain getPokemonPage, with an undefined arg', () => {
    expect(transform(QUERIES_STATE_KEY)).toHaveProperty(PLAIN_PAGE_KEY);
  });
});
