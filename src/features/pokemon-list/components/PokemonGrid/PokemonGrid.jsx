import Grid from 'src/shared/ui/Grid/Grid.jsx';
import PokemonCard from 'src/features/pokemon-list/components/PokemonCard/PokemonCard.jsx';
import { POKEMON_CARD_MIN_WIDTH } from 'src/features/pokemon-list/constants.js';

const PokemonGrid = ({ pokemon }) => (
  <Grid minItemWidth={POKEMON_CARD_MIN_WIDTH}>
    {pokemon.map((entry) => (
      <PokemonCard key={entry.id} pokemon={entry} />
    ))}
  </Grid>
);

export default PokemonGrid;
