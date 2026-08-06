import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'src/shared/hooks/useDebounce.js';
import { SEARCH_DEBOUNCE_MS } from 'src/features/filters/constants.js';
import { usePokemonFilters } from 'src/features/filters/hooks/usePokemonFilters.js';
import {
  CLEAR_SEARCH_LABEL,
  SEARCH_INPUT_ID,
  SEARCH_LABEL,
  SEARCH_PLACEHOLDER,
} from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.constants.js';
import {
  ClearButton,
  Field,
  Input,
  InputRow,
  Label,
} from 'src/features/filters/components/PokemonSearchField/PokemonSearchField.styles.js';

const PokemonSearchField = () => {
  const { searchTerm, setSearchTerm } = usePokemonFilters();
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedValue = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);
  // Lo ultimo que este campo escribio en la URL, para distinguir un cambio de searchTerm que es el
  // eco del propio debounce de abajo (no hay que hacer nada) de uno que vino de afuera -boton atras,
  // un link con ?q=- (ahi si hay que reflejarlo en el input). Sin esta marca, el eco del propio
  // efecto pisa lo que el usuario ya tipeo despues de que el debounce disparo.
  const lastWrittenTerm = useRef(searchTerm);

  useEffect(() => {
    lastWrittenTerm.current = debouncedValue;
    setSearchTerm(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (searchTerm === lastWrittenTerm.current) return;

    lastWrittenTerm.current = searchTerm;
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleClear = () => {
    lastWrittenTerm.current = '';
    setInputValue('');
    setSearchTerm('');
  };

  return (
    <Field>
      <Label htmlFor={SEARCH_INPUT_ID}>{SEARCH_LABEL}</Label>
      <InputRow>
        <Input
          id={SEARCH_INPUT_ID}
          // No "search": ese type dibuja su propio icono nativo de limpiar, que queda superpuesto
          // con el ClearButton de aca abajo -dos "x" una al lado de la otra-. El input ya tiene
          // aria-label del Label y el suyo propio, "search" no aporta semantica extra.
          type="text"
          placeholder={SEARCH_PLACEHOLDER}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        {inputValue && (
          <ClearButton type="button" aria-label={CLEAR_SEARCH_LABEL} onClick={handleClear}>
            ×
          </ClearButton>
        )}
      </InputRow>
    </Field>
  );
};

export default PokemonSearchField;
