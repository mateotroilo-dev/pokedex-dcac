export const limitConcurrency = async (tasks, limit) => {
  const results = new Array(tasks.length);
  let nextIndex = 0;
  let rejected = false;

  const runWorker = async () => {
    while (nextIndex < tasks.length) {
      if (rejected) return;

      const index = nextIndex;
      nextIndex += 1;

      try {
        results[index] = await tasks[index]();
      } catch (error) {
        // Las que ya estan en vuelo terminan solas: cancelarlas necesita un AbortController por
        // tarea y no ahorra nada, la respuesta ya viene en camino.
        rejected = true;
        throw error;
      }
    }
  };

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, runWorker);
  await Promise.all(workers);

  return results;
};
