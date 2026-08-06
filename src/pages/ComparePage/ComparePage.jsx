import CompareForm from 'src/features/compare/components/CompareForm/CompareForm.jsx';
import PokemonComparison from 'src/features/compare/components/PokemonComparison/PokemonComparison.jsx';
import { useComparisonSelection } from 'src/features/compare/hooks/useComparisonSelection.js';
import { useGetPokemonIndexQuery } from 'src/services/pokemonApi.js';
import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';

const ComparePage = () => {
  const { idA, idB } = useComparisonSelection();
  const { isError, error, refetch } = useGetPokemonIndexQuery();

  return (
    <PageLayout>
      {isError ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <>
          <CompareForm />
          <PokemonComparison idA={idA} idB={idB} />
        </>
      )}
    </PageLayout>
  );
};

export default ComparePage;
