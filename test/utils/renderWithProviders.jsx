import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from 'src/app/store.js';

export const renderWithProviders = (
  ui,
  { preloadedState, store = makeStore(preloadedState), ...options } = {},
) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
};
