import { useParams } from 'react-router-dom';
import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import HomeLink from 'src/shared/ui/HomeLink/HomeLink.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import { useGetPokemonByIdQuery } from 'src/services/pokemonApi.js';
import { POKEMON_ID_PARAM } from 'src/shared/lib/constants/routes.js';
import PokemonSummary from 'src/features/pokemon-detail/components/PokemonSummary/PokemonSummary.jsx';
import PokemonSummarySkeleton from 'src/features/pokemon-detail/components/PokemonSummarySkeleton/PokemonSummarySkeleton.jsx';
import { POKEMON_NOT_FOUND_MESSAGE } from 'src/pages/PokemonDetailPage/PokemonDetailPage.constants.js';

const PokemonDetailPage = () => {
  const id = Number(useParams()[POKEMON_ID_PARAM]);
  const isValidId = Number.isInteger(id) && id > 0;

  const { data, isLoading, isError, error, refetch } = useGetPokemonByIdQuery(id, {
    skip: !isValidId,
  });

  const renderContent = () => {
    // Con skip, la query queda isUninitialized: ni loading ni error. Por eso el id invalido entra
    // primero y comparte rama con el 404, que es el mismo mensaje para el mismo caso de uso.
    if (!isValidId || error?.status === 404) {
      return (
        <ErrorState message={POKEMON_NOT_FOUND_MESSAGE}>
          <HomeLink />
        </ErrorState>
      );
    }
    if (isLoading) return <PokemonSummarySkeleton />;
    if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

    return <PokemonSummary pokemon={data} />;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};

export default PokemonDetailPage;
