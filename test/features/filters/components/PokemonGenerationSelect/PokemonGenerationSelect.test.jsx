import { useEffect } from 'react';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'react-router-dom';
import PokemonGenerationSelect from 'src/features/filters/components/PokemonGenerationSelect/PokemonGenerationSelect.jsx';
import { GENERATION_SELECT_LABEL } from 'src/features/filters/components/PokemonGenerationSelect/PokemonGenerationSelect.constants.js';
import { GENERATION_PARAM } from 'src/features/filters/constants.js';
import { useGetGenerationsQuery } from 'src/features/filters/api.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { generationIndexResponse } from 'test/msw/fixtures/generationIndexResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const GENERATION_URL = `${POKEAPI_BASE_URL}generation`;

const GenerationParamSpy = ({ onChange }) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    onChange(searchParams.get(GENERATION_PARAM));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
};

const GenerationQueryStatusSpy = ({ onChange }) => {
  const { isLoading, isError } = useGetGenerationsQuery();

  useEffect(() => {
    onChange({ isLoading, isError });
  }, [isLoading, isError, onChange]);

  return null;
};

describe('PokemonGenerationSelect', () => {
  it('choosing an option writes the param', async () => {
    const user = userEvent.setup();
    server.use(http.get(GENERATION_URL, () => HttpResponse.json(generationIndexResponse)));
    const paramChanges = [];

    renderWithProviders(
      <>
        <PokemonGenerationSelect />
        <GenerationParamSpy onChange={(value) => paramChanges.push(value)} />
      </>,
    );

    const select = await screen.findByRole('combobox', { name: GENERATION_SELECT_LABEL });
    await user.selectOptions(select, 'Gen 1');

    expect(paramChanges).toEqual([null, '1']);
  });

  it('going back to the empty option removes it', async () => {
    const user = userEvent.setup();
    server.use(http.get(GENERATION_URL, () => HttpResponse.json(generationIndexResponse)));
    const paramChanges = [];

    renderWithProviders(
      <>
        <PokemonGenerationSelect />
        <GenerationParamSpy onChange={(value) => paramChanges.push(value)} />
      </>,
      { initialEntries: [`/?${GENERATION_PARAM}=1`] },
    );

    const select = await screen.findByRole('combobox', { name: GENERATION_SELECT_LABEL });
    await user.selectOptions(select, '');

    expect(paramChanges).toEqual(['1', null]);
  });

  it('arrives already selected when the param is already in the url', async () => {
    server.use(http.get(GENERATION_URL, () => HttpResponse.json(generationIndexResponse)));

    renderWithProviders(<PokemonGenerationSelect />, {
      initialEntries: [`/?${GENERATION_PARAM}=3`],
    });

    expect(await screen.findByRole('combobox', { name: GENERATION_SELECT_LABEL })).toHaveValue('3');
  });

  it('renders no control when the generation list fails to load', async () => {
    server.use(
      http.get(GENERATION_URL, () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
      ),
    );
    const statusChanges = [];

    renderWithProviders(
      <>
        <PokemonGenerationSelect />
        <GenerationQueryStatusSpy onChange={(status) => statusChanges.push(status)} />
      </>,
    );

    await waitFor(() => expect(statusChanges.at(-1)).toEqual({ isLoading: false, isError: true }));
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
