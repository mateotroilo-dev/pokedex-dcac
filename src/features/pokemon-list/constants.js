export const PAGE_SIZE = 20;

// ~4 tandas por pagina. PokeAPI es publica y no documenta rate limit: conviene no averiguarlo.
export const MAX_CONCURRENT_DETAIL_REQUESTS = 6;

// Ultima especie base del indice nacional (medido contra PokeAPI el 2026-08-04). De ahi para arriba
// `/pokemon` devuelve formas alternas con id >= 10001, que no son entradas de la dex.
export const MAX_NATIONAL_DEX_ID = 1025;

// PokeAPI no tiene un "traeme todo": el limit tiene que ser mayor al total o pagina. Las 1351
// entradas entran en una sola request de 93 KB.
export const INDEX_REQUEST_LIMIT = 100000;

export const POKEMON_INDEX_TAG_ID = 'INDEX';

// Las comparte PokemonCard con PokemonCardSkeleton: si las dos no miden igual, la grilla salta
// cuando llegan los datos. El sprite de PokeAPI es de 96 px, asi que a ese tamaño no se interpola.
export const POKEMON_CARD_SPRITE_SIZE = '96px';
export const POKEMON_CARD_MIN_HEIGHT = '13rem';

// Ancho minimo de columna de la grilla: lo comparten la grilla de cards y la de skeletons.
export const POKEMON_CARD_MIN_WIDTH = '10rem';
