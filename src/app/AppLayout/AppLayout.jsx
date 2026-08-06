import { Link, Outlet } from 'react-router-dom';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { TEAM_NAV_LABEL } from 'src/app/AppLayout/AppLayout.constants.js';
import { TeamLink } from 'src/app/AppLayout/AppLayout.styles.js';

const AppLayout = () => (
  <>
    <AppHeader nav={<TeamLink to={ROUTES.TEAM}>{TEAM_NAV_LABEL}</TeamLink>}>
      <Link to={ROUTES.HOME}>{APP_TITLE}</Link>
    </AppHeader>
    <Outlet />
  </>
);

export default AppLayout;
