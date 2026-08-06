import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const { term, setTerm } = usePokemonFilters();
  const [inputValue, setInputValue] = useState(term);
  const debouncedValue = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);
  const location = useLocation();
  // Lo ultimo que este campo escribio en la URL, para distinguir un cambio de term que es el eco
  // del propio debounce de abajo (no hay que hacer nada) de uno que vino de afuera -boton atras, un
  // link con ?q=- (ahi si hay que reflejarlo en el input). Sin esta marca, el eco del propio efecto
  // pisa lo que el usuario ya tipeo despues de que el debounce disparo.
  const lastWrittenTerm = useRef(term);
  // Si la entrada de historial actual la escribio este mismo campo, el proximo tecleo la reemplaza
  // -sigue siendo la misma sesion de busqueda-. Si la escribio otra cosa -un select, el boton atras,
  // la carga inicial-, el proximo tecleo tiene que abrir su propia entrada: si no, pisaria la de
  // ese select (o la entrada original antes de tipear nada) en vez de sumarse encima.
  const isOwnEntry = useRef(false);
  // Distingue, dentro del efecto de abajo, un cambio de historial que generamos nosotros mismos
  // (location.key nuevo por nuestro propio write) de uno externo.
  const justWrote = useRef(false);

  useEffect(() => {
    if (justWrote.current) {
      justWrote.current = false;
    } else {
      isOwnEntry.current = false;
    }
  }, [location.key]);

  useEffect(() => {
    lastWrittenTerm.current = debouncedValue;
    const wrote = setTerm(debouncedValue, { replace: isOwnEntry.current });
    if (wrote) {
      justWrote.current = true;
      isOwnEntry.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (term === lastWrittenTerm.current) return;

    lastWrittenTerm.current = term;
    setInputValue(term);
  }, [term]);

  const handleClear = () => {
    lastWrittenTerm.current = '';
    setInputValue('');
    const wrote = setTerm('', { replace: isOwnEntry.current });
    if (wrote) {
      justWrote.current = true;
      isOwnEntry.current = true;
    }
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
