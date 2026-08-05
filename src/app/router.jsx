import { createBrowserRouter } from 'react-router-dom';
import PokemonListPage from 'src/pages/PokemonListPage/PokemonListPage.jsx';
import { ROUTES } from 'src/shared/lib/constants/routes.js';

export const router = createBrowserRouter([{ path: ROUTES.HOME, element: <PokemonListPage /> }]);
