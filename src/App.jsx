import { RouterProvider } from 'react-router-dom';
import Providers from 'src/app/providers.jsx';
import { router } from 'src/app/router.jsx';
import { GlobalStyle } from 'src/shared/styles/GlobalStyle.js';

const App = () => (
  <Providers>
    <GlobalStyle />
    <RouterProvider router={router} />
  </Providers>
);

export default App;
