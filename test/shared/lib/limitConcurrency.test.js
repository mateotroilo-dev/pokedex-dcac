import { limitConcurrency } from 'src/shared/lib/limitConcurrency.js';

const createDeferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
};

describe('limitConcurrency', () => {
  it('keeps the input order in the results even when tasks settle out of order', async () => {
    const deferreds = [createDeferred(), createDeferred(), createDeferred()];
    const results = limitConcurrency(
      deferreds.map((deferred) => () => deferred.promise),
      3,
    );

    deferreds[2].resolve('third');
    deferreds[0].resolve('first');
    deferreds[1].resolve('second');

    await expect(results).resolves.toEqual(['first', 'second', 'third']);
  });

  it('never runs more tasks at once than the limit', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const tasks = Array.from({ length: 10 }, () => async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await Promise.resolve();
      inFlight -= 1;
    });

    await limitConcurrency(tasks, 3);

    expect(maxInFlight).toBe(3);
  });

  it('runs every task when there are fewer than the limit', async () => {
    const tasks = [() => Promise.resolve('a'), () => Promise.resolve('b')];

    await expect(limitConcurrency(tasks, 6)).resolves.toEqual(['a', 'b']);
  });

  it('rejects as soon as a task rejects, without starting the queued ones', async () => {
    const started = [];
    const blocker = createDeferred();
    const tasks = [
      () => {
        started.push(0);
        return Promise.reject(new Error('detail failed'));
      },
      () => {
        started.push(1);
        return blocker.promise;
      },
      () => {
        started.push(2);
        return Promise.resolve();
      },
      () => {
        started.push(3);
        return Promise.resolve();
      },
    ];

    await expect(limitConcurrency(tasks, 2)).rejects.toThrow('detail failed');
    expect(started).toEqual([0, 1]);

    blocker.resolve();
    await blocker.promise;

    expect(started).toEqual([0, 1]);
  });
});
