import { baseApi } from 'src/services/baseApi.js';
import { POKEMON_TAG_TYPE } from 'src/shared/lib/constants/api.js';
import { INDEX_REQUEST_LIMIT, POKEMON_INDEX_TAG_ID } from 'src/shared/lib/constants/pokemon.js';
import { parseApiError } from 'src/shared/lib/parseApiError.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { toPokemonIndex } from 'src/shared/lib/toPokemonIndex.js';

export const pokemonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPokemonById: build.query({
      query: (id) => `pokemon/${id}`,
      transformResponse: toPokemon,
      transformErrorResponse: parseApiError,
      providesTags: (result, error, id) => [{ type: POKEMON_TAG_TYPE, id }],
    }),

    getPokemonIndex: build.query({
      query: () => `pokemon?limit=${INDEX_REQUEST_LIMIT}`,
      transformResponse: ({ results }) => toPokemonIndex(results),
      transformErrorResponse: parseApiError,
      providesTags: [{ type: POKEMON_TAG_TYPE, id: POKEMON_INDEX_TAG_ID }],
    }),
  }),
});

export const { useGetPokemonByIdQuery, useGetPokemonIndexQuery } = pokemonApi;
