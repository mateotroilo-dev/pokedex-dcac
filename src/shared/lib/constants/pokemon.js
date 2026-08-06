// Cuatro digitos porque la dex nacional llega a 1025: con tres, el numero cambia de ancho a mitad
// de la grilla.
export const POKEMON_NUMBER_DIGITS = 4;

// Ultima especie base del indice nacional (medido contra PokeAPI el 2026-08-04). De ahi para arriba
// `/pokemon` devuelve formas alternas con id >= 10001, que no son entradas de la dex.
export const MAX_NATIONAL_DEX_ID = 1025;

// PokeAPI no tiene un "traeme todo": el limit tiene que ser mayor al total o pagina. Las 1351
// entradas entran en una sola request de 93 KB.
export const INDEX_REQUEST_LIMIT = 100000;

export const POKEMON_INDEX_TAG_ID = 'INDEX';
