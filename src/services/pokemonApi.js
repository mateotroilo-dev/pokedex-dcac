import { baseApi } from 'src/services/baseApi.js';
import { POKEMON_TAG_TYPE } from 'src/shared/lib/constants/api.js';
import { parseApiError } from 'src/shared/lib/parseApiError.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';

export const pokemonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPokemonById: build.query({
      query: (id) => `pokemon/${id}`,
      transformResponse: toPokemon,
      transformErrorResponse: parseApiError,
      providesTags: (result, error, id) => [{ type: POKEMON_TAG_TYPE, id }],
    }),
  }),
});

export const { useGetPokemonByIdQuery } = pokemonApi;
