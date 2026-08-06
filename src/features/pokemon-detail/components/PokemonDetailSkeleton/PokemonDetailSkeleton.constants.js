// Cada hueco mide lo que ocupa el texto que reemplaza, ya renderizado: el numero en fontSizes.xs,
// el nombre en fontSizes.xl y la fila de badges con su padding.
export const NUMBER_PLACEHOLDER = Object.freeze({ width: '3rem', height: '1.125rem' });
export const NAME_PLACEHOLDER = Object.freeze({ width: '10rem', height: '2.25rem' });
export const TYPES_PLACEHOLDER = Object.freeze({ width: '9rem', height: '1.25rem' });

// Los cuatro sprites que puede tener una entrada. Cuantas miniaturas hay de verdad se sabe recien
// con los datos; si son menos la fila se angosta, pero el alto —que es lo que hace saltar el
// layout— no cambia.
export const THUMBNAIL_PLACEHOLDER_COUNT = 4;

// Las seis stats base, siempre las mismas: PokemonStats no varia esa cantidad entre pokemon.
export const STAT_ROW_COUNT = 6;
export const STAT_LABEL_PLACEHOLDER = Object.freeze({ width: '4rem', height: '1rem' });
export const STAT_BAR_PLACEHOLDER = Object.freeze({ width: '100%', height: '0.5rem' });
export const STAT_VALUE_PLACEHOLDER = Object.freeze({ width: '2rem', height: '1rem' });
export const STAT_TOTAL_LABEL_PLACEHOLDER = Object.freeze({ width: '3rem', height: '1.125rem' });
export const STAT_TOTAL_VALUE_PLACEHOLDER = Object.freeze({ width: '2.5rem', height: '1.125rem' });

export const FACT_TERM_PLACEHOLDER = Object.freeze({ width: '5rem', height: '1rem' });
export const FACT_VALUE_PLACEHOLDER = Object.freeze({ width: '4rem', height: '1rem' });

// Las habilidades varian entre pokemon (una sola, o dos mas la oculta) y se saben recien con los
// datos. Dos es el caso mas comun; el hueco de una fila de mas o de menos no hace saltar el layout,
// que es lo mismo que ya acepta THUMBNAIL_PLACEHOLDER_COUNT.
export const ABILITY_PLACEHOLDER_COUNT = 2;
export const ABILITY_PLACEHOLDER = Object.freeze({ width: '6rem', height: '1rem' });
