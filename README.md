# pokedex-dcac

Challenge técnico de De Campo a Campo: una Pokedex construida sobre [PokeAPI](https://pokeapi.co/).

> **Estado actual:** el repositorio tiene el piso de tooling armado (build, linting, formato y hook de
> pre-commit). Todavía no hay funcionalidad de producto. Este README describe únicamente lo que ya
> existe en el código; se amplía a medida que cada parte se implementa.

## Instalación y ejecución

Requiere **Node.js >= 20** (hay un `.nvmrc` con la versión).

```bash
npm install
npm run dev
```

| Script                 | Qué hace                                                 |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo de Vite con HMR                   |
| `npm run build`        | Build de producción en `dist/`                           |
| `npm run preview`      | Sirve el build de producción para verificarlo localmente |
| `npm run lint`         | ESLint sobre todo el repo, sin tolerar warnings          |
| `npm run format`       | Aplica Prettier                                          |
| `npm run format:check` | Verifica el formato sin escribir                         |

No hay script `test` todavía: se agrega junto con el harness de testing, para no dejar un comando que
no corre nada.

## Decisiones técnicas

### El tooling va antes que la primera línea de producto

Instalar linter, formateador y hook de pre-commit una vez que ya hay código escrito cuesta un
reformateo masivo que esconde los cambios reales en el diff, un lint que arranca en rojo y refactors
forzados solo para lograr que pase el primer commit. Hacerlo primero cuesta una sesión y nada más.
Por eso el primer entregable del repo no es una pantalla: es el piso.

### Las versiones están topeadas por peer dependencies, no por preferencia

El challenge fija React 18 y Vite 5. Eso arrastra techos concretos en el resto de las dependencias, y
cada uno se verificó contra npm en vez de asumirse:

| Paquete                | Versión | Por qué no la última                                            |
| ---------------------- | ------- | --------------------------------------------------------------- |
| `@vitejs/plugin-react` | 5.2     | Es la última que todavía acepta `vite ^5`; la 6.x exige Vite 8. |
| `eslint`               | 9       | `eslint-plugin-react` topea en `^9.7` y `jsx-a11y` en `^9`.     |

ESLint 8 está EOL, así que ESLint 9 no es una elección cómoda sino el único punto donde React 18,
Vite 5 y los plugins conviven.

### Imports absolutos desde `src/`, sostenidos por una regla de lint

El alias `src/` está declarado en los tres lugares que hacen falta: `vite.config.js` (para que el
build resuelva), `jsconfig.json` (para que el editor autocomplete) y `eslint.config.js`, donde
`no-restricted-imports` prohíbe los patrones relativos (`./`, `../`) dentro de `src/`.

La regla de lint es la parte importante. Una convención de imports sin nada que la verifique se
degrada sola en cuanto alguien tiene apuro; con la regla, mover un archivo de carpeta no rompe sus
imports y el diff no se llena de ajustes de `../../`.

### Accesibilidad desde el primer día

`eslint-plugin-jsx-a11y` entra en la configuración inicial, no más adelante. Los componentes de UI de
este proyecto se escriben a mano, y sin esta regla no habría ninguna red que avise sobre un `img` sin
`alt`, un `div` con `onClick` sin equivalente de teclado, o un control custom sin rol. Agregarla una
vez que la UI ya está escrita significa arreglar decenas de errores de una; agregarla ahora significa
no cometerlos.

### `eslint-config-prettier` va último en el array

Su único trabajo es apagar las reglas de ESLint que pelean con Prettier. Flat config resuelve por
orden: cualquier configuración que lo siga en el array vuelve a encender lo que él apagó. La posición
no es estética.

### El repositorio muestra el producto, no el proceso

Los archivos del flujo de trabajo con IA (`CLAUDE.md`, `.claude/`, `plans/`, `reviews/`) están en el
`.gitignore`. Las decisiones técnicas que valen se cuentan acá, que es donde se buscan.

### Cache y persistencia

Sin implementar todavía. Es la decisión que el challenge pide documentar con más detalle, y se
documenta en esta sección cuando exista el código que la respalde; describir acá una estrategia que
todavía no está escrita solo genera un documento que hay que auditar línea por línea cada vez que se
toca.

## Mejoras futuras identificadas

- **Harness de testing** (Vitest + Testing Library + MSW). El challenge lo marca como bonus, así que
  el piso se armó sin él: no hay bloque `test` en `vite.config.js` ni script `test` en el
  `package.json`. Ambos entran juntos, con los primeros tests.
- **Integración continua y deploy.** Falta el workflow de GitHub Actions que corra lint y build en
  cada push, y el deploy de la demo.
- **Contratos de props.** `react/prop-types` está apagado y no hay reemplazo (ni PropTypes ni JSDoc).
  Es sostenible con componentes chicos; cuando alguno crezca, nada va a avisar si una prop cambia de
  forma. La señal para revisar la decisión es la primera vez que haya que leer el componente entero
  para saber qué recibe.
- **Validación de imports absolutos.** `no-restricted-imports` prohíbe los relativos, pero no
  comprueba que el import absoluto apunte a un archivo que existe: un typo falla en runtime, no en
  lint. Cerrarlo requiere `eslint-plugin-import` con un resolver de alias. Por ahora lo tapa
  parcialmente el `build`, que sí falla ante un import roto que esté en el árbol de módulos.
- **Advisory de esbuild vía Vite 5.** `npm audit` reporta la vulnerabilidad del dev server de esbuild
  (GHSA-67mh-4wv8-2f99). El fix es Vite 8, que rompe la restricción de stack del challenge. Solo
  afecta al servidor de desarrollo, no al build de producción, y se resuelve cuando se pueda subir de
  major.
