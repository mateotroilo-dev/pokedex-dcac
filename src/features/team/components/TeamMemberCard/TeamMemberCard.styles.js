import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const RemoveButton = styled.button`
  align-self: flex-end;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const DetailLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: inherit;
  text-decoration: none;
`;

export const DexNumber = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-variant-numeric: tabular-nums;
`;

export const Name = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-transform: capitalize;
`;

export const Types = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
`;
