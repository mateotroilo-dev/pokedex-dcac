import { useEffect } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PokemonSearchField from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.jsx';
import {
  CLEAR_SEARCH_LABEL,
  SEARCH_LABEL,
} from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.constants.js';
import {
  GENERATION_PARAM,
  SEARCH_DEBOUNCE_MS,
  SEARCH_PARAM,
  TYPE_PARAM,
} from 'src/features/filters/constants.js';
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

// El string entero de la URL, para probar que el buscador no pisa una entrada que escribio otra
// cosa (un select) ni la que ya estaba puesta al montar: los dos casos que reporto el bug.
const FullSearchSpy = ({ onChange }) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    onChange(searchParams.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
};

// Simula lo que hacen PokemonTypeSelect / PokemonGenerationSelect: suma un param a los que ya
// estan puestos y siempre empuja una entrada nueva.
const ExternalPushButton = ({ param, value, label }) => {
  const [, setSearchParams] = useSearchParams();
  return (
    <button
      type="button"
      onClick={() =>
        setSearchParams(
          (previousParams) => {
            const nextParams = new URLSearchParams(previousParams);
            nextParams.set(param, value);
            return nextParams;
          },
          { replace: false },
        )
      }
    >
      {label}
    </button>
  );
};

const GoBackButton = () => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      go back
    </button>
  );
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

  it('pushes a new entry for the first term written, instead of replacing the entry it mounted on', () => {
    vi.useFakeTimers();
    const searchChanges = [];

    renderWithProviders(
      <>
        <PokemonSearchField />
        <FullSearchSpy onChange={(value) => searchChanges.push(value)} />
        <GoBackButton />
      </>,
    );

    const input = screen.getByLabelText(SEARCH_LABEL);
    fireEvent.change(input, { target: { value: 'pika' } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    expect(searchChanges.at(-1)).toBe('q=pika');

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    expect(searchChanges.at(-1)).toBe('');
  });

  it('collapses consecutive debounce firings of the same typing session into one entry', () => {
    vi.useFakeTimers();
    const searchChanges = [];

    renderWithProviders(
      <>
        <PokemonSearchField />
        <FullSearchSpy onChange={(value) => searchChanges.push(value)} />
        <GoBackButton />
      </>,
    );

    const input = screen.getByLabelText(SEARCH_LABEL);
    fireEvent.change(input, { target: { value: 'p' } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    fireEvent.change(input, { target: { value: 'pi' } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    fireEvent.change(input, { target: { value: 'pika' } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    expect(searchChanges.at(-1)).toBe('q=pika');

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    expect(searchChanges.at(-1)).toBe('');
  });

  it('pushes its own entry instead of replacing one written by something else, like a select', () => {
    vi.useFakeTimers();
    const searchChanges = [];

    renderWithProviders(
      <>
        <ExternalPushButton param={TYPE_PARAM} value="grass" label="pick type" />
        <PokemonSearchField />
        <FullSearchSpy onChange={(value) => searchChanges.push(value)} />
        <GoBackButton />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'pick type' }));
    expect(searchChanges.at(-1)).toBe('type=grass');

    const input = screen.getByLabelText(SEARCH_LABEL);
    fireEvent.change(input, { target: { value: 'pika' } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    expect(searchChanges.at(-1)).toBe('type=grass&q=pika');

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    expect(searchChanges.at(-1)).toBe('type=grass');
  });

  it('undoes a select, a term and another select one entry at a time with the back button', () => {
    vi.useFakeTimers();
    const searchChanges = [];

    renderWithProviders(
      <>
        <ExternalPushButton param={TYPE_PARAM} value="grass" label="pick type" />
        <PokemonSearchField />
        <ExternalPushButton param={GENERATION_PARAM} value="1" label="pick generation" />
        <FullSearchSpy onChange={(value) => searchChanges.push(value)} />
        <GoBackButton />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'pick type' }));

    const input = screen.getByLabelText(SEARCH_LABEL);
    fireEvent.change(input, { target: { value: 'pika' } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));

    fireEvent.click(screen.getByRole('button', { name: 'pick generation' }));
    expect(searchChanges.at(-1)).toBe('type=grass&q=pika&gen=1');

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    expect(searchChanges.at(-1)).toBe('type=grass&q=pika');

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    expect(searchChanges.at(-1)).toBe('type=grass');

    fireEvent.click(screen.getByRole('button', { name: 'go back' }));
    expect(searchChanges.at(-1)).toBe('');
  });
});
