import { screen } from '@testing-library/react';
import App from 'src/App.jsx';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('App', () => {
  it('renders the app heading inside the providers', () => {
    renderWithProviders(<App />);

    expect(screen.getByRole('heading', { name: 'Pokedex DCAC' })).toBeInTheDocument();
  });
});
