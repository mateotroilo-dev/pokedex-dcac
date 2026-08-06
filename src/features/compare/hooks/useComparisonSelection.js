import { useSearchParams } from 'react-router-dom';
import { COMPARE_A_PARAM, COMPARE_B_PARAM } from 'src/features/compare/constants.js';

// Ausente o vacio es "todavia no elegiste" (undefined); presente pero no un entero positivo es
// "pediste algo que no existe" (NaN), el mismo destino que un id que la API responde con 404.
const parseComparisonId = (rawValue) => {
  if (!rawValue) return undefined;

  const id = Number(rawValue);
  return Number.isInteger(id) && id > 0 ? id : NaN;
};

const useComparisonSelection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const idA = parseComparisonId(searchParams.get(COMPARE_A_PARAM));
  const idB = parseComparisonId(searchParams.get(COMPARE_B_PARAM));

  // Los dos ids se escriben juntos porque son un solo submit, no dos ediciones independientes, y
  // cada comparacion merece su propia entrada de historial (push, no replace).
  const setSelection = ({ a, b }) => {
    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams);
      nextParams.set(COMPARE_A_PARAM, a);
      nextParams.set(COMPARE_B_PARAM, b);
      return nextParams;
    });
  };

  return { idA, idB, setSelection };
};

export { useComparisonSelection };
