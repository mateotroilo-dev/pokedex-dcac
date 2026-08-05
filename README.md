# pokedex-dcac

Challenge técnico de De Campo a Campo: una Pokedex construida sobre [PokeAPI](https://pokeapi.co/).

> **Estado actual:** están el piso de tooling (build, linting, formato, pre-commit), el harness de
> testing y **la capa de datos**: los endpoints contra PokeAPI, el cache y la persistencia, con
> tests. Todavía no hay interfaz — la pantalla de la lista es lo siguiente. Este README describe
> únicamente lo que ya existe en el código; se amplía a medida que cada parte se implementa.

## Instalación y ejecución

Requiere **Node.js >= 24** (hay un `.nvmrc` con la versión).

```bash
npm install
npm run dev
```

| Script                  | Qué hace                                                 |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo de Vite con HMR                   |
| `npm run build`         | Build de producción en `dist/`                           |
| `npm run preview`       | Sirve el build de producción para verificarlo localmente |
| `npm run lint`          | ESLint sobre todo el repo, sin tolerar warnings          |
| `npm run format`        | Aplica Prettier                                          |
| `npm run format:check`  | Verifica el formato sin escribir                         |
| `npm test`              | Corre la suite una vez (Vitest)                          |
| `npm run test:watch`    | Vitest en modo watch                                     |
| `npm run test:coverage` | Suite + reporte de cobertura sobre `src/`                |

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

### Los tests no le pegan a PokeAPI, y hay algo que lo garantiza

El harness es Vitest + Testing Library + MSW sobre jsdom, con los tests fuera de `src/` —en `test/`,
espejando la estructura— para que no entren al árbol de módulos del build.

MSW arranca **sin ningún handler** y con `onUnhandledRequest: 'error'`: cada test declara los suyos y
un `afterEach` los limpia. Una request que ningún handler mockea **falla el test**. Es la diferencia
entre "creemos que ningún test sale a internet" y saberlo: sin esa configuración, el día que alguien
agregue un fetch sin mockear, la suite pasa igual, más lenta y dependiendo de que PokeAPI esté arriba.

El `environment` de Vitest no es `'jsdom'` pelado sino uno propio, de quince líneas, que corre el
setup de jsdom y después le devuelve a `globalThis` el `AbortController` de Node. Motivo concreto:
jsdom define los suyos pero no trae `fetch`, así que el `fetch` que queda es el de Node 24, que
rechaza un `signal` que no sea de su propia realm. Como `fetchBaseQuery` siempre manda uno, sin ese
parche **ninguna** llamada de RTK Query llega a la red en los tests —ni siquiera a MSW— y el error
que se ve (`Expected signal to be an instance of AbortSignal`) no apunta a jsdom por ningún lado.

### Cache y persistencia

Toda la estrategia sale de cuatro números medidos contra PokeAPI, no de preferencias:

| Medición                            | Resultado                                                      |
| ----------------------------------- | -------------------------------------------------------------- |
| `GET /pokemon?limit=100000`         | 1351 entradas, 93 KB, **en una sola request**                  |
| De esas 1351                        | 1025 especies base (id 1..1025) + 326 formas alternas (≥10001) |
| `GET /pokemon/1` crudo              | **271 KB**, de los cuales **268 KB son `moves`**               |
| El mismo, recortado a lo que se usa | **759 B** → la dex entera pesa 0.98 MB en vez de 350 MB        |

**El índice se pide una sola vez.** PokeAPI no expone un endpoint que devuelva el listado con sus
detalles, así que la lista se arma en dos pasos: un `getPokemonIndex` que trae las 1351 entradas de
una y se queda con las 1025 especies base, y un `getPokemonPage` que corta una ventana de 20 sobre
ese índice y baja esos 20 detalles con un tope de 6 requests en vuelo. El id sale de la URL del
índice, así que el número de la card es el nacional real sin pedir nada extra.

**`transformResponse` no es una optimización, es lo que hace viable el cache.** Guardar la respuesta
cruda revienta la cuota de ~5 MB de `localStorage` con veinte pokémon. Se guarda solo lo que la UI
dibuja —id, nombre, alto, peso, tipos, stats, habilidades y cuatro sprites—, y el mismo transformer
sirve a la card, al detalle, a la comparación y al equipo: la request ya se pagó entera una vez, tirar
stats para volver a pedir la misma URL después sería la llamada redundante que el challenge pide
evitar.

**`keepUnusedDataFor` en 24 h.** Un pokémon no cambia. El default de RTK Query son 60 segundos, que
para datos inmutables significa volver a pedir lo mismo apenas el usuario cierra un detalle y lo abre
de nuevo.

**Tres configs de `redux-persist`, no una.** La rama de la API y la de UI se persisten por separado y
el root las excluye explícitamente. Sin esa exclusión el root las volvería a serializar adentro de
`persist:root`, crudas y sin throttle: el cache escrito dos veces, una de ellas con las
suscripciones y las queries en vuelo adentro. Separarlas además permite darle a la rama de la API un
`throttle` de 1 s que la de UI no necesita.

**El reducer de la API no se persiste tal cual.** Guarda `subscriptions` —referencias de runtime— y
queries `pending` que, restauradas, rehidratan trabadas para siempre: la pantalla queda cargando y
nada vuelve a resolver esa promesa. Un transform propio deja pasar únicamente las queries
`fulfilled`, y poda la tabla de tags a esas mismas entradas.

**La invalidación por tags corre contra las dos.** PokeAPI es de solo lectura: no hay mutations, así
que nada invalida nada solo. El disparador es `baseApi.util.invalidateTags` desde la app, y funciona
igual sobre el cache de la sesión viva y sobre el que se acaba de rehidratar — por eso el transform
conserva la tabla de tags podada en vez de descartarla. Descartarla es un bug que no falla en ningún
lado: la app arranca desde cache y la invalidación deja de tener efecto, en silencio.

**Lo que nunca se persiste**: el momento en que la sesión se rehidrató. Es un dato de _esta_ sesión;
restaurarlo desde disco es una contradicción, y además el reconciliador de `redux-persist` corre
después del reducer, así que el valor viejo le pisaría el nuevo.

## Mejoras futuras identificadas

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
