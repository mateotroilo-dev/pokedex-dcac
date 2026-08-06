import {
  FRESHNESS_DAY_MS,
  FRESHNESS_HOUR_MS,
  FRESHNESS_JUST_NOW_LABEL,
  FRESHNESS_MINUTE_MS,
  FRESHNESS_MINUTES_LABEL,
} from 'src/features/connection/constants.js';

export const formatDataAge = (fulfilledTimeStamp, now) => {
  const elapsedMs = now - fulfilledTimeStamp;

  if (elapsedMs < FRESHNESS_MINUTE_MS) return FRESHNESS_JUST_NOW_LABEL;
  if (elapsedMs < FRESHNESS_HOUR_MS) return FRESHNESS_MINUTES_LABEL;
  if (elapsedMs < FRESHNESS_DAY_MS) return `hace ${Math.floor(elapsedMs / FRESHNESS_HOUR_MS)} h`;

  return `hace ${Math.floor(elapsedMs / FRESHNESS_DAY_MS)} días`;
};
