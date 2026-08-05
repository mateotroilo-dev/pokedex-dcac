import { builtinEnvironments } from 'vitest/environments';

// jsdom define su propio AbortController, pero jsdom no trae fetch: el que queda es el de Node 24
// (undici), que valida que el `signal` sea instancia de SU AbortSignal y no de otra realm. Como
// `fetchBaseQuery` siempre manda uno, sin esto toda llamada de RTK Query muere antes de salir a la
// red con "Expected signal to be an instance of AbortSignal", incluso con MSW mockeando bien.
export default {
  name: 'jsdom-with-node-abort',
  transformMode: 'web',
  async setup(global, options) {
    const nodeAbortController = global.AbortController;
    const nodeAbortSignal = global.AbortSignal;

    const jsdom = await builtinEnvironments.jsdom.setup(global, options);

    global.AbortController = nodeAbortController;
    global.AbortSignal = nodeAbortSignal;

    return jsdom;
  },
};
