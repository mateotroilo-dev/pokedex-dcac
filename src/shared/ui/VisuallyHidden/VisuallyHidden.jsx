import { Hidden } from 'src/shared/ui/VisuallyHidden/VisuallyHidden.styles.js';

const VisuallyHidden = ({ children, role }) => <Hidden role={role}>{children}</Hidden>;

export default VisuallyHidden;
