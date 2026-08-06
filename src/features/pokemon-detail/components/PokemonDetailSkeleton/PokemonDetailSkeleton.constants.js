// Cada hueco mide lo que ocupa el texto que reemplaza, ya renderizado: el numero en fontSizes.xs,
// el nombre en fontSizes.xl y la fila de badges con su padding.
export const NUMBER_PLACEHOLDER = Object.freeze({ width: '3rem', height: '1.125rem' });
export const NAME_PLACEHOLDER = Object.freeze({ width: '10rem', height: '2.25rem' });
export const TYPES_PLACEHOLDER = Object.freeze({ width: '9rem', height: '1.25rem' });

// Los cuatro sprites que puede tener una entrada. Cuantas miniaturas hay de verdad se sabe recien
// con los datos; si son menos la fila se angosta, pero el alto —que es lo que hace saltar el
// layout— no cambia.
export const THUMBNAIL_PLACEHOLDER_COUNT = 4;
