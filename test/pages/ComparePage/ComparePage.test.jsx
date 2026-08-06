import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparePage from 'src/pages/ComparePage/ComparePage.jsx';
import { ROUTES } from 'src/shared/lib/constants/routes.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import {
  FIELD_A_LABEL,
  FIELD_B_LABEL,
  SUBMIT_LABEL,
} from 'src/features/compare/components/CompareForm/CompareForm.constants.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;
const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;

const ivysaurResponse = { ...pokemonDetailResponse, id: 2, name: 'ivysaur' };

const routes = [{ path: ROUTES.COMPARE, element: <ComparePage /> }];

const chooseOption = async (user, label, query, optionName) => {
  const input = await screen.findByLabelText(label);
  await user.type(input, query);
  await user.click(await screen.findByRole('option', { name: optionName }));
};

describe('ComparePage', () => {
  it('shows both pokemon once two are chosen and submitted', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)),
      http.get(DETAIL_URL, ({ params }) => {
        const id = Number(params.id);
        if (id === 1) return HttpResponse.json(pokemonDetailResponse);
        if (id === 2) return HttpResponse.json(ivysaurResponse);
        return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
      }),
    );

    renderWithProviders(null, { routes, initialEntries: [ROUTES.COMPARE] });

    await chooseOption(user, FIELD_A_LABEL, 'bulbasaur', '#0001 bulbasaur');
    await chooseOption(user, FIELD_B_LABEL, 'ivysaur', '#0002 ivysaur');
    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ivysaur' })).toBeInTheDocument();
  });
});
