import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;
