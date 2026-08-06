// Las barras escalan contra el tope real de una base stat en los juegos, no contra el maximo del
// pokemon: asi son comparables entre pokemon, aunque casi ninguna llegue a la mitad del ancho.
export const MAX_BASE_STAT = 255;

export const STAT_LABELS = Object.freeze({
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
});
