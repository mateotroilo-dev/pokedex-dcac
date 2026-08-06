import { StyledButton } from 'src/shared/ui/Button/Button.styles.js';

const Button = ({ variant = 'primary', children, ...props }) => (
  <StyledButton type="button" $variant={variant} {...props}>
    {children}
  </StyledButton>
);

export default Button;
