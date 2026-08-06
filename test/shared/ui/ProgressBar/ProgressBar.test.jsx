import ProgressBar from 'src/shared/ui/ProgressBar/ProgressBar.jsx';
import { Fill } from 'src/shared/ui/ProgressBar/ProgressBar.styles.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

// Un styled stringifica a su selector de clase: es la unica forma estable de encontrar el relleno,
// que es decorativo y no expone rol ni texto.
const findFill = (container) => container.querySelector(Fill.toString());

describe('ProgressBar', () => {
  it('fills proportionally to value over max', () => {
    const { container } = renderWithProviders(<ProgressBar value={45} max={255} color="#7ac74c" />);

    expect(findFill(container)).toHaveStyle({ width: `${(45 / 255) * 100}%` });
  });

  it('clamps the fill at 100% when the value goes over the max', () => {
    const { container } = renderWithProviders(
      <ProgressBar value={300} max={255} color="#7ac74c" />,
    );

    expect(findFill(container)).toHaveStyle({ width: '100%' });
  });
});
