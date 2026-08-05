import { Link, Outlet } from 'react-router-dom';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';

const AppLayout = () => (
  <>
    <AppHeader>
      <Link to={ROUTES.HOME}>{APP_TITLE}</Link>
    </AppHeader>
    <Outlet />
  </>
);

export default AppLayout;
