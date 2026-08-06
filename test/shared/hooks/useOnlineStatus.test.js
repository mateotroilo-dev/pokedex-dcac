import { act, renderHook } from '@testing-library/react';
import { useOnlineStatus } from 'src/shared/hooks/useOnlineStatus.js';

describe('useOnlineStatus', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });
  });

  it('starts online', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });

    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);
  });

  it('goes offline when the offline event fires', () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
        writable: true,
      });
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);
  });

  it('goes back online when the online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
      writable: true,
    });
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        configurable: true,
        writable: true,
      });
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(true);
  });

  it('removes the event listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useOnlineStatus());

    const onlineHandler = addSpy.mock.calls.find(([type]) => type === 'online')[1];
    const offlineHandler = addSpy.mock.calls.find(([type]) => type === 'offline')[1];

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('online', onlineHandler);
    expect(removeSpy).toHaveBeenCalledWith('offline', offlineHandler);
  });
});
