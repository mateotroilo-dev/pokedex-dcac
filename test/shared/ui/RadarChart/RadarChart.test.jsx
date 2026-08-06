import RadarChart from 'src/shared/ui/RadarChart/RadarChart.jsx';
import { Series } from 'src/shared/ui/RadarChart/RadarChart.styles.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const axes = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

const series = [
  { label: 'bulbasaur', values: [45, 49, 49, 65, 65, 45], color: '#7ac74c' },
  { label: 'charmander', values: [39, 52, 43, 60, 50, 65], color: '#ee8130' },
];

describe('RadarChart', () => {
  it('draws one polygon per series', () => {
    const { container } = renderWithProviders(
      <RadarChart
        axes={axes}
        series={series}
        max={255}
        size={200}
        ariaLabel="Comparación de stats"
      />,
    );

    expect(container.querySelectorAll(Series.toString())).toHaveLength(series.length);
  });

  it('draws each series polygon with as many vertices as axes', () => {
    const { container } = renderWithProviders(
      <RadarChart
        axes={axes}
        series={series}
        max={255}
        size={200}
        ariaLabel="Comparación de stats"
      />,
    );

    container.querySelectorAll(Series.toString()).forEach((polygon) => {
      const vertices = polygon.getAttribute('points').trim().split(' ');
      expect(vertices).toHaveLength(axes.length);
    });
  });

  it('exposes the chart as an image with a descriptive label', () => {
    const { container } = renderWithProviders(
      <RadarChart
        axes={axes}
        series={series}
        max={255}
        size={200}
        ariaLabel="Comparación de stats"
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Comparación de stats');
  });
});
