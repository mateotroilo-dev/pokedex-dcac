import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeStore } from 'src/app/store.js';
import {
  CACHED_LABEL,
  REFRESH_LABEL,
} from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.constants.js';
import DataFreshnessIndicator from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.jsx';
import { FreshnessContext } from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.context.js';
import { FRESHNESS_HOUR_MS } from 'src/features/connection/constants.js';
import { baseApi } from 'src/services/baseApi.js';
import { UI_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const TAGS = [{ type: 'Pokemon', id: 1 }];

const renderIndicator = (freshness, { hydratedAt = null, store } = {}) =>
  renderWithProviders(
    <FreshnessContext.Provider value={{ freshness, reportFreshness: () => {} }}>
      <DataFreshnessIndicator />
    </FreshnessContext.Provider>,
    store ? { store } : { preloadedState: { [UI_REDUCER_PATH]: { hydratedAt } } },
  );

describe('DataFreshnessIndicator', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });
  });

  it('renders nothing when no page has reported freshness', () => {
    renderIndicator(null);

    expect(screen.queryByRole('button', { name: REFRESH_LABEL })).not.toBeInTheDocument();
  });

  it('renders nothing while the reported query has no fulfilledTimeStamp yet', () => {
    renderIndicator({ fulfilledTimeStamp: undefined, isFetching: true, tags: TAGS });

    expect(screen.queryByRole('button', { name: REFRESH_LABEL })).not.toBeInTheDocument();
  });

  it('shows the age without the cached marker when the data is fresh', () => {
    renderIndicator(
      { fulfilledTimeStamp: Date.now() - 2 * FRESHNESS_HOUR_MS, isFetching: false, tags: TAGS },
      { hydratedAt: null },
    );

    expect(screen.getByText('hace 2 h')).toBeInTheDocument();
  });

  it('marks the data as cached when it came from before the current session hydrated', () => {
    const now = Date.now();
    renderIndicator(
      { fulfilledTimeStamp: now - 2 * FRESHNESS_HOUR_MS, isFetching: false, tags: TAGS },
      { hydratedAt: now - FRESHNESS_HOUR_MS },
    );

    expect(screen.getByText(`hace 2 h${CACHED_LABEL}`)).toBeInTheDocument();
  });

  it('dispatches invalidateTags with the reported tags when the refresh button is clicked', async () => {
    const user = userEvent.setup();
    const store = makeStore({ [UI_REDUCER_PATH]: { hydratedAt: null } });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderIndicator(
      { fulfilledTimeStamp: Date.now() - FRESHNESS_HOUR_MS, isFetching: false, tags: TAGS },
      { store },
    );

    await user.click(screen.getByRole('button', { name: REFRESH_LABEL }));

    expect(dispatchSpy).toHaveBeenCalledWith(baseApi.util.invalidateTags(TAGS));
  });

  it('disables the refresh button while offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
      writable: true,
    });

    renderIndicator(
      { fulfilledTimeStamp: Date.now() - FRESHNESS_HOUR_MS, isFetching: false, tags: TAGS },
      { hydratedAt: null },
    );

    expect(screen.getByRole('button', { name: REFRESH_LABEL })).toBeDisabled();
  });

  it('disables the refresh button while the reported query is refetching', () => {
    renderIndicator(
      { fulfilledTimeStamp: Date.now() - FRESHNESS_HOUR_MS, isFetching: true, tags: TAGS },
      { hydratedAt: null },
    );

    expect(screen.getByRole('button', { name: REFRESH_LABEL })).toBeDisabled();
  });
});
