import { generatePath } from 'react-router-dom';
import { POKEMON_ID_PARAM, ROUTES } from 'src/shared/lib/constants/routes.js';

export const toPokemonDetailPath = (id) =>
  generatePath(ROUTES.POKEMON_DETAIL, { [POKEMON_ID_PARAM]: id });
