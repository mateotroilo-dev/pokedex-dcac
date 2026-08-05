export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/';
export const BASE_API_REDUCER_PATH = 'baseApi';
export const POKEMON_TAG_TYPE = 'Pokemon';

// Un pokemon no cambia: el default de 60 s de RTK Query tira datos inmutables y los vuelve a pedir.
export const KEEP_UNUSED_DATA_FOR_SECONDS = 24 * 60 * 60;
