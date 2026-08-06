import { baseApi } from 'src/services/baseApi.js';
// No solo el tipo: importar pokemonApi es lo que inyecta su endpoint. Sin esta importacion
// 'getPokemonById' no existe todavia y el upsert de abajo no apunta a ninguna entrada de cache.
import { pokemonApi } from 'src/services/pokemonApi.js';
import { POKEMON_TAG_TYPE } from 'src/shared/lib/constants/api.js';
import { idFromApiUrl } from 'src/shared/lib/idFromApiUrl.js';
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
      queryFn: async ({ queryArg, pageParam }, { dispatch }, extraOptions, baseQuery) => {
        const { term, type, generation } = queryArg ?? {};

        const indexQuery = dispatch(pokemonListApi.endpoints.getPokemonIndex.initiate());
        const typeQuery = type && dispatch(pokemonListApi.endpoints.getIdsByType.initiate(type));
        const generationQuery =
          generation && dispatch(pokemonListApi.endpoints.getIdsByGeneration.initiate(generation));

        try {
          const { data: index, error: indexError } = await indexQuery;
          if (indexError) return { error: indexError };

          const { data: typeIds, error: typeError } = typeQuery ? await typeQuery : {};
          if (typeError) return { error: typeError };

          const { data: generationIds, error: generationError } = generationQuery
            ? await generationQuery
            : {};
          if (generationError) return { error: generationError };

          const matchingIndex = filterPokemonIndex(index, { term, typeIds, generationIds });
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
          typeQuery?.unsubscribe();
          generationQuery?.unsubscribe();
        }
      },
      providesTags: (result) =>
        (result?.pages ?? []).flat().map((pokemon) => ({ type: POKEMON_TAG_TYPE, id: pokemon.id })),
    }),

    // Sin providesTags: no son entradas de pokemon y nada las invalida.
    getIdsByType: build.query({
      queryFn: async (typeName, _queryApi, _extraOptions, baseQuery) => {
        const { data, error } = await baseQuery(`type/${typeName}`);
        if (error) {
          // Un 404 no es un error de la app: el criterio no existe y se ignora, no falla.
          if (error.status === 404) return { data: null };
          return { error: parseApiError(error) };
        }

        return { data: data.pokemon.map(({ pokemon }) => idFromApiUrl(pokemon.url)) };
      },
    }),

    getIdsByGeneration: build.query({
      queryFn: async (generationId, _queryApi, _extraOptions, baseQuery) => {
        const { data, error } = await baseQuery(`generation/${generationId}`);
        if (error) {
          if (error.status === 404) return { data: null };
          return { error: parseApiError(error) };
        }

        return { data: data.pokemon_species.map((species) => idFromApiUrl(species.url)) };
      },
    }),
  }),
});

export const {
  useGetPokemonIndexQuery,
  useGetPokemonPageInfiniteQuery,
  useGetIdsByTypeQuery,
  useGetIdsByGenerationQuery,
} = pokemonListApi;
