import { HECTOGRAMS_PER_KILOGRAM } from 'src/features/pokemon-detail/constants.js';

export const formatWeight = (weightInHectograms) =>
  `${(weightInHectograms / HECTOGRAMS_PER_KILOGRAM).toFixed(1).replace('.', ',')} kg`;
