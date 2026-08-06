import { normalizeSearchTerm } from 'src/features/pokemon-list/lib/normalizeSearchTerm.js';

const isDigitsOnly = (term) => /^\d+$/.test(term);

const termPredicate = (term) => {
  const normalized = normalizeSearchTerm(term ?? '');
  if (!normalized) return null;

  if (isDigitsOnly(normalized)) {
    const id = Number(normalized);
    return (entry) => entry.id === id;
  }

  return (entry) => entry.name.includes(normalized);
};

// null es "criterio no aplicable" y no filtra: es como se ignora un valor de la URL que PokeAPI no
// conoce (?type=banana). Una lista vacia si filtra a cero, porque el criterio existe y no matchea.
const idsPredicate = (ids) => {
  if (!ids) return null;

  const allowedIds = new Set(ids);
  return (entry) => allowedIds.has(entry.id);
};

export const filterPokemonIndex = (index, { term, typeIds, generationIds } = {}) => {
  const predicates = [
    termPredicate(term),
    idsPredicate(typeIds),
    idsPredicate(generationIds),
  ].filter(Boolean);
  if (!predicates.length) return index;

  return index.filter((entry) => predicates.every((matches) => matches(entry)));
};
