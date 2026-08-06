import { act, screen } from '@testing-library/react';
import ConnectionIndicator from 'src/features/connection/components/ConnectionIndicator/ConnectionIndicator.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('ConnectionIndicator', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });
  });

  it('announces the online state as an accessible status region', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });

    renderWithProviders(<ConnectionIndicator />);

    expect(screen.getByText('En línea')).toHaveAttribute('role', 'status');
  });

  it('switches to the offline text when the connection drops', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });
    renderWithProviders(<ConnectionIndicator />);

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
        writable: true,
      });
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByText('Sin conexión')).toHaveAttribute('role', 'status');
  });
});
