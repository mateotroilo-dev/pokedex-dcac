import '@testing-library/jest-dom/vitest';
import { server } from 'test/msw/server.js';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
