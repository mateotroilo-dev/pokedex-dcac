import { useState } from 'react';
import {
  Dropdown,
  ErrorMessage,
  Field,
  Input,
  Label,
  Notice,
  Option,
} from 'src/shared/ui/SearchableSelect/SearchableSelect.styles.js';

const filterOptions = (options, query) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return options;
  return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
};

const optionDomId = (id, optionId) => `${id}-option-${optionId}`;

const SearchableSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  maxVisibleOptions,
  noResultsText,
  moreResultsText,
  disabled = false,
  error,
}) => {
  const listboxId = `${id}-listbox`;
  const errorId = `${id}-error`;
  const selectedOption = options.find((option) => option.id === value) ?? null;

  const [query, setQuery] = useState(selectedOption?.label ?? '');
  const [isOpen, setIsOpen] = useState(false);
  // Distingue abrir la lista sin tocar el texto (foco, flecha abajo) -que muestra todas las
  // opciones- de abrir tipeando -que filtra-. Sin esto, enfocar un valor ya elegido filtraria por
  // su propio label y solo se mostraria a si mismo.
  const [isTyping, setIsTyping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Un cambio de value que no vino de elegir una opcion aca adentro -URL editada a mano, boton
  // atras- tiene que reflejarse en el texto visible. Se ajusta durante el render, no en un
  // efecto: es el patron de React para derivar estado de una prop sin un render de mas.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setQuery(selectedOption?.label ?? '');
  }

  const matches = filterOptions(options, isTyping ? query : '');
  const visibleOptions = matches.slice(0, maxVisibleOptions);
  const hasMore = matches.length > maxVisibleOptions;
  const activeOption = visibleOptions[activeIndex];

  const closeAndRestore = () => {
    setIsOpen(false);
    setIsTyping(false);
    setActiveIndex(-1);
    setQuery(selectedOption?.label ?? '');
  };

  const chooseOption = (option) => {
    onChange(option.id);
    setQuery(option.label);
    setIsOpen(false);
    setIsTyping(false);
    setActiveIndex(-1);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setIsTyping(true);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((current) => Math.min(current + 1, visibleOptions.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      if (isOpen && activeOption) {
        event.preventDefault();
        chooseOption(activeOption);
      }
      return;
    }

    if (event.key === 'Escape') {
      closeAndRestore();
    }
  };

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        role="combobox"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOption ? optionDomId(id, activeOption.id) : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={closeAndRestore}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <Dropdown id={listboxId} role="listbox">
          {visibleOptions.map((option, index) => (
            <Option
              key={option.id}
              id={optionDomId(id, option.id)}
              role="option"
              aria-selected={index === activeIndex}
              $isActive={index === activeIndex}
              // preventDefault evita que el input pierda el foco antes del click, que dispararia
              // onBlur y cerraria la lista antes de que el click llegue a la opcion.
              onMouseDown={(event) => {
                event.preventDefault();
                chooseOption(option);
              }}
            >
              {option.label}
            </Option>
          ))}
          {visibleOptions.length === 0 && <Notice role="presentation">{noResultsText}</Notice>}
          {hasMore && <Notice role="presentation">{moreResultsText}</Notice>}
        </Dropdown>
      )}
      {error && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
    </Field>
  );
};

export default SearchableSelect;
