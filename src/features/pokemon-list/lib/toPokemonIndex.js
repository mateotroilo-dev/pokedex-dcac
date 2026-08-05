import { MAX_NATIONAL_DEX_ID } from 'src/features/pokemon-list/constants.js';

const idFromUrl = (url) => Number(url.split('/').filter(Boolean).at(-1));

export const toPokemonIndex = (results) =>
  results
    .map((result) => ({ id: idFromUrl(result.url), name: result.name }))
    .filter((entry) => entry.id <= MAX_NATIONAL_DEX_ID);
