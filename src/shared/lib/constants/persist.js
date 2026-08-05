export const ROOT_PERSIST_KEY = 'root';
export const API_PERSIST_KEY = 'api';
export const UI_PERSIST_KEY = 'ui';
export const PERSIST_THROTTLE_MS = 1000;

export const QUERIES_STATE_KEY = 'queries';
export const PROVIDED_STATE_KEY = 'provided';

export const HYDRATED_AT_FIELD = 'hydratedAt';

export const PERSISTED_API_KEYS = Object.freeze([QUERIES_STATE_KEY, PROVIDED_STATE_KEY]);

export const UNPERSISTED_UI_KEYS = Object.freeze([HYDRATED_AT_FIELD]);
