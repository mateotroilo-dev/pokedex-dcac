import { RouterProvider } from 'react-router-dom';
import Providers from 'src/app/providers.jsx';
import { router } from 'src/app/router.jsx';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';

const App = () => (
  <Providers>
    {/* Entrar directo a una ruta diferida pinta este chrome mientras baja el chunk, no una
        pantalla en blanco. */}
    <RouterProvider router={router} fallbackElement={<AppHeader>{APP_TITLE}</AppHeader>} />
  </Providers>
);

export default App;
