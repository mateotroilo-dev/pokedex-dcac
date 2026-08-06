import { screen } from '@testing-library/react';
import EmptyState from 'src/shared/ui/EmptyState/EmptyState.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('EmptyState', () => {
  it('shows the message', () => {
    renderWithProviders(<EmptyState message="No hay nada para mostrar." />);

    expect(screen.getByText('No hay nada para mostrar.')).toBeInTheDocument();
  });

  it('hides the illustration from assistive tech', () => {
    const { container } = renderWithProviders(<EmptyState message="No hay nada para mostrar." />);

    const illustration = container.querySelector('svg');
    expect(illustration).toHaveAttribute('aria-hidden', 'true');
  });
});
