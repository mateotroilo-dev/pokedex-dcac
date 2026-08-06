import { normalizeSearchTerm } from 'src/features/pokemon-list/lib/normalizeSearchTerm.js';

const isDigitsOnly = (term) => /^\d+$/.test(term);

export const filterPokemonIndex = (index, term) => {
  const normalized = normalizeSearchTerm(term ?? '');
  if (!normalized) return index;

  if (isDigitsOnly(normalized)) {
    const id = Number(normalized);
    return index.filter((entry) => entry.id === id);
  }

  return index.filter((entry) => entry.name.includes(normalized));
};
