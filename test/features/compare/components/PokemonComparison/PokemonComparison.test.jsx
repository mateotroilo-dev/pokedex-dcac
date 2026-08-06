import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonComparison from 'src/features/compare/components/PokemonComparison/PokemonComparison.jsx';
import {
  COMPARISON_EMPTY_MESSAGE,
  COMPARISON_NOT_FOUND_MESSAGE,
} from 'src/features/compare/components/PokemonComparison/PokemonComparison.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;
const ivysaurResponse = { ...pokemonDetailResponse, id: 2, name: 'ivysaur' };
const SERVER_ERROR_MESSAGE = 'Server Error';

describe('PokemonComparison', () => {
  it('invites to choose when there is no selection', () => {
    renderWithProviders(<PokemonComparison idA={undefined} idB={undefined} />);

    expect(screen.getByText(COMPARISON_EMPTY_MESSAGE)).toBeInTheDocument();
  });

  it('shows a not-found message, without a retry button, for an invalid id', () => {
    // idB es valido y su query no se salta, aunque el render se resuelva antes de que llegue: hace
    // falta un handler para que MSW no la trate como no manejada.
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(ivysaurResponse)));

    renderWithProviders(<PokemonComparison idA={NaN} idB={2} />);

    expect(screen.getByText(COMPARISON_NOT_FOUND_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RETRY_LABEL })).not.toBeInTheDocument();
  });

  it('shows a not-found message for a 404 on either pokemon', async () => {
    server.use(
      http.get(DETAIL_URL, ({ params }) => {
        const id = Number(params.id);
        if (id === 1) return HttpResponse.json(pokemonDetailResponse);
        return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
      }),
    );

    renderWithProviders(<PokemonComparison idA={1} idB={2} />);

    expect(await screen.findByText(COMPARISON_NOT_FOUND_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RETRY_LABEL })).not.toBeInTheDocument();
  });

  it('offers a retry for any other failure and re-fetches both', async () => {
    const user = userEvent.setup();
    let requestCount = 0;
    server.use(
      http.get(DETAIL_URL, ({ params }) => {
        const id = Number(params.id);
        if (id === 1) {
          requestCount += 1;
          if (requestCount === 1) {
            return HttpResponse.json({ message: SERVER_ERROR_MESSAGE }, { status: 500 });
          }
          return HttpResponse.json(pokemonDetailResponse);
        }
        return HttpResponse.json(ivysaurResponse);
      }),
    );

    renderWithProviders(<PokemonComparison idA={1} idB={2} />);

    const retryButton = await screen.findByRole('button', { name: RETRY_LABEL });
    await user.click(retryButton);

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ivysaur' })).toBeInTheDocument();
  });

  it('shows both pokemon once resolved', async () => {
    server.use(
      http.get(DETAIL_URL, ({ params }) => {
        const id = Number(params.id);
        if (id === 1) return HttpResponse.json(pokemonDetailResponse);
        return HttpResponse.json(ivysaurResponse);
      }),
    );

    renderWithProviders(<PokemonComparison idA={1} idB={2} />);

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ivysaur' })).toBeInTheDocument();
  });
});
