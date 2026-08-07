import Badge from 'src/shared/ui/Badge/Badge.jsx';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';

// Un tipo desconocido deja el color en undefined y Badge cae al neutro del theme.
const PokemonTypeBadge = ({ type }) => <Badge color={POKEMON_TYPE_COLORS[type]}>{type}</Badge>;

export default PokemonTypeBadge;
