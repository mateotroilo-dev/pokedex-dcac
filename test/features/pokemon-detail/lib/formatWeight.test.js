import { formatWeight } from 'src/features/pokemon-detail/lib/formatWeight.js';

describe('formatWeight', () => {
  it('converts hectograms to a comma-decimal kilogram string', () => {
    expect(formatWeight(69)).toBe('6,9 kg');
  });

  it('formats zero as a whole kilogram value', () => {
    expect(formatWeight(0)).toBe('0,0 kg');
  });
});
