import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useComparisonSelection } from 'src/features/compare/hooks/useComparisonSelection.js';
import { COMPARE_A_PARAM, COMPARE_B_PARAM } from 'src/features/compare/constants.js';

const wrapperWithEntries = (initialEntries) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
  return Wrapper;
};

describe('useComparisonSelection', () => {
  it('reads both ids from the URL', () => {
    const { result } = renderHook(() => useComparisonSelection(), {
      wrapper: wrapperWithEntries([`/?${COMPARE_A_PARAM}=25&${COMPARE_B_PARAM}=6`]),
    });

    expect(result.current.idA).toBe(25);
    expect(result.current.idB).toBe(6);
  });

  it('is undefined for each id that is absent or empty', () => {
    const { result } = renderHook(() => useComparisonSelection(), {
      wrapper: wrapperWithEntries([`/?${COMPARE_A_PARAM}=`]),
    });

    expect(result.current.idA).toBeUndefined();
    expect(result.current.idB).toBeUndefined();
  });

  it('is NaN for an id that is present but not a positive integer', () => {
    const { result } = renderHook(() => useComparisonSelection(), {
      wrapper: wrapperWithEntries([`/?${COMPARE_A_PARAM}=abc&${COMPARE_B_PARAM}=-3`]),
    });

    expect(result.current.idA).toBeNaN();
    expect(result.current.idB).toBeNaN();
  });

  it('setSelection writes both ids together with a push navigation', () => {
    const { result } = renderHook(() => useComparisonSelection(), {
      wrapper: wrapperWithEntries(['/']),
    });

    act(() => result.current.setSelection({ a: 25, b: 6 }));

    expect(result.current.idA).toBe(25);
    expect(result.current.idB).toBe(6);
  });
});
