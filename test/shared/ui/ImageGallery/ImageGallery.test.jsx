import { fireEvent, screen } from '@testing-library/react';
import ImageGallery from 'src/shared/ui/ImageGallery/ImageGallery.jsx';
import { IMAGE_FALLBACK_TEXT } from 'src/shared/ui/ProgressiveImage/ProgressiveImage.constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

// Las miniaturas llevan alt="": sin nombre accesible su rol pasa a "presentation", asi que
// getByRole('img') solo alcanza a la principal. Es lo que hace asserteable "una sola imagen".
const IMAGES = [
  { src: 'https://example.test/front.png', label: 'Frente' },
  { src: 'https://example.test/back.png', label: 'Espalda' },
];

describe('ImageGallery', () => {
  it('starts on the first image, with one thumbnail per entry', () => {
    renderWithProviders(<ImageGallery images={IMAGES} />);

    expect(screen.getByRole('img', { name: 'Frente' })).toHaveAttribute('src', IMAGES[0].src);
    expect(screen.getAllByRole('button')).toHaveLength(IMAGES.length);
  });

  it('swaps the main image when a thumbnail is clicked', () => {
    renderWithProviders(<ImageGallery images={IMAGES} />);

    fireEvent.click(screen.getByRole('button', { name: 'Espalda' }));

    expect(screen.getByRole('img', { name: 'Espalda' })).toHaveAttribute('src', IMAGES[1].src);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('marks the selected thumbnail as pressed and releases the previous one', () => {
    renderWithProviders(<ImageGallery images={IMAGES} />);

    const front = screen.getByRole('button', { name: 'Frente' });
    const back = screen.getByRole('button', { name: 'Espalda' });

    expect(front).toHaveAttribute('aria-pressed', 'true');
    expect(back).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(back);

    expect(front).toHaveAttribute('aria-pressed', 'false');
    expect(back).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not carry the fallback of a failed image over to the next one', () => {
    renderWithProviders(<ImageGallery images={IMAGES} />);

    fireEvent.error(screen.getByRole('img', { name: 'Frente' }));

    expect(screen.getByText(IMAGE_FALLBACK_TEXT)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Espalda' }));

    expect(screen.getByRole('img', { name: 'Espalda' })).toBeInTheDocument();
    expect(screen.queryByText(IMAGE_FALLBACK_TEXT)).not.toBeInTheDocument();
  });

  it('shows the empty frame, and no thumbnails, when it gets no images', () => {
    renderWithProviders(<ImageGallery images={[]} />);

    expect(screen.getByText(IMAGE_FALLBACK_TEXT)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
