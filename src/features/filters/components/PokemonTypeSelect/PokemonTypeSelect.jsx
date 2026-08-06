import { useGetTypesQuery } from 'src/features/filters/api.js';
import { usePokemonFilters } from 'src/features/filters/hooks/usePokemonFilters.js';
import Select from 'src/shared/ui/Select/Select.jsx';
import {
  TYPE_SELECT_EMPTY_OPTION_LABEL,
  TYPE_SELECT_ID,
  TYPE_SELECT_LABEL,
} from 'src/features/filters/components/PokemonTypeSelect/PokemonTypeSelect.constants.js';

const PokemonTypeSelect = () => {
  const { data: options } = useGetTypesQuery();
  const { type, setType } = usePokemonFilters();

  // Si la lista fallo o vino vacia, no hay opciones que ofrecer: el buscador y el listado siguen
  // enteros en vez de un select muerto (ver Riesgos en el plan de la slice 8).
  if (!options || options.length === 0) return null;

  // Un valor de la URL que no esta entre las opciones cae a la opcion vacia: si no, el select queda
  // en blanco sin que ninguna opcion este elegida.
  const value = options.some((option) => option.id === type) ? type : '';

  return (
    <Select
      id={TYPE_SELECT_ID}
      label={TYPE_SELECT_LABEL}
      options={options}
      value={value}
      onChange={setType}
      emptyOptionLabel={TYPE_SELECT_EMPTY_OPTION_LABEL}
    />
  );
};

export default PokemonTypeSelect;
