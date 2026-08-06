import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ babel: { plugins: ['babel-plugin-styled-components'] } })],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      test: fileURLToPath(new URL('./test', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: './test/environment/jsdomWithNodeAbort.js',
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.test.{js,jsx}'],
    // El default de 5 s alcanza para un archivo suelto, pero con los ~37 archivos de la suite
    // corriendo en paralelo la instanciacion de cada entorno jsdom compite por CPU: hasta un test
    // sincrono sin red (PokemonSpriteGallery) puede tardar mas que eso en arrancar. 15 s da margen
    // sin ocultar un test realmente colgado.
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
    },
  },
});
