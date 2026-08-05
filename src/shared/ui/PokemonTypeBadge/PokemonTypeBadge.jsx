import Badge from 'src/shared/ui/Badge/Badge.jsx';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';

// Nombra el dominio (Pokemon) pero no sabe nada mas de el: no lee store ni datos, solo un mapa de
// color. Vive en shared/ui porque lo usan dos features (pokemon-list y pokemon-detail); el contrato
// en arquitectura.md se corrige en la Tarea 10 de slice-6a para permitir este caso.
// Un tipo desconocido deja el color en undefined y Badge cae al neutro del theme.
const PokemonTypeBadge = ({ type }) => <Badge color={POKEMON_TYPE_COLORS[type]}>{type}</Badge>;

export default PokemonTypeBadge;
