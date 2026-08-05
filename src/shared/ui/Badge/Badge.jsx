import { Pill } from 'src/shared/ui/Badge/Badge.styles.js';

const Badge = ({ color, children }) => <Pill $color={color}>{children}</Pill>;

export default Badge;
