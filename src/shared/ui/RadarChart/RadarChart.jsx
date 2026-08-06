import {
  AxisLabel,
  AxisLine,
  Grid,
  Series,
  Svg,
} from 'src/shared/ui/RadarChart/RadarChart.styles.js';
import {
  AXIS_LABEL_GAP,
  CHART_PADDING,
  GRID_LEVELS,
} from 'src/shared/ui/RadarChart/RadarChart.constants.js';

const angleForAxis = (index, axisCount) => -Math.PI / 2 + (index * 2 * Math.PI) / axisCount;

const pointAt = (center, radius, angle) => ({
  x: center + radius * Math.cos(angle),
  y: center + radius * Math.sin(angle),
});

const toPointsAttribute = (points) => points.map(({ x, y }) => `${x},${y}`).join(' ');

const getAxisPoints = (center, radius, axisCount) =>
  Array.from({ length: axisCount }, (_, index) =>
    pointAt(center, radius, angleForAxis(index, axisCount)),
  );

const getSeriesPoints = (center, radius, axisCount, values, max) =>
  values.map((value, index) =>
    pointAt(center, (Math.min(value, max) / max) * radius, angleForAxis(index, axisCount)),
  );

const anchorFor = (x, center) => {
  if (Math.abs(x - center) < 1) return 'middle';
  return x > center ? 'start' : 'end';
};

const baselineFor = (y, center) => {
  if (Math.abs(y - center) < 1) return 'middle';
  return y > center ? 'hanging' : 'auto';
};

const RadarChart = ({ axes, series, max, size, ariaLabel }) => {
  const center = size / 2;
  const radius = center - CHART_PADDING;
  const axisCount = axes.length;
  const axisPoints = getAxisPoints(center, radius, axisCount);

  return (
    <Svg
      $size={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      focusable="false"
    >
      {Array.from({ length: GRID_LEVELS }, (_, index) => index + 1).map((level) => (
        <Grid
          key={level}
          points={toPointsAttribute(
            getAxisPoints(center, (radius * level) / GRID_LEVELS, axisCount),
          )}
        />
      ))}
      {axisPoints.map((point, index) => (
        <AxisLine key={axes[index]} x1={center} y1={center} x2={point.x} y2={point.y} />
      ))}
      {axisPoints.map((point, index) => {
        const labelPoint = pointAt(center, radius + AXIS_LABEL_GAP, angleForAxis(index, axisCount));
        return (
          <AxisLabel
            key={axes[index]}
            x={labelPoint.x}
            y={labelPoint.y}
            $anchor={anchorFor(labelPoint.x, center)}
            $baseline={baselineFor(labelPoint.y, center)}
          >
            {axes[index]}
          </AxisLabel>
        );
      })}
      {series.map((serie) => (
        <Series
          key={serie.label}
          points={toPointsAttribute(getSeriesPoints(center, radius, axisCount, serie.values, max))}
          $color={serie.color}
        />
      ))}
    </Svg>
  );
};

export default RadarChart;
