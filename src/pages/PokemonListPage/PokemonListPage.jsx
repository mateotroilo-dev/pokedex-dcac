import PokemonFilterBar from 'src/features/filters/components/PokemonFilterBar/PokemonFilterBar.jsx';
import { usePokemonFilters } from 'src/features/filters/hooks/usePokemonFilters.js';
import EmptyState from 'src/shared/ui/EmptyState/EmptyState.jsx';
import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import { useGetPokemonPageInfiniteQuery } from 'src/features/pokemon-list/api.js';
import { PAGE_SIZE } from 'src/features/pokemon-list/constants.js';
import PokemonGrid from 'src/features/pokemon-list/components/PokemonGrid/PokemonGrid.jsx';
import PokemonGridSkeleton from 'src/features/pokemon-list/components/PokemonGridSkeleton/PokemonGridSkeleton.jsx';
import PokemonListFooter from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.jsx';
import {
  EMPTY_DEX_MESSAGE,
  NO_SEARCH_RESULTS_MESSAGE,
} from 'src/pages/PokemonListPage/PokemonListPage.constants.js';

const PokemonListPage = () => {
  const { filters, hasActiveFilters } = usePokemonFilters();
  // Sin filtros el arg tiene que seguir siendo undefined, no {}: es la clave de cache que ya esta
  // persistida en el disco de cualquiera que uso la app antes de esta slice.
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetPokemonPageInfiniteQuery(filters);

  const pokemon = (data?.pages ?? []).flat();

  const renderContent = () => {
    if (isLoading) return <PokemonGridSkeleton />;
    // Sin ninguna pagina traida todavia no hay nada que conservar: el error ocupa la pagina entera.
    // Con paginas ya en pantalla, un fallo de la siguiente lo cuenta el pie, no esto.
    if (isError && !data) return <ErrorState message={error.message} onRetry={refetch} />;
    if (pokemon.length === 0) {
      return (
        <EmptyState message={hasActiveFilters ? NO_SEARCH_RESULTS_MESSAGE : EMPTY_DEX_MESSAGE} />
      );
    }

    return (
      <>
        <PokemonGrid pokemon={pokemon} pendingCount={isFetchingNextPage ? PAGE_SIZE : 0} />
        <PokemonListFooter
          hasNextPage={hasNextPage}
          isFetchNextPageError={isFetchNextPageError}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          hasActiveFilters={hasActiveFilters}
        />
      </>
    );
  };

  return (
    <PageLayout>
      <PokemonFilterBar />
      {renderContent()}
    </PageLayout>
  );
};

export default PokemonListPage;
