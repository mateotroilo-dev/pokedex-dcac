import '@testing-library/jest-dom/vitest';
import { server } from 'test/msw/server.js';
import { mockIntersectionObserver } from 'test/utils/mockIntersectionObserver.js';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  mockIntersectionObserver.install();
});
afterEach(() => {
  server.resetHandlers();
  mockIntersectionObserver.reset();
});
afterAll(() => server.close());
