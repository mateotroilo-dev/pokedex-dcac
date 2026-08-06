import { Link, Outlet } from 'react-router-dom';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { COMPARE_NAV_LABEL, TEAM_NAV_LABEL } from 'src/app/AppLayout/AppLayout.constants.js';
import { HeaderNavLink, Nav, StatusGroup } from 'src/app/AppLayout/AppLayout.styles.js';
import ConnectionIndicator from 'src/features/connection/components/ConnectionIndicator/ConnectionIndicator.jsx';
import DataFreshnessIndicator from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.jsx';
import FreshnessProvider from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.jsx';

// El provider envuelve header y Outlet: tiene que ser padre de la pagina que reporta la frescura
// y del header que la lee.
const AppLayout = () => (
  <FreshnessProvider>
    <AppHeader
      nav={
        <Nav>
          <HeaderNavLink to={ROUTES.TEAM}>{TEAM_NAV_LABEL}</HeaderNavLink>
          <HeaderNavLink to={ROUTES.COMPARE}>{COMPARE_NAV_LABEL}</HeaderNavLink>
        </Nav>
      }
      status={
        <StatusGroup>
          <ConnectionIndicator />
          <DataFreshnessIndicator />
        </StatusGroup>
      }
    >
      <Link to={ROUTES.HOME}>{APP_TITLE}</Link>
    </AppHeader>
    <Outlet />
  </FreshnessProvider>
);

export default AppLayout;
