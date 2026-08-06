import { Control, Field, Label } from 'src/shared/ui/Select/Select.styles.js';

const Select = ({ id, label, options, value, onChange, emptyOptionLabel }) => (
  <Field>
    <Label htmlFor={id}>{label}</Label>
    <Control id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{emptyOptionLabel}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </Control>
  </Field>
);

export default Select;
