import { useTheme } from 'styled-components';
import RadarChart from 'src/shared/ui/RadarChart/RadarChart.jsx';
import { MAX_BASE_STAT, STAT_LABELS } from 'src/shared/lib/constants/stats.js';
import { resolveComparisonColors } from 'src/features/compare/lib/resolveComparisonColors.js';
import {
  RADAR_SIZE,
  getRadarLabel,
} from 'src/features/compare/components/PokemonStatRadar/PokemonStatRadar.constants.js';

const toStatValues = (pokemon) => {
  const statsByName = Object.fromEntries(pokemon.stats.map((stat) => [stat.name, stat.value]));
  return Object.keys(STAT_LABELS).map((name) => statsByName[name]);
};

const PokemonStatRadar = ({ pokemonA, pokemonB }) => {
  const theme = useTheme();
  const { colorA, colorB } = resolveComparisonColors(
    pokemonA,
    pokemonB,
    theme.colors.accentSecondary,
  );

  return (
    <RadarChart
      axes={Object.values(STAT_LABELS)}
      series={[
        { label: pokemonA.name, values: toStatValues(pokemonA), color: colorA },
        { label: pokemonB.name, values: toStatValues(pokemonB), color: colorB },
      ]}
      max={MAX_BASE_STAT}
      size={RADAR_SIZE}
      ariaLabel={getRadarLabel(pokemonA.name, pokemonB.name)}
    />
  );
};

export default PokemonStatRadar;
