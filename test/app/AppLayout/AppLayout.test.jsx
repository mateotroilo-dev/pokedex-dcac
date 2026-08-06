import { screen } from '@testing-library/react';
import AppLayout from 'src/app/AppLayout/AppLayout.jsx';
import { COMPARE_NAV_LABEL, TEAM_NAV_LABEL } from 'src/app/AppLayout/AppLayout.constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const routes = [{ path: '/', element: <AppLayout />, children: [{ index: true, element: null }] }];

describe('AppLayout', () => {
  it('links to the team page from the nav', () => {
    renderWithProviders(null, { routes, initialEntries: ['/'] });

    expect(screen.getByRole('link', { name: TEAM_NAV_LABEL })).toHaveAttribute('href', '/team');
  });

  it('links to the compare page from the nav', () => {
    renderWithProviders(null, { routes, initialEntries: ['/'] });

    expect(screen.getByRole('link', { name: COMPARE_NAV_LABEL })).toHaveAttribute(
      'href',
      '/compare',
    );
  });

  it('shows the connection indicator in the header', () => {
    renderWithProviders(null, { routes, initialEntries: ['/'] });

    expect(screen.getByText('En línea')).toBeInTheDocument();
  });
});
