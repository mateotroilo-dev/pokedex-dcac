import { useEffect } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PokemonSearchField from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.jsx';
import {
  CLEAR_SEARCH_LABEL,
  SEARCH_LABEL,
} from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.constants.js';
import { SEARCH_PARAM } from 'src/features/filters/constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const ExternalNavButton = ({ to }) => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(to)}>
      navigate externally
    </button>
  );
};

const SearchParamSpy = ({ onChange }) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    onChange(searchParams.get(SEARCH_PARAM));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
};

describe('PokemonSearchField', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('writes the URL once, after the debounce, not on every keystroke', () => {
    vi.useFakeTimers();
    const paramChanges = [];

    renderWithProviders(
      <>
        <PokemonSearchField />
        <SearchParamSpy onChange={(value) => paramChanges.push(value)} />
      </>,
    );

    const input = screen.getByLabelText(SEARCH_LABEL);
    fireEvent.change(input, { target: { value: 'p' } });
    fireEvent.change(input, { target: { value: 'pi' } });
    fireEvent.change(input, { target: { value: 'pik' } });
    fireEvent.change(input, { target: { value: 'pika' } });

    expect(paramChanges).toEqual([null]);

    act(() => vi.advanceTimersByTime(299));
    expect(paramChanges).toEqual([null]);

    act(() => vi.advanceTimersByTime(1));
    expect(paramChanges).toEqual([null, 'pika']);
  });

  it('clears the field and the URL immediately when the clear button is pressed', async () => {
    const user = userEvent.setup();

    renderWithProviders(<PokemonSearchField />, { initialEntries: [`/?${SEARCH_PARAM}=pikachu`] });

    const input = screen.getByLabelText(SEARCH_LABEL);
    expect(input).toHaveValue('pikachu');

    await user.click(screen.getByRole('button', { name: CLEAR_SEARCH_LABEL }));

    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: CLEAR_SEARCH_LABEL })).not.toBeInTheDocument();
  });

  it('reflects an external change of the URL param in the input', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <PokemonSearchField />
        <ExternalNavButton to={`/?${SEARCH_PARAM}=charmander`} />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'navigate externally' }));

    expect(screen.getByLabelText(SEARCH_LABEL)).toHaveValue('charmander');
  });
});
