import { http, HttpResponse } from 'msw';
import { server } from 'test/msw/server.js';
import { makeStore } from 'src/app/store.js';
import { filtersApi } from 'src/features/filters/api.js';
import { POKEAPI_BASE_URL } from 'src/shared/lib/constants/api.js';
import { typeIndexResponse } from 'test/msw/fixtures/typeIndexResponse.js';
import { generationIndexResponse } from 'test/msw/fixtures/generationIndexResponse.js';

const TYPE_URL = `${POKEAPI_BASE_URL}type`;
const GENERATION_URL = `${POKEAPI_BASE_URL}generation`;

describe('getTypes', () => {
  it('maps the response into { id, label } options, trimmed to the 18 canonical types', async () => {
    server.use(http.get(TYPE_URL, () => HttpResponse.json(typeIndexResponse)));

    const { data } = await makeStore().dispatch(filtersApi.endpoints.getTypes.initiate());

    expect(data).toHaveLength(18);
    expect(data).toContainEqual({ id: 'grass', label: 'grass' });
    expect(data.map((option) => option.id)).not.toEqual(
      expect.arrayContaining(['unknown', 'shadow', 'stellar']),
    );
  });

  it('normalizes a failing response into a status and a message', async () => {
    server.use(
      http.get(TYPE_URL, () => HttpResponse.json({ message: 'Server Error' }, { status: 500 })),
    );

    const { error } = await makeStore().dispatch(filtersApi.endpoints.getTypes.initiate());

    expect(error).toEqual({ status: 500, message: 'Server Error' });
  });
});

describe('getGenerations', () => {
  it('maps the response into { id, label } options, labeled from the id in the url', async () => {
    server.use(http.get(GENERATION_URL, () => HttpResponse.json(generationIndexResponse)));

    const { data } = await makeStore().dispatch(filtersApi.endpoints.getGenerations.initiate());

    expect(data).toHaveLength(9);
    expect(data[0]).toEqual({ id: 1, label: 'Gen 1' });
    expect(data[8]).toEqual({ id: 9, label: 'Gen 9' });
  });

  it('normalizes a failing response into a status and a message', async () => {
    server.use(
      http.get(GENERATION_URL, () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
      ),
    );

    const { error } = await makeStore().dispatch(filtersApi.endpoints.getGenerations.initiate());

    expect(error).toEqual({ status: 500, message: 'Server Error' });
  });
});
