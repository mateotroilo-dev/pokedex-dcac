import Grid from 'src/shared/ui/Grid/Grid.jsx';
import PokemonCardSkeleton from 'src/features/pokemon-list/components/PokemonCardSkeleton/PokemonCardSkeleton.jsx';
import { PAGE_SIZE, POKEMON_CARD_MIN_WIDTH } from 'src/features/pokemon-list/constants.js';

// Tantos huecos como trae una pagina: la grilla ya queda del alto final antes de que lleguen los
// datos, asi que al reemplazarlos no salta.
const PokemonGridSkeleton = () => (
  <Grid minItemWidth={POKEMON_CARD_MIN_WIDTH}>
    {Array.from({ length: PAGE_SIZE }, (_, position) => (
      <PokemonCardSkeleton key={position} />
    ))}
  </Grid>
);

export default PokemonGridSkeleton;
