import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';

// Dos series del mismo color no distinguen nada, en el radar ni en las barras de la tabla: si los
// dos pokemon comparten tipo primario, el segundo cae al color de acento en vez de repetir el color
// de tipo del primero. Toma el fallback por parametro (no lee el theme) para seguir siendo pura.
export const resolveComparisonColors = (pokemonA, pokemonB, fallbackColor) => {
  const colorA = POKEMON_TYPE_COLORS[pokemonA.types[0]];
  const rawColorB = POKEMON_TYPE_COLORS[pokemonB.types[0]];
  const colorB = rawColorB === colorA ? fallbackColor : rawColorB;
  return { colorA, colorB };
};
