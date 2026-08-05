import { Surface } from 'src/shared/ui/Card/Card.styles.js';

const Card = ({ as, minHeight, children, ...rest }) => (
  <Surface as={as} $minHeight={minHeight} {...rest}>
    {children}
  </Surface>
);

export default Card;
