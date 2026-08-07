import { useSearchParams } from 'react-router-dom';
import { GENERATION_PARAM, SEARCH_PARAM, TYPE_PARAM } from 'src/features/filters/constants.js';

const usePokemonFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const term = searchParams.get(SEARCH_PARAM) ?? '';
  const type = searchParams.get(TYPE_PARAM) ?? '';
  const generationParam = searchParams.get(GENERATION_PARAM) ?? '';
  const generation = generationParam ? Number(generationParam) : undefined;

  // Un mismo escritor por parametro: el valor vacio borra el param y escribir lo mismo no navega.
  // Devuelve si efectivamente escribio, porque el buscador (ver PokemonSearchField) necesita saber
  // si su `replace` reemplazo una entrada propia o si el llamado fue un no-op.
  const write =
    (param, currentValue) =>
    (value, { replace = true } = {}) => {
      if (value === currentValue) return false;

      setSearchParams(
        (previousParams) => {
          const nextParams = new URLSearchParams(previousParams);
          if (value) {
            nextParams.set(param, value);
          } else {
            nextParams.delete(param);
          }
          return nextParams;
        },
        { replace },
      );

      return true;
    };

  // Los selects siempre empujan: cada eleccion es su propia entrada de historial (ver
  // PokemonTypeSelect / PokemonGenerationSelect). El buscador decide su `replace` el mismo, porque
  // solo el sabe si la entrada de arriba la escribio su propio tecleo o otra cosa (ver
  // PokemonSearchField) — pasarle `replace: true` a ciegas pisaria la entrada de un select recien
  // elegido, o la entrada original antes de tipear nada.
  const setTerm = write(SEARCH_PARAM, term);
  const setType = (value) => write(TYPE_PARAM, type)(value, { replace: false });
  const setGeneration = (value) =>
    write(GENERATION_PARAM, generationParam)(value, { replace: false });

  const criteria = {};
  if (term) criteria.term = term;
  if (type) criteria.type = type;
  if (generation !== undefined) criteria.generation = generation;

  // undefined y no {} cuando no hay ningun criterio: es lo que sostiene la persistencia del listado
  // sin filtros.
  const filters = Object.keys(criteria).length > 0 ? criteria : undefined;

  return {
    term,
    setTerm,
    type,
    setType,
    generation,
    setGeneration,
    filters,
    hasActiveFilters: filters !== undefined,
  };
};

export { usePokemonFilters };
