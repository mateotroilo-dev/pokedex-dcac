import { fireEvent, screen } from '@testing-library/react';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import { IMAGE_FALLBACK_TEXT } from 'src/shared/ui/ProgressiveImage/ProgressiveImage.constants.js';
import { SkeletonBlock } from 'src/shared/ui/Skeleton/Skeleton.styles.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const SRC = 'https://example.test/bulbasaur.png';
const ALT = 'bulbasaur';

// Un styled stringifica a su selector de clase: es la unica forma estable de encontrar el skeleton,
// que es decorativo y no expone rol ni texto.
const findSkeleton = (container) => container.querySelector(SkeletonBlock.toString());

describe('ProgressiveImage', () => {
  it('keeps the image in the layout but transparent while it loads', () => {
    renderWithProviders(<ProgressiveImage src={SRC} alt={ALT} />);

    const image = screen.getByRole('img', { name: ALT });

    expect(image).toHaveStyle({ opacity: '0' });
    expect(image).not.toHaveStyle({ display: 'none' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('shows the skeleton placeholder on mount and drops it once the image loads', () => {
    const { container } = renderWithProviders(<ProgressiveImage src={SRC} alt={ALT} />);

    expect(findSkeleton(container)).toBeInTheDocument();

    fireEvent.load(screen.getByRole('img', { name: ALT }));

    expect(findSkeleton(container)).not.toBeInTheDocument();
  });

  it('marks the frame as busy until the image loads', () => {
    const { container } = renderWithProviders(<ProgressiveImage src={SRC} alt={ALT} />);
    const frame = container.firstChild;

    expect(frame).toHaveAttribute('aria-busy', 'true');

    fireEvent.load(screen.getByRole('img', { name: ALT }));

    expect(frame).toHaveAttribute('aria-busy', 'false');
  });

  it('reveals the image once it fires load', () => {
    renderWithProviders(<ProgressiveImage src={SRC} alt={ALT} />);

    const image = screen.getByRole('img', { name: ALT });
    fireEvent.load(image);

    expect(image).toHaveStyle({ opacity: '1' });
  });

  it('falls back to the placeholder text when the image fires error', () => {
    renderWithProviders(<ProgressiveImage src={SRC} alt={ALT} />);

    fireEvent.error(screen.getByRole('img', { name: ALT }));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText(IMAGE_FALLBACK_TEXT)).toBeInTheDocument();
  });

  it('falls back without waiting when there is no src to load', () => {
    renderWithProviders(<ProgressiveImage src={null} alt={ALT} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText(IMAGE_FALLBACK_TEXT)).toBeInTheDocument();
  });
});
