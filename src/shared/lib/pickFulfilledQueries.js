import { createTransform } from 'redux-persist';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { PROVIDED_STATE_KEY, QUERIES_STATE_KEY } from 'src/shared/lib/constants/persist.js';

const fulfilledQueries = (queries) =>
  Object.fromEntries(
    Object.entries(queries).filter(([, query]) => query.status === QueryStatus.fulfilled),
  );

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

// `provided` se conserva podado en vez de descartarse: `invalidateTags` resuelve a que entrada de
// cache le pega leyendo de ahi, asi que sin esto la invalidacion no tiene efecto justo en la sesion
// que arranca desde el cache rehidratado, y no falla en ningun otro lado.
export const pickFulfilledQueries = createTransform((inboundState, key, fullState) => {
  if (key === QUERIES_STATE_KEY) return fulfilledQueries(inboundState);

  if (key === PROVIDED_STATE_KEY) {
    const keptCacheKeys = new Set(Object.keys(fulfilledQueries(fullState[QUERIES_STATE_KEY])));

    return prunedProvided(inboundState, keptCacheKeys);
  }

  return inboundState;
});
