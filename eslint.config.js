import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'coverage'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
  },

  // Los archivos de config de la raiz corren en Node, no en el browser.
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  reactRefresh.configs.vite,

  {
    rules: {
      // Sin contratos de props declarados: decision tomada en el plan de la slice 0.
      'react/prop-types': 'off',
    },
  },

  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', './**', '../*', '../**'],
              message: 'Usá imports absolutos desde `src/`',
            },
          ],
        },
      ],
    },
  },

  // Ultimo a proposito: solo apaga reglas que pelean con Prettier.
  // Cualquier cosa despues de esta linea las vuelve a encender.
  prettier,
];
