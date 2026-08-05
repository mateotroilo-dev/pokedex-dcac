import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import { useGetPokemonPageInfiniteQuery } from 'src/features/pokemon-list/api.js';
import PokemonGrid from 'src/features/pokemon-list/components/PokemonGrid/PokemonGrid.jsx';
import PokemonGridSkeleton from 'src/features/pokemon-list/components/PokemonGridSkeleton/PokemonGridSkeleton.jsx';
import { EMPTY_MESSAGE, PAGE_TITLE } from 'src/pages/PokemonListPage/PokemonListPage.constants.js';
import { EmptyMessage, Page, Title } from 'src/pages/PokemonListPage/PokemonListPage.styles.js';

const PokemonListPage = () => {
  const { data, isLoading, isError, error, refetch } = useGetPokemonPageInfiniteQuery();

  // fetchNextPage existe desde 2a, pero el scroll infinito es una slice propia: aca solo se
  // renderiza la primera pagina.
  const pokemon = (data?.pages ?? []).flat();

  const renderContent = () => {
    if (isLoading) return <PokemonGridSkeleton />;
    if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
    if (pokemon.length === 0) return <EmptyMessage>{EMPTY_MESSAGE}</EmptyMessage>;

    return <PokemonGrid pokemon={pokemon} />;
  };

  return (
    <Page>
      <Title>{PAGE_TITLE}</Title>
      {renderContent()}
    </Page>
  );
};

export default PokemonListPage;
