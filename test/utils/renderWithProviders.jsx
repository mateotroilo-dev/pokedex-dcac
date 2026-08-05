import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { makeStore } from 'src/app/store.js';
import { theme } from 'src/shared/styles/theme.js';

export const renderWithProviders = (
  ui,
  { preloadedState, store = makeStore(preloadedState), ...options } = {},
) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </ThemeProvider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
};
