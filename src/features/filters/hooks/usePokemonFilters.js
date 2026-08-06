import { useSearchParams } from 'react-router-dom';
import { SEARCH_PARAM } from 'src/features/filters/constants.js';

const usePokemonFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get(SEARCH_PARAM) ?? '';

  const setSearchTerm = (term) => {
    if (term === searchTerm) return;

    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);
        if (term) {
          nextParams.set(SEARCH_PARAM, term);
        } else {
          nextParams.delete(SEARCH_PARAM);
        }
        return nextParams;
      },
      { replace: true },
    );
  };

  return { searchTerm, setSearchTerm };
};

export { usePokemonFilters };
