import { createTransform } from 'redux-persist';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { PROVIDED_STATE_KEY, QUERIES_STATE_KEY } from 'src/shared/lib/constants/persist.js';

const prunedTagIds = (tagIds, keptCacheKeys) =>
  Object.fromEntries(
    Object.entries(tagIds)
      .map(([tagId, cacheKeys]) => [tagId, cacheKeys.filter((key) => keptCacheKeys.has(key))])
      .filter(([, cacheKeys]) => cacheKeys.length > 0),
  );

const prunedTags = (tags, keptCacheKeys) =>
  Object.fromEntries(
    Object.entries(tags)
      .map(([tagType, tagIds]) => [tagType, prunedTagIds(tagIds, keptCacheKeys)])
      .filter(([, tagIds]) => Object.keys(tagIds).length > 0),
  );

const prunedProvided = (provided, keptCacheKeys) => ({
  tags: prunedTags(provided.tags, keptCacheKeys),
  keys: Object.fromEntries(
    Object.entries(provided.keys).filter(([cacheKey]) => keptCacheKeys.has(cacheKey)),
  ),
});

// `isPersistable` es donde entra la regla con dominio: esta funcion solo sabe de "fulfilled" (una
// query pending o rejected rehidrata stuck para siempre, eso no es negociable) y de que el podado
// de `provided` tiene que correr contra el mismo conjunto de queries que sobrevive.
export const pickFulfilledQueries = (isPersistable) =>
  createTransform((inboundState, key, fullState) => {
    const persistableQueries = (queries) =>
      Object.fromEntries(
        Object.entries(queries).filter(
          ([, query]) => query.status === QueryStatus.fulfilled && isPersistable(query),
        ),
      );

    if (key === QUERIES_STATE_KEY) return persistableQueries(inboundState);

    if (key === PROVIDED_STATE_KEY) {
      const keptCacheKeys = new Set(Object.keys(persistableQueries(fullState[QUERIES_STATE_KEY])));

      return prunedProvided(inboundState, keptCacheKeys);
    }

    return inboundState;
  });
