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

// Las dos ramas se persisten por separado y el root las blacklistea. Sin ese blacklist el root las
// vuelve a serializar adentro de `persist:root`, crudas y sin throttle: el cache de la API escrito
// dos veces, una de ellas con `subscriptions` y queries `pending` adentro.
export const rootPersistConfig = {
  key: ROOT_PERSIST_KEY,
  storage,
  blacklist: [BASE_API_REDUCER_PATH, UI_REDUCER_PATH],
};

// `getPokemonPage` con algun filtro puesto (termino, tipo o generacion) no se persiste: cada
// combinacion deja hasta 20 entradas mas en localStorage con un TTL de 24 h (la cuota que la
// slice 4 ya dejo cerca del techo), y el listado sin filtros se sigue guardando entero. Mira
// `endpointName` y no solo si `originalArgs` esta definido: "el arg no es undefined" a secas
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

// Opt-out y no whitelist: la preferencia que sume una feature se persiste sola. `hydratedAt` es lo
// unico que nunca se guarda —responde "esta sesion arranco desde cache", restaurarlo se contradice—
// y ademas el stateReconciler corre despues del reducer, asi que el valor viejo le pisaria el
// `Date.now()` que el REHYDRATE acaba de escribir.
export const uiPersistConfig = {
  key: UI_PERSIST_KEY,
  storage,
  blacklist: UNPERSISTED_UI_KEYS,
};
