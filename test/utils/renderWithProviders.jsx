import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { makeStore } from 'src/app/store.js';
import { theme } from 'src/shared/styles/theme.js';

export const renderWithProviders = (
  ui,
  { preloadedState, store = makeStore(preloadedState), routes, initialEntries, ...options } = {},
) => {
  if (routes && ui) {
    throw new Error('renderWithProviders: pass either `ui` or `routes`, not both.');
  }

  // RouterProvider no acepta children: con `routes` reemplaza al MemoryRouter fijo en vez de
  // anidarse adentro, que es el invariant de react-router que ya documenta el contrato.
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        {routes ? (
          <RouterProvider router={createMemoryRouter(routes, { initialEntries })} />
        ) : (
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        )}
      </Provider>
    </ThemeProvider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
};
