import { useEffect } from 'react';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'react-router-dom';
import PokemonTypeSelect from 'src/features/filters/components/PokemonTypeSelect/PokemonTypeSelect.jsx';
import { TYPE_SELECT_LABEL } from 'src/features/filters/components/PokemonTypeSelect/PokemonTypeSelect.constants.js';
import { TYPE_PARAM } from 'src/features/filters/constants.js';
import { useGetTypesQuery } from 'src/features/filters/api.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { typeIndexResponse } from 'test/msw/fixtures/typeIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const TYPE_URL = `${POKEAPI_BASE_URL}type`;

const TypeParamSpy = ({ onChange }) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    onChange(searchParams.get(TYPE_PARAM));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
};

const TypeQueryStatusSpy = ({ onChange }) => {
  const { isLoading, isError } = useGetTypesQuery();

  useEffect(() => {
    onChange({ isLoading, isError });
  }, [isLoading, isError, onChange]);

  return null;
};

describe('PokemonTypeSelect', () => {
  it('choosing an option writes the param', async () => {
    const user = userEvent.setup();
    server.use(http.get(TYPE_URL, () => HttpResponse.json(typeIndexResponse)));
    const paramChanges = [];

    renderWithProviders(
      <>
        <PokemonTypeSelect />
        <TypeParamSpy onChange={(value) => paramChanges.push(value)} />
      </>,
    );

    await user.selectOptions(
      await screen.findByRole('combobox', { name: TYPE_SELECT_LABEL }),
      'grass',
    );

    expect(paramChanges).toEqual([null, 'grass']);
  });

  it('going back to the empty option removes it', async () => {
    const user = userEvent.setup();
    server.use(http.get(TYPE_URL, () => HttpResponse.json(typeIndexResponse)));
    const paramChanges = [];

    renderWithProviders(
      <>
        <PokemonTypeSelect />
        <TypeParamSpy onChange={(value) => paramChanges.push(value)} />
      </>,
      { initialEntries: [`/?${TYPE_PARAM}=grass`] },
    );

    await user.selectOptions(await screen.findByRole('combobox', { name: TYPE_SELECT_LABEL }), '');

    expect(paramChanges).toEqual(['grass', null]);
  });

  it('arrives already selected when the param is already in the url', async () => {
    server.use(http.get(TYPE_URL, () => HttpResponse.json(typeIndexResponse)));

    renderWithProviders(<PokemonTypeSelect />, { initialEntries: [`/?${TYPE_PARAM}=water`] });

    expect(await screen.findByRole('combobox', { name: TYPE_SELECT_LABEL })).toHaveValue('water');
  });

  it('renders no control when the type list fails to load', async () => {
    server.use(
      http.get(TYPE_URL, () => HttpResponse.json({ message: 'Server Error' }, { status: 500 })),
    );
    const statusChanges = [];

    renderWithProviders(
      <>
        <PokemonTypeSelect />
        <TypeQueryStatusSpy onChange={(status) => statusChanges.push(status)} />
      </>,
    );

    await waitFor(() => expect(statusChanges.at(-1)).toEqual({ isLoading: false, isError: true }));
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
