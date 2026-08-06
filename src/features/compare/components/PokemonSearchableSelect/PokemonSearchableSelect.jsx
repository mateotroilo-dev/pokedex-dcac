import { useGetPokemonIndexQuery } from 'src/services/pokemonApi.js';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import SearchableSelect from 'src/shared/ui/SearchableSelect/SearchableSelect.jsx';
import { MAX_VISIBLE_OPTIONS } from 'src/features/compare/constants.js';
import {
  MORE_RESULTS_TEXT,
  NO_RESULTS_TEXT,
} from 'src/features/compare/components/PokemonSearchableSelect/PokemonSearchableSelect.constants.js';

const PokemonSearchableSelect = ({ id, label, value, onChange, error }) => {
  const { data: index, isLoading } = useGetPokemonIndexQuery();

  const options = (index ?? []).map((entry) => ({
    id: entry.id,
    label: `${formatPokemonNumber(entry.id)} ${entry.name}`,
  }));

  return (
    <SearchableSelect
      id={id}
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      maxVisibleOptions={MAX_VISIBLE_OPTIONS}
      noResultsText={NO_RESULTS_TEXT}
      moreResultsText={MORE_RESULTS_TEXT}
      disabled={isLoading}
      error={error}
    />
  );
};

export default PokemonSearchableSelect;
