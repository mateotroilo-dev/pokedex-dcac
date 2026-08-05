import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonListFooter from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.jsx';
import {
  DEX_COMPLETE_MESSAGE,
  LOAD_MORE_ERROR_MESSAGE,
} from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.constants.js';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { mockIntersectionObserver } from 'test/utils/mockIntersectionObserver.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const findSentinel = (container) => container.querySelector('[role="presentation"]');

const IDLE_WITH_NEXT_PAGE = {
  hasNextPage: true,
  isFetchNextPageError: false,
  isFetchingNextPage: false,
};

describe('PokemonListFooter', () => {
  it('shows an enabled sentinel that asks for the next page once it enters the viewport', () => {
    let calls = 0;
    const { container } = renderWithProviders(
      <PokemonListFooter {...IDLE_WITH_NEXT_PAGE} onLoadMore={() => (calls += 1)} />,
    );

    const sentinel = findSentinel(container);
    expect(sentinel).toBeInTheDocument();

    mockIntersectionObserver.intersect(sentinel);

    expect(calls).toBe(1);
  });

  it('shows an inline error with a retry button when the next page failed', async () => {
    const user = userEvent.setup();
    let calls = 0;
    renderWithProviders(
      <PokemonListFooter
        {...IDLE_WITH_NEXT_PAGE}
        isFetchNextPageError
        onLoadMore={() => (calls += 1)}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(LOAD_MORE_ERROR_MESSAGE);

    await user.click(screen.getByRole('button', { name: RETRY_LABEL }));

    expect(calls).toBe(1);
  });

  it('shows the closing message when there is no next page', () => {
    renderWithProviders(
      <PokemonListFooter {...IDLE_WITH_NEXT_PAGE} hasNextPage={false} onLoadMore={() => {}} />,
    );

    expect(screen.getByText(DEX_COMPLETE_MESSAGE)).toBeInTheDocument();
  });

  it('does not ask for another page while one is already in flight', () => {
    let calls = 0;
    const { container } = renderWithProviders(
      <PokemonListFooter
        {...IDLE_WITH_NEXT_PAGE}
        isFetchingNextPage
        onLoadMore={() => (calls += 1)}
      />,
    );

    mockIntersectionObserver.intersect(findSentinel(container));

    expect(calls).toBe(0);
  });

  // El sentinel solo avisa transiciones: si quedo en pantalla cuando aterrizo la pagina, sin este
  // re-armado no hay entrada nueva que reportar y el scroll se estanca hasta que el usuario sube y
  // vuelve a bajar.
  it('asks for the next page again when a fetch ends with the sentinel still in the viewport', () => {
    let calls = 0;
    const onLoadMore = () => (calls += 1);
    const { container, rerender } = renderWithProviders(
      <PokemonListFooter {...IDLE_WITH_NEXT_PAGE} onLoadMore={onLoadMore} />,
    );

    mockIntersectionObserver.intersect(findSentinel(container));
    expect(calls).toBe(1);

    rerender(
      <PokemonListFooter {...IDLE_WITH_NEXT_PAGE} isFetchingNextPage onLoadMore={onLoadMore} />,
    );
    rerender(<PokemonListFooter {...IDLE_WITH_NEXT_PAGE} onLoadMore={onLoadMore} />);

    expect(calls).toBe(2);
  });

  it.each([
    ['there is an error', { isFetchNextPageError: true }],
    ['there is no next page', { hasNextPage: false }],
  ])('keeps the sentinel out when %s', (_description, props) => {
    let calls = 0;
    const { container } = renderWithProviders(
      <PokemonListFooter {...IDLE_WITH_NEXT_PAGE} {...props} onLoadMore={() => (calls += 1)} />,
    );

    expect(findSentinel(container)).not.toBeInTheDocument();
    expect(calls).toBe(0);
  });
});
