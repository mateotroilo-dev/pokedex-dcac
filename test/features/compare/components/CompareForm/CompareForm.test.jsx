import { useEffect } from 'react';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import CompareForm from 'src/features/compare/components/CompareForm/CompareForm.jsx';
import { SUBMIT_LABEL } from 'src/features/compare/components/CompareForm/CompareForm.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const INDEX_URL = `${POKEAPI_BASE_URL}pokemon`;

const LocationSearchSpy = ({ onChange }) => {
  const location = useLocation();

  useEffect(() => {
    onChange(location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return null;
};

describe('CompareForm', () => {
  it('shows validation errors and does not navigate when submitted without a selection', async () => {
    const user = userEvent.setup();
    server.use(http.get(INDEX_URL, () => HttpResponse.json(pokemonIndexResponse)));
    const searchChanges = [];

    renderWithProviders(
      <>
        <CompareForm />
        <LocationSearchSpy onChange={(search) => searchChanges.push(search)} />
      </>,
    );

    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    await waitFor(() => expect(searchChanges).toEqual(['']));
  });
});
