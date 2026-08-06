import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const TeamLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  font-weight: 600;

  &.active {
    text-decoration: underline;
  }
`;
