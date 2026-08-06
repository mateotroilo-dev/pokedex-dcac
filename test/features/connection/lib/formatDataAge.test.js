import { formatDataAge } from 'src/features/connection/lib/formatDataAge.js';
import {
  FRESHNESS_DAY_MS,
  FRESHNESS_HOUR_MS,
  FRESHNESS_MINUTE_MS,
} from 'src/features/connection/constants.js';

const NOW = 1_000_000_000_000;

describe('formatDataAge', () => {
  it('returns "recién" just after the fetch', () => {
    expect(formatDataAge(NOW, NOW)).toBe('recién');
  });

  it('returns "recién" right below the minute threshold', () => {
    expect(formatDataAge(NOW - (FRESHNESS_MINUTE_MS - 1), NOW)).toBe('recién');
  });

  it('returns "hace unos minutos" right at the minute threshold', () => {
    expect(formatDataAge(NOW - FRESHNESS_MINUTE_MS, NOW)).toBe('hace unos minutos');
  });

  it('returns "hace unos minutos" right below the hour threshold', () => {
    expect(formatDataAge(NOW - (FRESHNESS_HOUR_MS - 1), NOW)).toBe('hace unos minutos');
  });

  it('returns the hour count right at the hour threshold', () => {
    expect(formatDataAge(NOW - FRESHNESS_HOUR_MS, NOW)).toBe('hace 1 h');
  });

  it('returns the hour count right below the day threshold', () => {
    expect(formatDataAge(NOW - (FRESHNESS_DAY_MS - 1), NOW)).toBe('hace 23 h');
  });

  it('returns the day count right at the day threshold', () => {
    expect(formatDataAge(NOW - FRESHNESS_DAY_MS, NOW)).toBe('hace 1 días');
  });

  it('returns the day count for several days', () => {
    expect(formatDataAge(NOW - 3 * FRESHNESS_DAY_MS, NOW)).toBe('hace 3 días');
  });
});
