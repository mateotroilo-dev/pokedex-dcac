import { act, renderHook } from '@testing-library/react';
import { useDebounce } from 'src/shared/hooks/useDebounce.js';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not emit before the delay elapses', () => {
    const { result } = renderHook(({ value, delayMs }) => useDebounce(value, delayMs), {
      initialProps: { value: 'a', delayMs: 300 },
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('a');
  });

  it('emits only the last value, skipping the intermediate ones', () => {
    const { result, rerender } = renderHook(({ value, delayMs }) => useDebounce(value, delayMs), {
      initialProps: { value: 'a', delayMs: 300 },
    });

    rerender({ value: 'ab', delayMs: 300 });
    rerender({ value: 'abc', delayMs: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('abc');
  });

  it('clears the pending timer when the value changes and when it unmounts', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { rerender, unmount } = renderHook(({ value, delayMs }) => useDebounce(value, delayMs), {
      initialProps: { value: 'a', delayMs: 300 },
    });

    rerender({ value: 'ab', delayMs: 300 });
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  });
});
