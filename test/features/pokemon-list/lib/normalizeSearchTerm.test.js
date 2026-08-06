import { normalizeSearchTerm } from 'src/features/pokemon-list/lib/normalizeSearchTerm.js';

describe('normalizeSearchTerm', () => {
  it('lowercases and trims edge spaces', () => {
    expect(normalizeSearchTerm('  Pikachu  ')).toBe('pikachu');
  });

  it('converts internal punctuation to a hyphen', () => {
    expect(normalizeSearchTerm('Mr. Mime')).toBe('mr-mime');
  });

  it('keeps digits as they are', () => {
    expect(normalizeSearchTerm('0025')).toBe('0025');
  });

  it('returns an empty string for an empty term', () => {
    expect(normalizeSearchTerm('')).toBe('');
  });

  it('returns an empty string for a term that is only spaces', () => {
    expect(normalizeSearchTerm('   ')).toBe('');
  });
});
