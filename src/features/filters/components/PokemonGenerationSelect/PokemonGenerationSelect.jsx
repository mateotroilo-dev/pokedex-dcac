import { useGetGenerationsQuery } from 'src/features/filters/api.js';
import { usePokemonFilters } from 'src/features/filters/hooks/usePokemonFilters.js';
import Select from 'src/shared/ui/Select/Select.jsx';
import {
  GENERATION_SELECT_EMPTY_OPTION_LABEL,
  GENERATION_SELECT_ID,
  GENERATION_SELECT_LABEL,
} from 'src/features/filters/components/PokemonGenerationSelect/PokemonGenerationSelect.constants.js';

const PokemonGenerationSelect = () => {
  const { data: options } = useGetGenerationsQuery();
  const { generation, setGeneration } = usePokemonFilters();

  // Si la lista fallo o vino vacia, no hay opciones que ofrecer: el buscador y el listado siguen
  // enteros en vez de un select muerto (ver Riesgos en el plan de la slice 8).
  if (!options || options.length === 0) return null;

  // Un valor de la URL que no esta entre las opciones cae a la opcion vacia: si no, el select queda
  // en blanco sin que ninguna opcion este elegida.
  const value = options.some((option) => option.id === generation) ? generation : '';

  return (
    <Select
      id={GENERATION_SELECT_ID}
      label={GENERATION_SELECT_LABEL}
      options={options}
      value={value}
      onChange={setGeneration}
      emptyOptionLabel={GENERATION_SELECT_EMPTY_OPTION_LABEL}
    />
  );
};

export default PokemonGenerationSelect;
