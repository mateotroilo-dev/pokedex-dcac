import PokemonStatBar from 'src/features/pokemon-detail/components/PokemonStatBar/PokemonStatBar.jsx';
import PokemonStatTotal from 'src/features/pokemon-detail/components/PokemonStatTotal/PokemonStatTotal.jsx';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';
import { MAX_BASE_STAT, STAT_LABELS } from 'src/shared/lib/constants/stats.js';
import {
  List,
  Wrapper,
} from 'src/features/pokemon-detail/components/PokemonStats/PokemonStats.styles.js';

const sumStats = (stats) => stats.reduce((total, stat) => total + stat.value, 0);

const PokemonStats = ({ pokemon }) => {
  const color = POKEMON_TYPE_COLORS[pokemon.types[0]];

  return (
    <Wrapper>
      <List>
        {pokemon.stats.map((stat) => (
          <PokemonStatBar
            key={stat.name}
            label={STAT_LABELS[stat.name]}
            value={stat.value}
            max={MAX_BASE_STAT}
            color={color}
          />
        ))}
      </List>
      <PokemonStatTotal value={sumStats(pokemon.stats)} />
    </Wrapper>
  );
};

export default PokemonStats;
