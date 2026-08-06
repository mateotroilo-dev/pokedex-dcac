import { MAX_NATIONAL_DEX_ID } from 'src/features/pokemon-list/constants.js';
import { idFromApiUrl } from 'src/shared/lib/idFromApiUrl.js';

export const toPokemonIndex = (results) =>
  results
    .map((result) => ({ id: idFromApiUrl(result.url), name: result.name }))
    .filter((entry) => entry.id <= MAX_NATIONAL_DEX_ID);
