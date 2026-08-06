import { baseApi } from 'src/services/baseApi.js';
import { idFromApiUrl } from 'src/shared/lib/idFromApiUrl.js';
import { parseApiError } from 'src/shared/lib/parseApiError.js';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';

// POKEMON_TYPE_COLORS ya es la lista de los 18 tipos que el proyecto reconoce: /type devuelve 21,
// sumando 'unknown', 'shadow' y 'stellar', que PokemonTypeBadge no sabe pintar.
const CANONICAL_TYPE_NAMES = new Set(Object.keys(POKEMON_TYPE_COLORS));

export const filtersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTypes: build.query({
      query: () => 'type',
      transformResponse: ({ results }) =>
        results
          .filter(({ name }) => CANONICAL_TYPE_NAMES.has(name))
          .map(({ name }) => ({ id: name, label: name })),
      transformErrorResponse: parseApiError,
    }),

    getGenerations: build.query({
      query: () => 'generation',
      transformResponse: ({ results }) =>
        results.map(({ url }) => {
          const id = idFromApiUrl(url);
          return { id, label: `Gen ${id}` };
        }),
      transformErrorResponse: parseApiError,
    }),
  }),
});

export const { useGetTypesQuery, useGetGenerationsQuery } = filtersApi;
