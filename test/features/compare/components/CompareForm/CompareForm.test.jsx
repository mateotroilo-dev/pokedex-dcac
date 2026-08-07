import { useEffect } from 'react';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import CompareForm from 'src/features/compare/components/CompareForm/CompareForm.jsx';
import {
  FIELD_A_LABEL,
  FIELD_B_LABEL,
  SUBMIT_LABEL,
} from 'src/features/compare/components/CompareForm/CompareForm.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;

// No exportado por buildComparisonSchema.js: son mensajes de UI, no un contrato que otro modulo
// consuma, asi que el test lo repite en vez de pedir un export solo para si mismo.
const DUPLICATE_MESSAGE = 'Elegí dos pokémon distintos';

const LocationSearchSpy = ({ onChange }) => {
  const location = useLocation();

  useEffect(() => {
    onChange(location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return null;
};

const renderWithSearchSpy = () => {
  const searchChanges = [];

  renderWithProviders(
    <>
      <CompareForm />
      <LocationSearchSpy onChange={(search) => searchChanges.push(search)} />
    </>,
  );

  return searchChanges;
};

const chooseOption = async (user, label, query, optionName) => {
  const input = await screen.findByLabelText(label);
  await waitFor(() => expect(input).toBeEnabled());
  await user.type(input, query);
  await user.click(await screen.findByRole('option', { name: optionName }));
};

describe('CompareForm', () => {
  it('shows validation errors and does not navigate when submitted without a selection', async () => {
    const user = userEvent.setup();
    server.use(http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)));
    const searchChanges = renderWithSearchSpy();

    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    await waitFor(() => expect(searchChanges).toEqual(['']));
  });

  it('shows the duplicate error and does not navigate when the same pokemon is chosen twice', async () => {
    const user = userEvent.setup();
    server.use(http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)));
    const searchChanges = renderWithSearchSpy();

    await chooseOption(user, FIELD_A_LABEL, 'bulbasaur', '#0001 bulbasaur');
    await chooseOption(user, FIELD_B_LABEL, 'bulbasaur', '#0001 bulbasaur');
    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    expect(await screen.findAllByText(DUPLICATE_MESSAGE)).toHaveLength(2);
    await waitFor(() => expect(searchChanges).toEqual(['']));
  });

  it('writes both ids to the query string when two different pokemon are submitted', async () => {
    const user = userEvent.setup();
    server.use(http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)));
    const searchChanges = renderWithSearchSpy();

    await chooseOption(user, FIELD_A_LABEL, 'bulbasaur', '#0001 bulbasaur');
    await chooseOption(user, FIELD_B_LABEL, 'ivysaur', '#0002 ivysaur');
    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    await waitFor(() => expect(searchChanges).toEqual(['', '?a=1&b=2']));
  });
});
