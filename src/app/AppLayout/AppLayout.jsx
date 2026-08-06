import { Link, Outlet } from 'react-router-dom';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { COMPARE_NAV_LABEL, TEAM_NAV_LABEL } from 'src/app/AppLayout/AppLayout.constants.js';
import { HeaderNavLink, Nav } from 'src/app/AppLayout/AppLayout.styles.js';

const AppLayout = () => (
  <>
    <AppHeader
      nav={
        <Nav>
          <HeaderNavLink to={ROUTES.TEAM}>{TEAM_NAV_LABEL}</HeaderNavLink>
          <HeaderNavLink to={ROUTES.COMPARE}>{COMPARE_NAV_LABEL}</HeaderNavLink>
        </Nav>
      }
    >
      <Link to={ROUTES.HOME}>{APP_TITLE}</Link>
    </AppHeader>
    <Outlet />
  </>
);

export default AppLayout;
