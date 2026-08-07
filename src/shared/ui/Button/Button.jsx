import { StyledButton } from 'src/shared/ui/Button/Button.styles.js';

const Button = ({ variant = 'primary', size = 'md', background, children, ...props }) => (
  <StyledButton type="button" $variant={variant} $size={size} $background={background} {...props}>
    {children}
  </StyledButton>
);

export default Button;
