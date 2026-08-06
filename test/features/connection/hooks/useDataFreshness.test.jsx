import { useContext } from 'react';
import { render, renderHook } from '@testing-library/react';
import { FreshnessContext } from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.context.js';
import FreshnessProvider from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.jsx';
import { useDataFreshness } from 'src/features/connection/hooks/useDataFreshness.js';

const Reporter = ({ freshness }) => {
  useDataFreshness(freshness);
  return null;
};

const Reader = ({ onRead }) => {
  onRead(useContext(FreshnessContext).freshness);
  return null;
};

describe('useDataFreshness', () => {
  it('reports the freshness data to the provider', () => {
    const reads = [];

    render(
      <FreshnessProvider>
        <Reporter freshness={{ fulfilledTimeStamp: 123, isFetching: false, tags: ['a'] }} />
        <Reader onRead={(freshness) => reads.push(freshness)} />
      </FreshnessProvider>,
    );

    expect(reads.at(-1)).toEqual({ fulfilledTimeStamp: 123, isFetching: false, tags: ['a'] });
  });

  it('clears the reported freshness when the reporting page unmounts', () => {
    const reads = [];
    const onRead = (freshness) => reads.push(freshness);

    const { rerender } = render(
      <FreshnessProvider>
        <Reporter freshness={{ fulfilledTimeStamp: 123, isFetching: false, tags: ['a'] }} />
        <Reader onRead={onRead} />
      </FreshnessProvider>,
    );

    rerender(
      <FreshnessProvider>
        <Reader onRead={onRead} />
      </FreshnessProvider>,
    );

    expect(reads.at(-1)).toBeNull();
  });

  it('is a no-op without a provider above it', () => {
    expect(() =>
      renderHook(() => useDataFreshness({ fulfilledTimeStamp: 123, isFetching: false, tags: [] })),
    ).not.toThrow();
  });
});
