import { DECIMETRES_PER_METRE } from 'src/features/pokemon-detail/constants.js';

export const formatHeight = (heightInDecimetres) =>
  `${(heightInDecimetres / DECIMETRES_PER_METRE).toFixed(1).replace('.', ',')} m`;
