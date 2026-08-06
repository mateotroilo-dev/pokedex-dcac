import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePokemonFilters } from 'src/features/filters/hooks/usePokemonFilters.js';
import { SEARCH_PARAM } from 'src/features/filters/constants.js';

const wrapperWithEntries = (initialEntries) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
  return Wrapper;
};

describe('usePokemonFilters', () => {
  it('reads the initial term from the URL', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries([`/?${SEARCH_PARAM}=pikachu`]),
    });

    expect(result.current.searchTerm).toBe('pikachu');
  });

  it('defaults to an empty term when the param is absent', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries(['/']),
    });

    expect(result.current.searchTerm).toBe('');
  });

  it('adds the param when writing a term', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries(['/']),
    });

    act(() => result.current.setSearchTerm('pikachu'));

    expect(result.current.searchTerm).toBe('pikachu');
  });

  it('removes the param instead of leaving it empty', () => {
    const { result } = renderHook(() => usePokemonFilters(), {
      wrapper: wrapperWithEntries([`/?${SEARCH_PARAM}=pikachu`]),
    });

    act(() => result.current.setSearchTerm(''));

    expect(result.current.searchTerm).toBe('');
  });

  it('does not navigate when writing the same term that is already there', () => {
    let renders = 0;
    const { result } = renderHook(
      () => {
        renders += 1;
        return usePokemonFilters();
      },
      { wrapper: wrapperWithEntries([`/?${SEARCH_PARAM}=pikachu`]) },
    );

    act(() => result.current.setSearchTerm('pikachu'));
    expect(renders).toBe(1);

    act(() => result.current.setSearchTerm('raichu'));
    expect(renders).toBe(2);
  });
});
