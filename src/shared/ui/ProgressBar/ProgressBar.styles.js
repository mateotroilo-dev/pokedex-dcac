import styled from 'styled-components';

export const Track = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const Fill = styled.div`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ $color, theme }) => $color ?? theme.colors.accent};
`;
