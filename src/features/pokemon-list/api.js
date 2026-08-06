import { baseApi } from 'src/services/baseApi.js';
// No solo el tipo: importar pokemonApi es lo que inyecta su endpoint. Sin esta importacion
// 'getPokemonById' no existe todavia y el upsert de abajo no apunta a ninguna entrada de cache.
import { pokemonApi } from 'src/services/pokemonApi.js';
import { POKEMON_TAG_TYPE } from 'src/shared/lib/constants/api.js';
import { limitConcurrency } from 'src/shared/lib/limitConcurrency.js';
import { parseApiError } from 'src/shared/lib/parseApiError.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import {
  INDEX_REQUEST_LIMIT,
  MAX_CONCURRENT_DETAIL_REQUESTS,
  PAGE_SIZE,
  POKEMON_INDEX_TAG_ID,
} from 'src/features/pokemon-list/constants.js';
import { toPokemonIndex } from 'src/features/pokemon-list/lib/toPokemonIndex.js';
import { filterPokemonIndex } from 'src/features/pokemon-list/lib/filterPokemonIndex.js';

export const pokemonListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPokemonIndex: build.query({
      query: () => `pokemon?limit=${INDEX_REQUEST_LIMIT}`,
      transformResponse: ({ results }) => toPokemonIndex(results),
      transformErrorResponse: parseApiError,
      providesTags: [{ type: POKEMON_TAG_TYPE, id: POKEMON_INDEX_TAG_ID }],
    }),

    getPokemonPage: build.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: 0,
        // Corta por lo que trajo la ultima pagina y no por el total: asi el dia que el arg sea un
        // filtro, no hay ningun total que recalcular.
        getNextPageParam: (lastPage, allPages, lastPageParam) =>
          lastPage.length < PAGE_SIZE ? undefined : lastPageParam + PAGE_SIZE,
        // Default true en RTK 2.12: un refetch() re-pide todas las paginas cacheadas en secuencia,
        // 20 detalles cada una contra una API publica sin rate limit documentado. El unico refetch()
        // que dispara la UI es el de la primera carga fallida, sin paginas cacheadas todavia.
        refetchCachedPages: false,
      },
      queryFn: async ({ queryArg: term, pageParam }, { dispatch }, extraOptions, baseQuery) => {
        const indexQuery = dispatch(pokemonListApi.endpoints.getPokemonIndex.initiate());

        try {
          const { data: index, error: indexError } = await indexQuery;
          if (indexError) return { error: indexError };

          const matchingIndex = filterPokemonIndex(index, term);
          const pageEntries = matchingIndex.slice(pageParam, pageParam + PAGE_SIZE);
          const fetchDetail = (entry) => async () => {
            const { data, error } = await baseQuery(`pokemon/${entry.id}`);
            if (error) throw error;

            const pokemon = toPokemon(data);
            // Siembra el cache de getPokemonById: abrir el detalle desde la grilla lee de aca en
            // vez de volver a pedir una URL que la app ya bajo.
            dispatch(pokemonApi.util.upsertQueryData('getPokemonById', pokemon.id, pokemon));

            return pokemon;
          };

          return {
            data: await limitConcurrency(
              pageEntries.map(fetchDetail),
              MAX_CONCURRENT_DETAIL_REQUESTS,
            ),
          };
        } catch (error) {
          // La pagina falla entera: una parcial deja huecos que nadie va a reintentar, porque la
          // entrada de cache queda fulfilled.
          return { error: parseApiError(error) };
        } finally {
          indexQuery.unsubscribe();
        }
      },
      providesTags: (result) =>
        (result?.pages ?? []).flat().map((pokemon) => ({ type: POKEMON_TAG_TYPE, id: pokemon.id })),
    }),
  }),
});

export const { useGetPokemonIndexQuery, useGetPokemonPageInfiniteQuery } = pokemonListApi;
