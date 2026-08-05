import { parseApiError } from 'src/shared/lib/parseApiError.js';
import { UNKNOWN_ERROR_MESSAGE, UNKNOWN_ERROR_STATUS } from 'src/shared/lib/constants/errors.js';

describe('parseApiError', () => {
  it('normalizes an HTTP error, taking the message from a string body', () => {
    expect(parseApiError({ status: 404, data: 'Not Found' })).toEqual({
      status: 404,
      message: 'Not Found',
    });
  });

  it('normalizes an HTTP error whose body carries its own message', () => {
    expect(parseApiError({ status: 500, data: { message: 'Internal Server Error' } })).toEqual({
      status: 500,
      message: 'Internal Server Error',
    });
  });

  it('falls back to the unknown message when the HTTP body has none', () => {
    expect(parseApiError({ status: 500, data: null })).toEqual({
      status: 500,
      message: UNKNOWN_ERROR_MESSAGE,
    });
  });

  it('normalizes a network error, keeping its string status', () => {
    expect(parseApiError({ status: 'FETCH_ERROR', error: 'TypeError: Failed to fetch' })).toEqual({
      status: 'FETCH_ERROR',
      message: 'TypeError: Failed to fetch',
    });
  });

  it('normalizes a SerializedError, which carries no status', () => {
    expect(parseApiError({ name: 'TypeError', message: 'x is not a function' })).toEqual({
      status: UNKNOWN_ERROR_STATUS,
      message: 'x is not a function',
    });
  });

  it('normalizes a missing error instead of throwing', () => {
    expect(parseApiError(undefined)).toEqual({
      status: UNKNOWN_ERROR_STATUS,
      message: UNKNOWN_ERROR_MESSAGE,
    });
  });
});
