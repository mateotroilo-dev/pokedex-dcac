import { RouterProvider } from 'react-router-dom';
import Providers from 'src/app/providers.jsx';
import { router } from 'src/app/router.jsx';

const App = () => (
  <Providers>
    <RouterProvider router={router} />
  </Providers>
);

export default App;
