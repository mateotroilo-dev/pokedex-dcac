import { pickReadableTextColor } from 'src/shared/lib/pickReadableTextColor.js';

const DARK_TEXT = '#1b1c1e';
const LIGHT_TEXT = '#ffffff';
const CANDIDATES = [DARK_TEXT, LIGHT_TEXT];

describe('pickReadableTextColor', () => {
  it('picks the light candidate over a dark background', () => {
    expect(pickReadableTextColor('#6f35fc', CANDIDATES)).toBe(LIGHT_TEXT);
  });

  it('picks the dark candidate over a light background', () => {
    expect(pickReadableTextColor('#f7d02c', CANDIDATES)).toBe(DARK_TEXT);
  });

  it('ignores the order of the candidates', () => {
    expect(pickReadableTextColor('#f7d02c', [LIGHT_TEXT, DARK_TEXT])).toBe(DARK_TEXT);
  });

  it('reads uppercase hex the same as lowercase', () => {
    expect(pickReadableTextColor('#F7D02C', CANDIDATES)).toBe(DARK_TEXT);
  });

  it('falls back to the first candidate when the background is not a hex color', () => {
    expect(pickReadableTextColor('rebeccapurple', CANDIDATES)).toBe(DARK_TEXT);
    expect(pickReadableTextColor(undefined, CANDIDATES)).toBe(DARK_TEXT);
  });
});
