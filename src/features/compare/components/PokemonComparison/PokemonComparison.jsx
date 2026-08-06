import { useGetPokemonByIdQuery } from 'src/services/pokemonApi.js';
import EmptyState from 'src/shared/ui/EmptyState/EmptyState.jsx';
import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import PokemonComparisonColumn from 'src/features/compare/components/PokemonComparisonColumn/PokemonComparisonColumn.jsx';
import PokemonStatRadar from 'src/features/compare/components/PokemonStatRadar/PokemonStatRadar.jsx';
import PokemonStatComparison from 'src/features/compare/components/PokemonStatComparison/PokemonStatComparison.jsx';
import { POKEMON_COMPARISON_COLUMN_HEIGHT } from 'src/features/compare/constants.js';
import {
  COMPARISON_EMPTY_MESSAGE,
  COMPARISON_NOT_FOUND_MESSAGE,
} from 'src/features/compare/components/PokemonComparison/PokemonComparison.constants.js';
import { Columns } from 'src/features/compare/components/PokemonComparison/PokemonComparison.styles.js';

const isValidId = (id) => Number.isInteger(id) && id > 0;

const PokemonComparison = ({ idA, idB }) => {
  const {
    data: pokemonA,
    isLoading: isLoadingA,
    isError: isErrorA,
    error: errorA,
    refetch: refetchA,
  } = useGetPokemonByIdQuery(idA, { skip: !isValidId(idA) });
  const {
    data: pokemonB,
    isLoading: isLoadingB,
    isError: isErrorB,
    error: errorB,
    refetch: refetchB,
  } = useGetPokemonByIdQuery(idB, { skip: !isValidId(idB) });

  if (idA === undefined || idB === undefined) {
    return <EmptyState message={COMPARISON_EMPTY_MESSAGE} />;
  }

  // Un id invalido (NaN) nunca dispara la query, asi que se junta con el 404 en la misma rama: los
  // dos son "esto no existe" y ninguno se arregla reintentando.
  if (!isValidId(idA) || !isValidId(idB) || errorA?.status === 404 || errorB?.status === 404) {
    return <ErrorState message={COMPARISON_NOT_FOUND_MESSAGE} />;
  }

  if (isLoadingA || isLoadingB) {
    return (
      <Columns>
        <Skeleton height={POKEMON_COMPARISON_COLUMN_HEIGHT} />
        <Skeleton height={POKEMON_COMPARISON_COLUMN_HEIGHT} />
      </Columns>
    );
  }

  if (isErrorA || isErrorB) {
    const handleRetry = () => {
      refetchA();
      refetchB();
    };
    return <ErrorState message={(errorA ?? errorB).message} onRetry={handleRetry} />;
  }

  return (
    <>
      <Columns>
        <PokemonComparisonColumn pokemon={pokemonA} />
        <PokemonComparisonColumn pokemon={pokemonB} />
      </Columns>
      <PokemonStatComparison pokemonA={pokemonA} pokemonB={pokemonB} />
      <PokemonStatRadar pokemonA={pokemonA} pokemonB={pokemonB} />
    </>
  );
};

export default PokemonComparison;
