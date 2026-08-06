import * as yup from 'yup';

const REQUIRED_MESSAGE = 'Elegí un pokémon';
const NOT_FOUND_MESSAGE = 'Ese pokémon no existe';
const DUPLICATE_MESSAGE = 'Elegí dos pokémon distintos';

// El combobox solo deja elegir de la lista, pero los initialValues salen de la URL escrita a mano:
// 'exists' y 'different' cubren lo que el combobox ya garantiza pero la URL no.
export const buildComparisonSchema = (validIds) => {
  const validIdSet = new Set(validIds);

  const pokemonId = (otherField) =>
    yup
      .number()
      .typeError(NOT_FOUND_MESSAGE)
      .required(REQUIRED_MESSAGE)
      .test('exists', NOT_FOUND_MESSAGE, (value) => value === undefined || validIdSet.has(value))
      .test('different', DUPLICATE_MESSAGE, function (value) {
        return value === undefined || value !== this.parent[otherField];
      });

  return yup.object({
    a: pokemonId('b'),
    b: pokemonId('a'),
  });
};
