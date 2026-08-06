import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useToast } from 'src/shared/hooks/useToast.js';
import { TOAST_DURATION_MS } from 'src/shared/ui/ToastProvider/ToastProvider.constants.js';
import { TOAST_DISMISS_LABEL } from 'src/shared/ui/Toast/Toast.constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const ShowToastButton = ({ message, variant }) => {
  const showToast = useToast();

  return (
    <button type="button" onClick={() => showToast(message, variant)}>
      show
    </button>
  );
};

describe('ToastProvider', () => {
  it('mounts the live region even without toasts', () => {
    renderWithProviders(<ShowToastButton message="hola" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows a toast when showToast is called', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ShowToastButton message="Agregado al equipo" />);

    await user.click(screen.getByRole('button', { name: 'show' }));

    expect(screen.getByText('Agregado al equipo')).toBeInTheDocument();
  });

  it('dismisses a toast when its dismiss button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ShowToastButton message="Agregado al equipo" />);
    await user.click(screen.getByRole('button', { name: 'show' }));

    await user.click(screen.getByRole('button', { name: TOAST_DISMISS_LABEL }));

    expect(screen.queryByText('Agregado al equipo')).not.toBeInTheDocument();
  });

  it('auto-dismisses a toast after its duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<ShowToastButton message="Agregado al equipo" />);
    await user.click(screen.getByRole('button', { name: 'show' }));
    expect(screen.getByText('Agregado al equipo')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS);
    });

    expect(screen.queryByText('Agregado al equipo')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('keeps several toasts queued at the same time', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ShowToastButton message="uno" />);
    const button = screen.getByRole('button', { name: 'show' });

    await user.click(button);
    await user.click(button);

    expect(screen.getAllByText('uno')).toHaveLength(2);
  });
});
