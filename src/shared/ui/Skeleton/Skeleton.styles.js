import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
`;

export const SkeletonBlock = styled.div`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '100%'};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radii.sm};
  background-image: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.colors.border}, ${theme.colors.surface}, ${theme.colors.border})`};
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s linear infinite;
`;
