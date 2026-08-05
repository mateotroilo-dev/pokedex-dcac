import { http, HttpResponse } from 'msw';
import { server } from 'test/msw/server.js';

const MOCKED_URL = 'https://example.test/mocked';
const UNMOCKED_URL = 'https://example.test/unmocked';

describe('MSW server', () => {
  it('intercepts a request with a handler added by the test', async () => {
    server.use(http.get(MOCKED_URL, () => HttpResponse.json({ intercepted: true })));

    const response = await fetch(MOCKED_URL);

    await expect(response.json()).resolves.toEqual({ intercepted: true });
  });

  it('fails a request that no handler mocks', async () => {
    await expect(fetch(UNMOCKED_URL)).rejects.toThrow();
  });
});
