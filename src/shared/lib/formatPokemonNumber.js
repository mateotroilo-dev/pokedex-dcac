import { POKEMON_NUMBER_DIGITS } from 'src/shared/lib/constants/pokemon.js';

export const formatPokemonNumber = (id) => `#${String(id).padStart(POKEMON_NUMBER_DIGITS, '0')}`;
