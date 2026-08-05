import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BASE_API_REDUCER_PATH,
  KEEP_UNUSED_DATA_FOR_SECONDS,
  POKEAPI_BASE_URL,
  POKEMON_TAG_TYPE,
} from 'src/shared/lib/constants/api.js';

export const baseApi = createApi({
  reducerPath: BASE_API_REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: POKEAPI_BASE_URL }),
  tagTypes: [POKEMON_TAG_TYPE],
  keepUnusedDataFor: KEEP_UNUSED_DATA_FOR_SECONDS,
  endpoints: () => ({}),
});
