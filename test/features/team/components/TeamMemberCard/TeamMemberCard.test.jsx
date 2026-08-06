import { useState } from 'react';
import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamMemberCard from 'src/features/team/components/TeamMemberCard/TeamMemberCard.jsx';
import { TOAST_DISMISS_LABEL } from 'src/shared/ui/Toast/Toast.constants.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { server } from 'test/msw/server.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const DETAIL_URL = `${POKEAPI_BASE_URL}pokemon/:id`;

const preloadedState = { [TEAM_REDUCER_PATH]: { ids: [1] } };

const PREVIOUS_BUTTON_NAME = 'Mover a bulbasaur a la posición anterior';
const NEXT_BUTTON_NAME = 'Mover a bulbasaur a la posición siguiente';

const OrderableCard = ({ total }) => {
  const [index, setIndex] = useState(1);
  return <TeamMemberCard id={1} index={index} total={total} onMove={({ to }) => setIndex(to)} />;
};

describe('TeamMemberCard', () => {
  it('shows the sprite, number, name and types once the pokemon comes back', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    renderWithProviders(<TeamMemberCard id={1} />, { preloadedState });

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/1');
  });

  it('removes the card from the team without opening a toast', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));
    const user = userEvent.setup();

    const { store } = renderWithProviders(<TeamMemberCard id={1} />, { preloadedState });
    await screen.findByRole('heading', { name: 'bulbasaur' });

    await user.click(screen.getByRole('button', { name: 'Quitar a bulbasaur del equipo' }));

    expect(store.getState()[TEAM_REDUCER_PATH].ids).toEqual([]);
    expect(screen.queryByRole('button', { name: TOAST_DISMISS_LABEL })).not.toBeInTheDocument();
  });

  it('still draws the remove button, titled with the id, when the pokemon fails to load', async () => {
    server.use(
      http.get(DETAIL_URL, () => HttpResponse.json({ message: 'Not Found' }, { status: 404 })),
    );

    renderWithProviders(<TeamMemberCard id={9999} />, {
      preloadedState: { [TEAM_REDUCER_PATH]: { ids: [9999] } },
    });

    const removeButton = await screen.findByRole('button');
    expect(removeButton).toHaveAttribute('title', 'Quitar a 9999 del equipo');
  });

  it('does not draw order controls without an onMove handler', async () => {
    server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

    renderWithProviders(<TeamMemberCard id={1} />, { preloadedState });

    await screen.findByRole('heading', { name: 'bulbasaur' });
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  describe('order controls', () => {
    it('calls onMove with the from/to of the previous position', async () => {
      server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));
      const onMove = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<TeamMemberCard id={1} index={1} total={3} onMove={onMove} />, {
        preloadedState,
      });
      await screen.findByRole('heading', { name: 'bulbasaur' });

      await user.click(screen.getByRole('button', { name: PREVIOUS_BUTTON_NAME }));

      expect(onMove).toHaveBeenCalledWith({ from: 1, to: 0, name: 'bulbasaur' });
    });

    it('calls onMove with the from/to of the next position', async () => {
      server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));
      const onMove = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<TeamMemberCard id={1} index={1} total={3} onMove={onMove} />, {
        preloadedState,
      });
      await screen.findByRole('heading', { name: 'bulbasaur' });

      await user.click(screen.getByRole('button', { name: NEXT_BUTTON_NAME }));

      expect(onMove).toHaveBeenCalledWith({ from: 1, to: 2, name: 'bulbasaur' });
    });

    it('disables the previous button at the first position', async () => {
      server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

      renderWithProviders(<TeamMemberCard id={1} index={0} total={3} onMove={vi.fn()} />, {
        preloadedState,
      });
      await screen.findByRole('heading', { name: 'bulbasaur' });

      expect(screen.getByRole('button', { name: PREVIOUS_BUTTON_NAME })).toBeDisabled();
      expect(screen.getByRole('button', { name: NEXT_BUTTON_NAME })).toBeEnabled();
    });

    it('disables the next button at the last position', async () => {
      server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));

      renderWithProviders(<TeamMemberCard id={1} index={2} total={3} onMove={vi.fn()} />, {
        preloadedState,
      });
      await screen.findByRole('heading', { name: 'bulbasaur' });

      expect(screen.getByRole('button', { name: NEXT_BUTTON_NAME })).toBeDisabled();
      expect(screen.getByRole('button', { name: PREVIOUS_BUTTON_NAME })).toBeEnabled();
    });

    it('moves focus to the previous button when moving to the last position disables next', async () => {
      server.use(http.get(DETAIL_URL, () => HttpResponse.json(pokemonDetailResponse)));
      const user = userEvent.setup();

      renderWithProviders(<OrderableCard total={3} />, { preloadedState });
      await screen.findByRole('heading', { name: 'bulbasaur' });

      const nextButton = screen.getByRole('button', { name: NEXT_BUTTON_NAME });
      await user.click(nextButton);

      expect(nextButton).toBeDisabled();
      expect(screen.getByRole('button', { name: PREVIOUS_BUTTON_NAME })).toHaveFocus();
    });
  });
});
