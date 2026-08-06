import { MAX_TEAM_SIZE } from 'src/features/team/constants.js';

export const ADD_TO_TEAM_LABEL = 'Agregar al equipo';
export const REMOVE_FROM_TEAM_LABEL = 'Quitar del equipo';
export const TEAM_FULL_TOAST_MESSAGE = `Ya tenés ${MAX_TEAM_SIZE} pokémon en el equipo`;

export const getAddedToTeamToastMessage = (name) => `${name} se agregó al equipo`;
export const getRemovedFromTeamToastMessage = (name) => `${name} se quitó del equipo`;
