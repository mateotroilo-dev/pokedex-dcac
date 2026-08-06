import PokemonSearchField from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.jsx';
import PokemonTypeSelect from 'src/features/filters/components/PokemonTypeSelect/PokemonTypeSelect.jsx';
import PokemonGenerationSelect from 'src/features/filters/components/PokemonGenerationSelect/PokemonGenerationSelect.jsx';
import { Bar } from 'src/features/filters/components/PokemonFilterBar/PokemonFilterBar.styles.js';

const PokemonFilterBar = () => (
  <Bar>
    <PokemonSearchField />
    <PokemonTypeSelect />
    <PokemonGenerationSelect />
  </Bar>
);

export default PokemonFilterBar;
