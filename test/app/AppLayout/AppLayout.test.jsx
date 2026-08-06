import { screen } from '@testing-library/react';
import AppLayout from 'src/app/AppLayout/AppLayout.jsx';
import { TEAM_NAV_LABEL } from 'src/app/AppLayout/AppLayout.constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const routes = [{ path: '/', element: <AppLayout />, children: [{ index: true, element: null }] }];

describe('AppLayout', () => {
  it('links to the team page from the nav', () => {
    renderWithProviders(null, { routes, initialEntries: ['/'] });

    expect(screen.getByRole('link', { name: TEAM_NAV_LABEL })).toHaveAttribute('href', '/team');
  });
});
