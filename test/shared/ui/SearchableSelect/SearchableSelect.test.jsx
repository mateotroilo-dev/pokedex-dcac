import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchableSelect from 'src/shared/ui/SearchableSelect/SearchableSelect.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const OPTIONS = [
  { id: 1, label: 'bulbasaur' },
  { id: 2, label: 'ivysaur' },
  { id: 3, label: 'venusaur' },
  { id: 4, label: 'charmander' },
  { id: 5, label: 'charmeleon' },
];

const renderSelect = (overrides = {}) => {
  const onChange = vi.fn();
  renderWithProviders(
    <SearchableSelect
      id="pokemon-a"
      label="Primero"
      options={OPTIONS}
      value={undefined}
      onChange={onChange}
      maxVisibleOptions={3}
      noResultsText="Sin resultados"
      moreResultsText="Hay mas resultados"
      {...overrides}
    />,
  );
  return { onChange };
};

describe('SearchableSelect', () => {
  it('opens the listbox on focus, capped at maxVisibleOptions, with a notice that there are more', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole('combobox', { name: 'Primero' }));

    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByText('Hay mas resultados')).toBeInTheDocument();
  });

  it('filters options by substring as the user types', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.type(screen.getByRole('combobox', { name: 'Primero' }), 'char');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options.map((option) => option.textContent)).toEqual(['charmander', 'charmeleon']);
  });

  it('shows the no-results notice when nothing matches', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.type(screen.getByRole('combobox', { name: 'Primero' }), 'zzz');

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('selects an option on click and closes the listbox', async () => {
    const user = userEvent.setup();
    const { onChange } = renderSelect();

    await user.click(screen.getByRole('combobox', { name: 'Primero' }));
    await user.click(screen.getByRole('option', { name: 'ivysaur' }));

    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('combobox', { name: 'Primero' })).toHaveValue('ivysaur');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('moves through the options with the arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    const { onChange } = renderSelect();

    const input = screen.getByRole('combobox', { name: 'Primero' });
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      within(listbox).getAllByRole('option')[1].id,
    );

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith(2);
    expect(input).toHaveValue('ivysaur');
  });

  it('restores the previous text and does not select on Escape', async () => {
    const user = userEvent.setup();
    const { onChange } = renderSelect({ value: 1 });

    const input = screen.getByRole('combobox', { name: 'Primero' });
    await user.click(input);
    await user.keyboard('char');
    await user.keyboard('{Escape}');

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('bulbasaur');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the listbox on blur', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole('combobox', { name: 'Primero' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders disabled', () => {
    renderSelect({ disabled: true });

    expect(screen.getByRole('combobox', { name: 'Primero' })).toBeDisabled();
  });
});
