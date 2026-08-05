import { pickFulfilledQueries } from 'src/shared/lib/pickFulfilledQueries.js';
import { PROVIDED_STATE_KEY, QUERIES_STATE_KEY } from 'src/shared/lib/constants/persist.js';

const FULFILLED_KEY = 'getPokemonIndex(undefined)';
const PENDING_KEY = 'getPokemonPage(undefined)';

const apiState = {
  queries: {
    [FULFILLED_KEY]: { status: 'fulfilled', data: [{ id: 1, name: 'bulbasaur' }] },
    [PENDING_KEY]: { status: 'pending' },
  },
  provided: {
    tags: {
      Pokemon: {
        INDEX: [FULFILLED_KEY],
        1: [PENDING_KEY],
      },
      Generation: {
        1: [PENDING_KEY],
      },
    },
    keys: {
      [FULFILLED_KEY]: [{ type: 'Pokemon', id: 'INDEX' }],
      [PENDING_KEY]: [{ type: 'Pokemon', id: 1 }],
    },
  },
  subscriptions: { [FULFILLED_KEY]: { abc: {} } },
};

const transform = (key) => pickFulfilledQueries.in(apiState[key], key, apiState);

describe('pickFulfilledQueries', () => {
  it('keeps the fulfilled queries', () => {
    expect(transform(QUERIES_STATE_KEY)).toEqual({
      [FULFILLED_KEY]: apiState.queries[FULFILLED_KEY],
    });
  });

  it('drops the pending queries, which rehydrate stuck forever', () => {
    expect(transform(QUERIES_STATE_KEY)).not.toHaveProperty(PENDING_KEY);
  });

  it('prunes provided down to the queries it kept', () => {
    expect(transform(PROVIDED_STATE_KEY)).toEqual({
      tags: { Pokemon: { INDEX: [FULFILLED_KEY] } },
      keys: { [FULFILLED_KEY]: [{ type: 'Pokemon', id: 'INDEX' }] },
    });
  });

  it('leaves alone the keys it does not know about', () => {
    expect(transform('subscriptions')).toBe(apiState.subscriptions);
  });
});
