import { Surface } from 'src/shared/ui/Card/Card.styles.js';

const Card = ({ minHeight, children }) => <Surface $minHeight={minHeight}>{children}</Surface>;

export default Card;
