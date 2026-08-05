import { screen } from '@testing-library/react';
import { Link } from 'react-router-dom';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('AppHeader', () => {
  it('renders the plain text it receives as the heading', () => {
    renderWithProviders(<AppHeader>Pokedex DCAC</AppHeader>);

    expect(screen.getByRole('heading', { name: 'Pokedex DCAC' })).toBeInTheDocument();
  });

  it('renders a link as the heading when it receives one', () => {
    renderWithProviders(
      <AppHeader>
        <Link to="/">Pokedex DCAC</Link>
      </AppHeader>,
    );

    expect(screen.getByRole('link', { name: 'Pokedex DCAC' })).toBeInTheDocument();
  });
});
