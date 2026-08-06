import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Toast from 'src/shared/ui/Toast/Toast.jsx';
import { TOAST_DISMISS_LABEL } from 'src/shared/ui/Toast/Toast.constants.js';
import { theme } from 'src/shared/styles/theme.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('Toast', () => {
  it('shows the message it receives', () => {
    renderWithProviders(<Toast message="Agregado al equipo" onDismiss={() => {}} />);

    expect(screen.getByText('Agregado al equipo')).toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    renderWithProviders(<Toast message="Agregado al equipo" onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: TOAST_DISMISS_LABEL }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('paints itself differently on the warning variant', () => {
    renderWithProviders(<Toast message="Ya tenés 6" variant="warning" onDismiss={() => {}} />);

    expect(screen.getByText('Ya tenés 6').parentElement).toHaveStyle({
      backgroundColor: theme.colors.accent,
    });
  });
});
