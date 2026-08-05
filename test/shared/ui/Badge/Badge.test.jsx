import { screen } from '@testing-library/react';
import Badge from 'src/shared/ui/Badge/Badge.jsx';
import { theme } from 'src/shared/styles/theme.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

describe('Badge', () => {
  it('paints itself with the color it receives', () => {
    renderWithProviders(<Badge color="#6f35fc">dragon</Badge>);

    expect(screen.getByText('dragon')).toHaveStyle({ backgroundColor: '#6f35fc' });
  });

  it('reads the text color off the background instead of hardcoding one', () => {
    renderWithProviders(
      <>
        <Badge color="#6f35fc">dark background</Badge>
        <Badge color="#f7d02c">light background</Badge>
      </>,
    );

    expect(screen.getByText('dark background')).toHaveStyle({
      color: theme.colors.textInverted,
    });
    expect(screen.getByText('light background')).toHaveStyle({ color: theme.colors.text });
  });

  it('falls back to the neutral color of the theme when it gets none', () => {
    renderWithProviders(<Badge>no color</Badge>);

    expect(screen.getByText('no color')).toHaveStyle({ backgroundColor: theme.colors.border });
  });
});
