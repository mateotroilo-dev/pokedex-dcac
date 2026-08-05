import styled from 'styled-components';
import { pickReadableTextColor } from 'src/shared/lib/pickReadableTextColor.js';

const toBackgroundColor = ({ $color, theme }) => $color ?? theme.colors.border;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${toBackgroundColor};
  color: ${(props) =>
    pickReadableTextColor(toBackgroundColor(props), [
      props.theme.colors.text,
      props.theme.colors.textInverted,
    ])};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  line-height: 1;
  text-transform: capitalize;
`;
