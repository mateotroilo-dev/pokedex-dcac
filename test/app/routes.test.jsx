import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { routes } from 'src/app/routes.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { NOT_FOUND_MESSAGE } from 'src/pages/NotFoundPage/NotFoundPage.constants.js';
import { EMPTY_TEAM_MESSAGE } from 'src/pages/TeamPage/TeamPage.constants.js';
import { SUBMIT_LABEL } from 'src/features/compare/components/CompareForm/CompareForm.constants.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { createPokemonIndexResponse } from 'test/msw/fixtures/createPokemonIndexResponse.js';
import { typeIndexResponse } from 'test/msw/fixtures/typeIndexResponse.js';
import { generationIndexResponse } from 'test/msw/fixtures/generationIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;
const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;
const TYPE_URL = `${POKEAPI_BASE_URL}type`;
const GENERATION_URL = `${POKEAPI_BASE_URL}generation`;

const detailHandler = () =>
  http.get(DETAIL_URL, ({ params }) =>
    HttpResponse.json({ ...pokemonDetailResponse, id: Number(params.id), name: 'bulbasaur' }),
  );

describe('routes', () => {
  it('shows the 404 page, with the layout header, for a URL that matches no route', async () => {
    renderWithProviders(null, { routes, initialEntries: ['/does-not-exist'] });

    expect(await screen.findByText(NOT_FOUND_MESSAGE)).toBeInTheDocument();

    const headerLink = screen.getByRole('link', { name: APP_TITLE });
    expect(headerLink).toHaveAttribute('href', '/');
  });

  it('renders the pokemon list at the home route', async () => {
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(createPokemonIndexResponse(1))),
      detailHandler(),
      http.get(TYPE_URL, () => HttpResponse.json(typeIndexResponse)),
      http.get(GENERATION_URL, () => HttpResponse.json(generationIndexResponse)),
    );

    renderWithProviders(null, { routes, initialEntries: [ROUTES.HOME] });

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
  });

  it('renders the pokemon detail at its route', async () => {
    server.use(detailHandler());

    renderWithProviders(null, { routes, initialEntries: ['/pokemon/1'] });

    // Timeout mas alto que el resto: es el unico caso que monta un componente lazy, y bajo la
    // suite completa el import() dinamico compite por CPU con los otros ~70 archivos en paralelo.
    expect(
      await screen.findByRole('heading', { name: 'bulbasaur' }, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it('renders the empty team at the team route', async () => {
    renderWithProviders(null, { routes, initialEntries: [ROUTES.TEAM] });

    expect(await screen.findByText(EMPTY_TEAM_MESSAGE)).toBeInTheDocument();
  });

  it('renders the compare form at the compare route', async () => {
    server.use(http.get(INDEX_URL, () => HttpResponse.json(createPokemonIndexResponse(1))));

    renderWithProviders(null, { routes, initialEntries: [ROUTES.COMPARE] });

    expect(await screen.findByRole('button', { name: SUBMIT_LABEL })).toBeInTheDocument();
  });
});
