import storage from 'redux-persist/lib/storage';
import { BASE_API_REDUCER_PATH } from 'src/shared/lib/constants/api.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import {
  API_PERSIST_KEY,
  PERSISTED_API_KEYS,
  PERSIST_THROTTLE_MS,
  ROOT_PERSIST_KEY,
  UI_PERSIST_KEY,
  UNPERSISTED_UI_KEYS,
} from 'src/shared/lib/constants/persist.js';
import { pickFulfilledQueries } from 'src/shared/lib/pickFulfilledQueries.js';

export const rootPersistConfig = {
  key: ROOT_PERSIST_KEY,
  storage,
  blacklist: [BASE_API_REDUCER_PATH, UI_REDUCER_PATH],
};

// Mira `endpointName` y no solo si `originalArgs` esta definido: "el arg no es undefined" a secas
// tambien descartaria `getPokemonById`, que la propia grilla siembra y que si tiene que sobrevivir
// para abrir el detalle sin red.
const isPersistableQuery = (query) =>
  !(query.endpointName === 'getPokemonPage' && query.originalArgs !== undefined);

export const apiPersistConfig = {
  key: API_PERSIST_KEY,
  storage,
  whitelist: PERSISTED_API_KEYS,
  throttle: PERSIST_THROTTLE_MS,
  transforms: [pickFulfilledQueries(isPersistableQuery)],
};

// Opt-out y no whitelist: la preferencia que sume una feature se persiste sola.
export const uiPersistConfig = {
  key: UI_PERSIST_KEY,
  storage,
  blacklist: UNPERSISTED_UI_KEYS,
};
