import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import Badge from 'src/shared/ui/Badge/Badge.jsx';
import Card from 'src/shared/ui/Card/Card.jsx';
import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import VisuallyHidden from 'src/shared/ui/VisuallyHidden/VisuallyHidden.jsx';
import { useGetPokemonByIdQuery } from 'src/services/pokemonApi.js';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import { toPokemonDetailPath } from 'src/shared/lib/toPokemonDetailPath.js';
import { removeFromTeam } from 'src/features/team/teamSlice.js';
import {
  TEAM_MEMBER_CARD_MIN_HEIGHT,
  TEAM_MEMBER_CARD_SPRITE_SIZE,
} from 'src/features/team/constants.js';
import {
  getMoveToNextPositionLabel,
  getMoveToPreviousPositionLabel,
  getRemoveFromTeamLabel,
  getTeamPositionLabel,
} from 'src/features/team/components/TeamMemberCard/TeamMemberCard.constants.js';
import {
  DetailLink,
  DexNumber,
  Header,
  MoveButton,
  Name,
  OrderControls,
  RemoveButton,
  Types,
} from 'src/features/team/components/TeamMemberCard/TeamMemberCard.styles.js';

const TeamMemberCard = ({ id, index, total, onMove }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { data, isLoading } = useGetPokemonByIdQuery(id);
  const previousButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const lastMoveDirectionRef = useRef(null);

  const handleRemove = () => dispatch(removeFromTeam(id));

  // El boton clickeado puede quedar deshabilitado tras el movimiento (extremo de la lista), y un
  // boton deshabilitado pierde el foco hacia el body: este efecto lo redirige al hermano recien
  // habilitado, despues de que `index` refleje la nueva posicion.
  useEffect(() => {
    const direction = lastMoveDirectionRef.current;
    if (!direction) return;
    lastMoveDirectionRef.current = null;

    if (direction === 'previous' && index === 0) {
      nextButtonRef.current?.focus();
    } else if (direction === 'next' && index === total - 1) {
      previousButtonRef.current?.focus();
    }
  }, [index, total]);

  const handleMove = (direction) => {
    lastMoveDirectionRef.current = direction;
    onMove({ from: index, to: direction === 'previous' ? index - 1 : index + 1, name: data.name });
  };

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

  const hasOrderControls = typeof onMove === 'function';

  return (
    <Card minHeight={TEAM_MEMBER_CARD_MIN_HEIGHT}>
      <Header>
        <OrderControls>
          {hasOrderControls && (
            <>
              <MoveButton
                ref={previousButtonRef}
                type="button"
                onClick={() => handleMove('previous')}
                disabled={index === 0}
                title={getMoveToPreviousPositionLabel(data.name)}
                aria-label={getMoveToPreviousPositionLabel(data.name)}
              >
                «
              </MoveButton>
              <Badge color={theme.colors.accentSecondary}>{index + 1}</Badge>
              <VisuallyHidden>{getTeamPositionLabel(index + 1)}</VisuallyHidden>
              <MoveButton
                ref={nextButtonRef}
                type="button"
                onClick={() => handleMove('next')}
                disabled={index === total - 1}
                title={getMoveToNextPositionLabel(data.name)}
                aria-label={getMoveToNextPositionLabel(data.name)}
              >
                »
              </MoveButton>
            </>
          )}
        </OrderControls>
        <RemoveButton
          type="button"
          onClick={handleRemove}
          title={getRemoveFromTeamLabel(data.name)}
          aria-label={getRemoveFromTeamLabel(data.name)}
        >
          ×
        </RemoveButton>
      </Header>
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
