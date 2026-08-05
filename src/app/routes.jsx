import AppLayout from 'src/app/AppLayout/AppLayout.jsx';
import ErrorPage from 'src/pages/ErrorPage/ErrorPage.jsx';
import PokemonListPage from 'src/pages/PokemonListPage/PokemonListPage.jsx';
import { ROUTES } from 'src/shared/lib/constants/routes.js';

export const routes = [
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    // Eager a proposito: si el chunk de esta pagina no baja, no queda nadie para reportarlo.
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <PokemonListPage /> },
      {
        path: ROUTES.POKEMON_DETAIL,
        lazy: async () => {
          const { default: PokemonDetailPage } =
            await import('src/pages/PokemonDetailPage/PokemonDetailPage.jsx');
          return { Component: PokemonDetailPage };
        },
      },
      {
        path: ROUTES.NOT_FOUND,
        lazy: async () => {
          const { default: NotFoundPage } = await import('src/pages/NotFoundPage/NotFoundPage.jsx');
          return { Component: NotFoundPage };
        },
      },
    ],
  },
];
