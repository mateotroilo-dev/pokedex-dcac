export const PAGE_SIZE = 20;

// ~4 tandas por pagina. PokeAPI es publica y no documenta rate limit: conviene no averiguarlo.
export const MAX_CONCURRENT_DETAIL_REQUESTS = 6;

// Las comparte PokemonCard con PokemonCardSkeleton. El sprite de PokeAPI es de 96 px, asi que a
// ese tamaño no se interpola.
export const POKEMON_CARD_SPRITE_SIZE = '96px';
export const POKEMON_CARD_MIN_HEIGHT = '13rem';

// Ancho minimo de columna de la grilla: lo comparten la grilla de cards y la de skeletons.
export const POKEMON_CARD_MIN_WIDTH = '10rem';
