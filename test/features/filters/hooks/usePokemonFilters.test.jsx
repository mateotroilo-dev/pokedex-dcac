import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePokemonFilters } from 'src/features/filters/hooks/usePokemonFilters.js';
import { GENERATION_PARAM, SEARCH_PARAM, TYPE_PARAM } from 'src/features/filters/constants.js';

const wrapperWithEntries = (initialEntries) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
  return Wrapper;
};

describe('usePokemonFilters', () => {
  it('reads the three params together from the URL', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries([
        `/?${SEARCH_PARAM}=pikachu&${TYPE_PARAM}=electric&${GENERATION_PARAM}=1`,
      ]),
    });

    expect(result.current.term).toBe('pikachu');
    expect(result.current.type).toBe('electric');
    expect(result.current.generation).toBe(1);
  });

  it('defaults to an empty term, an empty type and an undefined generation when nothing is set', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries(['/']),
    });

    expect(result.current.term).toBe('');
    expect(result.current.type).toBe('');
    expect(result.current.generation).toBeUndefined();
  });

  it('reads the generation as a number', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries([`/?${GENERATION_PARAM}=3`]),
    });

    expect(result.current.generation).toBe(3);
  });

  it('each setter adds and removes its own param without touching the others', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries(['/']),
    });

    act(() => result.current.setTerm('pikachu'));
    act(() => result.current.setType('electric'));
    act(() => result.current.setGeneration('1'));

    expect(result.current.term).toBe('pikachu');
    expect(result.current.type).toBe('electric');
    expect(result.current.generation).toBe(1);

    act(() => result.current.setType(''));

    expect(result.current.type).toBe('');
    expect(result.current.term).toBe('pikachu');
    expect(result.current.generation).toBe(1);
  });

  it('does not navigate when writing the same value that is already there', () => {
    let renders = 0;
    const { result } = renderHook(
      () => {
        renders += 1;
        return usePokemonFilters();
      },
      { wrapper: wrapperWithEntries([`/?${SEARCH_PARAM}=pikachu`]) },
    );

    act(() => result.current.setTerm('pikachu'));
    expect(renders).toBe(1);

    act(() => result.current.setTerm('raichu'));
    expect(renders).toBe(2);
  });

  describe('filters and hasActiveFilters', () => {
    it('is undefined, and hasActiveFilters is false, with no criteria set', () => {
      const { result } = renderHook(() => usePokemonFilters(), {
        wrapper: wrapperWithEntries(['/']),
      });

      expect(result.current.filters).toBeUndefined();
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('carries only the criteria that are set', () => {
      const { result } = renderHook(() => usePokemonFilters(), {
        wrapper: wrapperWithEntries([`/?${TYPE_PARAM}=electric`]),
      });

      expect(result.current.filters).toEqual({ type: 'electric' });
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('carries the three criteria when all three are set', () => {
      const { result } = renderHook(() => usePokemonFilters(), {
        wrapper: wrapperWithEntries([
          `/?${SEARCH_PARAM}=pikachu&${TYPE_PARAM}=electric&${GENERATION_PARAM}=1`,
        ]),
      });

      expect(result.current.filters).toEqual({ term: 'pikachu', type: 'electric', generation: 1 });
      expect(result.current.hasActiveFilters).toBe(true);
    });
  });
});
