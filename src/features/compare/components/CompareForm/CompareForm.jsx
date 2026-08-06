import { useMemo } from 'react';
import { useFormik } from 'formik';
import { useGetPokemonIndexQuery } from 'src/services/pokemonApi.js';
import Button from 'src/shared/ui/Button/Button.jsx';
import { useComparisonSelection } from 'src/features/compare/hooks/useComparisonSelection.js';
import { buildComparisonSchema } from 'src/features/compare/lib/buildComparisonSchema.js';
import PokemonSearchableSelect from 'src/features/compare/components/PokemonSearchableSelect/PokemonSearchableSelect.jsx';
import { Form } from 'src/features/compare/components/CompareForm/CompareForm.styles.js';
import {
  FIELD_A_ID,
  FIELD_A_LABEL,
  FIELD_B_ID,
  FIELD_B_LABEL,
  SUBMIT_LABEL,
} from 'src/features/compare/components/CompareForm/CompareForm.constants.js';

const CompareForm = () => {
  const { idA, idB, setSelection } = useComparisonSelection();
  const { data: index } = useGetPokemonIndexQuery();

  const validationSchema = useMemo(
    () => buildComparisonSchema((index ?? []).map((entry) => entry.id)),
    [index],
  );

  const { values, errors, touched, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: { a: idA, b: idB },
    validationSchema,
    onSubmit: ({ a, b }) => setSelection({ a, b }),
  });

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <PokemonSearchableSelect
        id={FIELD_A_ID}
        label={FIELD_A_LABEL}
        value={values.a}
        onChange={(id) => setFieldValue('a', id)}
        error={touched.a ? errors.a : undefined}
      />
      <PokemonSearchableSelect
        id={FIELD_B_ID}
        label={FIELD_B_LABEL}
        value={values.b}
        onChange={(id) => setFieldValue('b', id)}
        error={touched.b ? errors.b : undefined}
      />
      <Button type="submit">{SUBMIT_LABEL}</Button>
    </Form>
  );
};

export default CompareForm;
