// Una fila de cards (POKEMON_CARD_MIN_HEIGHT = 13rem) de anticipo, no mas. Una pagina de 20 cards
// mide ~900px contra un viewport de ~800px: con un margen del orden de la pantalla el sentinel entra
// en viewport en el primer paint y la pagina 2 se pide sola antes de que el usuario scrollee.
export const SENTINEL_ROOT_MARGIN = '200px';
