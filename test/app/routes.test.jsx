import { screen } from '@testing-library/react';
import { routes } from 'src/app/routes.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { NOT_FOUND_MESSAGE } from 'src/pages/NotFoundPage/NotFoundPage.constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('routes', () => {
  it('shows the 404 page, with the layout header, for a URL that matches no route', async () => {
    renderWithProviders(null, { routes, initialEntries: ['/does-not-exist'] });

    expect(await screen.findByText(NOT_FOUND_MESSAGE)).toBeInTheDocument();

    const headerLink = screen.getByRole('link', { name: APP_TITLE });
    expect(headerLink).toHaveAttribute('href', '/');
  });
});
