import { capitalize } from 'src/shared/lib/capitalize.js';

export const formatAbilityName = (name) => name.split('-').map(capitalize).join(' ');
