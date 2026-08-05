import Grid from 'src/shared/ui/Grid/Grid.jsx';
import PokemonCard from 'src/features/pokemon-list/components/PokemonCard/PokemonCard.jsx';
import PokemonCardSkeleton from 'src/features/pokemon-list/components/PokemonCardSkeleton/PokemonCardSkeleton.jsx';
import { POKEMON_CARD_MIN_WIDTH } from 'src/features/pokemon-list/constants.js';

// Los skeletons de la pagina en vuelo van dentro de la misma grilla, no en el pie: asi caen en las
// columnas y la lista no salta cuando llegan los datos.
const PokemonGrid = ({ pokemon, pendingCount = 0 }) => (
  <Grid minItemWidth={POKEMON_CARD_MIN_WIDTH}>
    {pokemon.map((entry) => (
      <PokemonCard key={entry.id} pokemon={entry} />
    ))}
    {Array.from({ length: pendingCount }, (_, position) => (
      <PokemonCardSkeleton key={`pending-${position}`} />
    ))}
  </Grid>
);

export default PokemonGrid;
