import { buildComparisonSchema } from 'src/features/compare/lib/buildComparisonSchema.js';

const VALID_IDS = [1, 6, 25];

describe('buildComparisonSchema', () => {
  it('passes for two distinct ids that are both in the index', () => {
    const schema = buildComparisonSchema(VALID_IDS);

    expect(schema.isValidSync({ a: 6, b: 25 })).toBe(true);
  });

  it('requires both fields', () => {
    const schema = buildComparisonSchema(VALID_IDS);

    expect(schema.isValidSync({ a: undefined, b: 25 })).toBe(false);
    expect(schema.isValidSync({ a: 6, b: undefined })).toBe(false);
  });

  it('rejects an id that is not in the index', () => {
    const schema = buildComparisonSchema(VALID_IDS);

    expect(schema.isValidSync({ a: 9999, b: 25 })).toBe(false);
  });

  it('rejects a value that is not a number, like NaN from an invalid URL param', () => {
    const schema = buildComparisonSchema(VALID_IDS);

    expect(schema.isValidSync({ a: NaN, b: 25 })).toBe(false);
  });

  it('rejects the two fields being the same id', () => {
    const schema = buildComparisonSchema(VALID_IDS);

    expect(schema.isValidSync({ a: 6, b: 6 })).toBe(false);
  });
});
