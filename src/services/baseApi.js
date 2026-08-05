import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_REDUCER_PATH, POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';

export const baseApi = createApi({
  reducerPath: BASE_API_REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: POKEAPI_BASE_URL }),
  tagTypes: [],
  endpoints: () => ({}),
});
