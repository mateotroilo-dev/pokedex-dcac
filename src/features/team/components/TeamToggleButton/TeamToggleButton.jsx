import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/shared/ui/Button/Button.jsx';
import { useToast } from 'src/shared/hooks/useToast.js';
import {
  addToTeam,
  removeFromTeam,
  selectIsInTeam,
  selectIsTeamFull,
} from 'src/features/team/teamSlice.js';
import {
  ADD_TO_TEAM_LABEL,
  getAddedToTeamToastMessage,
  getRemovedFromTeamToastMessage,
  REMOVE_FROM_TEAM_LABEL,
  TEAM_FULL_TOAST_MESSAGE,
} from 'src/features/team/components/TeamToggleButton/TeamToggleButton.constants.js';

const TeamToggleButton = ({ pokemon }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const isInTeam = useSelector((state) => selectIsInTeam(state, pokemon.id));
  const isTeamFull = useSelector(selectIsTeamFull);

  const handleClick = () => {
    if (isInTeam) {
      dispatch(removeFromTeam(pokemon.id));
      showToast(getRemovedFromTeamToastMessage(pokemon.name));
      return;
    }

    if (isTeamFull) {
      showToast(TEAM_FULL_TOAST_MESSAGE, 'warning');
      return;
    }

    dispatch(addToTeam(pokemon.id));
    showToast(getAddedToTeamToastMessage(pokemon.name));
  };

  // No se deshabilita con el equipo lleno: un boton disabled no dispara click, y el toast del
  // limite -el unico lugar que explica la regla de los 6- no aparecería nunca.
  return (
    <Button onClick={handleClick}>{isInTeam ? REMOVE_FROM_TEAM_LABEL : ADD_TO_TEAM_LABEL}</Button>
  );
};

export default TeamToggleButton;
