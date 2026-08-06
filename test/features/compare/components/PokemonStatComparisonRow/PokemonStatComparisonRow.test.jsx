import { screen } from '@testing-library/react';
import PokemonStatComparisonRow from 'src/features/compare/components/PokemonStatComparisonRow/PokemonStatComparisonRow.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const renderRow = (row) =>
  renderWithProviders(
    <table>
      <tbody>
        <PokemonStatComparisonRow row={row} colorA="#000000" colorB="#111111" />
      </tbody>
    </table>,
  );

describe('PokemonStatComparisonRow', () => {
  it('marks the pokemon with the higher stat as the winner beyond just color', () => {
    renderRow({ name: 'hp', label: 'PS', valueA: 100, valueB: 45, winner: 'a' });

    expect(screen.getByText('Gana')).toBeInTheDocument();
    expect(screen.queryByText('Empate')).not.toBeInTheDocument();
  });

  it('announces a tie when both pokemon have the same stat', () => {
    renderRow({ name: 'speed', label: 'Velocidad', valueA: 45, valueB: 45, winner: null });

    expect(screen.getAllByText('Empate')).toHaveLength(2);
    expect(screen.queryByText('Gana')).not.toBeInTheDocument();
  });
});
