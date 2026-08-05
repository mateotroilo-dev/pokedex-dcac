import { HOME_LINK_LABEL } from 'src/shared/ui/HomeLink/HomeLink.constants.js';
import { StyledLink } from 'src/shared/ui/HomeLink/HomeLink.styles.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';

const HomeLink = () => <StyledLink to={ROUTES.HOME}>{HOME_LINK_LABEL}</StyledLink>;

export default HomeLink;
