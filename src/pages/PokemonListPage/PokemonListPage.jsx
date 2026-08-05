import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import { useGetPokemonPageInfiniteQuery } from 'src/features/pokemon-list/api.js';
import { PAGE_SIZE } from 'src/features/pokemon-list/constants.js';
import PokemonGrid from 'src/features/pokemon-list/components/PokemonGrid/PokemonGrid.jsx';
import PokemonGridSkeleton from 'src/features/pokemon-list/components/PokemonGridSkeleton/PokemonGridSkeleton.jsx';
import PokemonListFooter from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.jsx';
import { EMPTY_MESSAGE } from 'src/pages/PokemonListPage/PokemonListPage.constants.js';
import { EmptyMessage } from 'src/pages/PokemonListPage/PokemonListPage.styles.js';

const PokemonListPage = () => {
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
  } = useGetPokemonPageInfiniteQuery();

  const pokemon = (data?.pages ?? []).flat();

  const renderContent = () => {
    if (isLoading) return <PokemonGridSkeleton />;
    // Sin ninguna pagina traida todavia no hay nada que conservar: el error ocupa la pagina entera.
    // Con paginas ya en pantalla, un fallo de la siguiente lo cuenta el pie, no esto.
    if (isError && !data) return <ErrorState message={error.message} onRetry={refetch} />;
    if (pokemon.length === 0) return <EmptyMessage>{EMPTY_MESSAGE}</EmptyMessage>;

    return (
      <>
        <PokemonGrid pokemon={pokemon} pendingCount={isFetchingNextPage ? PAGE_SIZE : 0} />
        <PokemonListFooter
          hasNextPage={hasNextPage}
          isFetchNextPageError={isFetchNextPageError}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </>
    );
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};

export default PokemonListPage;
