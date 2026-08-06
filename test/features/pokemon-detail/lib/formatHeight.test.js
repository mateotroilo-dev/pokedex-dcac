import { formatHeight } from 'src/features/pokemon-detail/lib/formatHeight.js';

describe('formatHeight', () => {
  it('converts decimetres to a comma-decimal metre string', () => {
    expect(formatHeight(7)).toBe('0,7 m');
  });

  it('formats zero as a whole metre value', () => {
    expect(formatHeight(0)).toBe('0,0 m');
  });
});
