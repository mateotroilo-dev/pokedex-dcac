import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from 'src/shared/ui/Select/Select.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const OPTIONS = [
  { id: 'grass', label: 'grass' },
  { id: 'water', label: 'water' },
];

describe('Select', () => {
  it('renders the label, the empty option and one option per entry', () => {
    renderWithProviders(
      <Select
        id="pokemon-type"
        label="Tipo"
        options={OPTIONS}
        value=""
        onChange={() => {}}
        emptyOptionLabel="Todos"
      />,
    );

    const select = screen.getByRole('combobox', { name: 'Tipo' });
    expect(select).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length + 1);
  });

  it('shows the value it receives as selected', () => {
    renderWithProviders(
      <Select
        id="pokemon-type"
        label="Tipo"
        options={OPTIONS}
        value="water"
        onChange={() => {}}
        emptyOptionLabel="Todos"
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveValue('water');
  });

  it('calls onChange with the id of the chosen option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    renderWithProviders(
      <Select
        id="pokemon-type"
        label="Tipo"
        options={OPTIONS}
        value=""
        onChange={handleChange}
        emptyOptionLabel="Todos"
      />,
    );

    await user.selectOptions(screen.getByRole('combobox', { name: 'Tipo' }), 'water');

    expect(handleChange).toHaveBeenCalledWith('water');
  });
});
