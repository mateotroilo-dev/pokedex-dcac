import { useDispatch } from 'react-redux';
import Card from 'src/shared/ui/Card/Card.jsx';
import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import { useGetPokemonByIdQuery } from 'src/services/pokemonApi.js';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import { toPokemonDetailPath } from 'src/shared/lib/toPokemonDetailPath.js';
import { removeFromTeam } from 'src/features/team/teamSlice.js';
import {
  TEAM_MEMBER_CARD_MIN_HEIGHT,
  TEAM_MEMBER_CARD_SPRITE_SIZE,
} from 'src/features/team/constants.js';
import { getRemoveFromTeamLabel } from 'src/features/team/components/TeamMemberCard/TeamMemberCard.constants.js';
import {
  DetailLink,
  DexNumber,
  Name,
  RemoveButton,
  Types,
} from 'src/features/team/components/TeamMemberCard/TeamMemberCard.styles.js';

const TeamMemberCard = ({ id }) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetPokemonByIdQuery(id);

  const handleRemove = () => dispatch(removeFromTeam(id));

  if (isLoading) {
    return (
      <Card minHeight={TEAM_MEMBER_CARD_MIN_HEIGHT}>
        <Skeleton width={TEAM_MEMBER_CARD_SPRITE_SIZE} height={TEAM_MEMBER_CARD_SPRITE_SIZE} />
      </Card>
    );
  }

  // Un id invalido guardado en localStorage no puede tumbar la pagina: el boton de quitar se
  // dibuja igual, con el id como titulo, para que ese hueco siga siendo intrabable.
  if (!data) {
    return (
      <Card minHeight={TEAM_MEMBER_CARD_MIN_HEIGHT}>
        <RemoveButton
          type="button"
          onClick={handleRemove}
          title={getRemoveFromTeamLabel(id)}
          aria-label={getRemoveFromTeamLabel(id)}
        >
          ×
        </RemoveButton>
      </Card>
    );
  }

  return (
    <Card minHeight={TEAM_MEMBER_CARD_MIN_HEIGHT}>
      <RemoveButton
        type="button"
        onClick={handleRemove}
        title={getRemoveFromTeamLabel(data.name)}
        aria-label={getRemoveFromTeamLabel(data.name)}
      >
        ×
      </RemoveButton>
      <DetailLink to={toPokemonDetailPath(data.id)}>
        <ProgressiveImage
          src={data.sprites.front}
          alt=""
          width={TEAM_MEMBER_CARD_SPRITE_SIZE}
          height={TEAM_MEMBER_CARD_SPRITE_SIZE}
        />
        <DexNumber>{formatPokemonNumber(data.id)}</DexNumber>
        <Name>{data.name}</Name>
        <Types>
          {data.types.map((type) => (
            <PokemonTypeBadge key={type} type={type} />
          ))}
        </Types>
      </DetailLink>
    </Card>
  );
};

export default TeamMemberCard;
