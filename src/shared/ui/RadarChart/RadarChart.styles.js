import styled from 'styled-components';
import { SERIES_FILL_OPACITY } from 'src/shared/ui/RadarChart/RadarChart.constants.js';

export const Svg = styled.svg`
  display: block;
  width: 100%;
  max-width: ${({ $size }) => $size}px;
  height: auto;
  margin: 0 auto;
  overflow: visible;
`;

export const Grid = styled.polygon`
  fill: none;
  stroke: ${({ theme }) => theme.colors.border};
  stroke-width: 1;
`;

export const AxisLine = styled.line`
  stroke: ${({ theme }) => theme.colors.border};
  stroke-width: 1;
`;

export const AxisLabel = styled.text`
  fill: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-anchor: ${({ $anchor }) => $anchor};
  dominant-baseline: ${({ $baseline }) => $baseline};
`;

export const Series = styled.polygon`
  fill: ${({ $color }) => $color};
  fill-opacity: ${SERIES_FILL_OPACITY};
  stroke: ${({ $color }) => $color};
  stroke-width: 2;
`;
