# pokedex-dcac

[![CI](https://github.com/mateotroilo-dev/pokedex-dcac/actions/workflows/ci.yml/badge.svg)](https://github.com/mateotroilo-dev/pokedex-dcac/actions/workflows/ci.yml)

**Demo:** https://pokedex-dcac.vercel.app/

Challenge técnico de De Campo a Campo: una Pokedex construida sobre [PokeAPI](https://pokeapi.co/).

> **Estado actual:** están el piso de tooling (build, linting, formato, pre-commit), el harness de
> testing, la capa de datos (endpoints contra PokeAPI, cache y persistencia), **la primera
> pantalla** —el listado muestra la página inicial de pokémon con su sprite, número, nombre y tipos,
> con skeletons mientras carga, scroll infinito que sigue trayendo páginas al llegar al fondo, un
> botón de reintentar si una request falla, y un buscador por nombre o número más selects de tipo y
> generación, combinables entre sí y con la búsqueda, que filtran la dex completa sin perder la
> posición en el historial—, **el detalle** —`/pokemon/:id` abre desde
> cualquier card del listado sin volver a pedir nada, y por URL directa muestra una galería con los
> sprites que la entrada tenga (ilustración oficial, frente, espalda y variocolor), elegibles desde
> una tira de miniaturas, más número, nombre y tipos, las seis stats base con una barra cada una, la
> suma total, altura, peso y habilidades, con su propio skeleton y una distinción entre "no existe"
> (sin reintento) y un fallo cualquiera (con reintento)—, la **red de CI y deploy**: workflow de
> GitHub Actions y demo desplegada en Vercel, el **router con su chrome propio**: layout con header
> y link a home, una página para rutas inexistentes y otra para errores no manejados, y **Mi
> Equipo** —hasta 6 pokémon persistidos en `localStorage`, con un botón de agregar/quitar en el
> detalle, la ruta `/team` con su propia grilla y su estado vacío, un link en el header, y toasts
> que avisan al agregar, al quitar y al intentar un séptimo—, y **la comparación** —`/compare`, con
> su propio link en el header: un formulario con Formik + Yup y un combobox propio que filtra sobre
> las 1025 entradas del índice para elegir dos pokémon, que al enviarse quedan en la URL
> (`?a=&b=`) y se muestran enfrentados con sprite, número, nombre y tipos, un radar en SVG propio
> con las seis stats de cada uno, y una tabla accesible con esas mismas stats, el total y el
> ganador de cada fila marcado con texto además de color—, y **conexión y frescura de datos** —un
> indicador en el header que muestra si hay conexión, visible siempre, y, en el listado y el
> detalle, hace cuánto se trajo el dato que está en pantalla, si viene de `localStorage` en vez de
> la red, y un botón para refrescarlo a mano que queda deshabilitado sin conexión—. Falta el filtro
> por stats. Este README describe únicamente lo que ya existe en el código; se amplía a medida que
> cada parte se implementa.

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

## Estructura

```
src/
  main.jsx                  monta App, sin lógica
  App.jsx                   providers + router, nada más
  app/                      store, persistencia, slice de aplicación, router y providers
  services/baseApi.js       createApi sin endpoints: baseQuery, tagTypes y keepUnusedDataFor
  features/<feature>/       api.js, components/, hooks/, lib/, constants.js
  pages/<Pagina>Page/       una carpeta por ruta; el componente es delgado
  shared/
    ui/                     componentes presentacionales sin dominio
    lib/                    utilidades puras, y constants/ por tema
    styles/                 theme.js, GlobalStyle.js, pokemonTypes.js
test/                       espejo de src/, fuera del árbol de módulos del build
```

Tres reglas la sostienen:

- **Una feature nunca importa de otra.** Si dos la necesitan, la pieza sube: un componente a
  `shared/ui`, una función pura a `shared/lib`, un endpoint a `services/`. `pages/` compone features;
  ninguna feature importa de `pages/`.
- **Un componente = un archivo = una carpeta**, con su `.styles.js` al lado y el archivo llamado como
  la carpeta (`Badge/Badge.jsx`, no `index.jsx`). Los imports son explícitos y no hay barrels.
- **Lo que baja a `shared/ui` baja sin dominio.** `Badge` recibe un color y un texto; el que sabe
  traducir `'fire'` a un color es `PokemonTypeBadge`, del lado de la feature. Es la razón de que
  `Card`, `Grid`, `ProgressiveImage`, `ImageGallery` y `ProgressBar` no mencionen Pokémon en ninguna
  línea.

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

### Ningún componente elige un color de texto a mano

Los 18 tipos de Pokémon usan su paleta canónica, la que reconoce cualquiera que haya jugado. El
problema es que sobre esos 18 fondos **no hay un solo color de texto que llegue a contraste AA**:
con texto blanco pasan 6 y con texto oscuro los otros 12. Retocar la paleta hasta que funcione un
único color rompe lo que la hace reconocible.

Así que el texto lo decide el fondo. `pickReadableTextColor` calcula la luminancia relativa y el
ratio de contraste de WCAG 2.1, y devuelve el candidato del theme que más contrasta. El mapa de
tipos sigue siendo lo que dice ser —un tipo, un color— y ningún componente hardcodea un color: si
mañana entra un tema oscuro, el texto se recalcula solo.

Hay un test parametrizado sobre los 18 tipos que lee los estilos computados y verifica el 4.5:1. Es
la clase de regla que se rompe en silencio la próxima vez que alguien agregue un color.

### Los skeletons miden lo mismo que lo que reemplazan

Un skeleton más chico que su contenido real hace que la grilla salte cuando llegan los datos, y es
un defecto que ningún assert de contenido detecta. Acá la card y su skeleton comparten el cascarón
(`shared/ui/Card`), la grilla y su versión en hueco comparten el layout (`shared/ui/Grid`), y las
dimensiones salen de **una** constante que leen los dos. No son dos valores que haya que acordarse
de cambiar juntos.

El mismo criterio manda en el arranque. `PersistGate` bloquea el render hasta que redux-persist
rehidrata, así que su fallback no puede ser `null`: sería una pantalla en blanco de unos
milisegundos. Es el estado de carga de la página, armado con las mismas piezas, y `GlobalStyle`
queda montado **afuera** del gate — adentro, mientras rehidrata no existirían el reset de márgenes
ni el fondo del `body`, y al abrirse el gate todo se correría 8 px.

`ProgressiveImage` tiene un detalle que parece un error de estilo y no lo es: mientras carga, la
imagen se oculta con `opacity: 0` y queda posicionada sobre el skeleton, nunca con `display: none`.
Una imagen `loading="lazy"` que no está en el layout no la pide el navegador, así que apagarla
dejaría el skeleton animando para siempre. En jsdom esto no se ve —el evento `load` lo dispara el
test a mano—, y por eso está escrito acá.

### El deploy no vive en el workflow de CI

Vercel despliega por Git integration: mira los pushes a `main`, no el resultado del workflow de
GitHub Actions. Meter la CLI de Vercel en Actions agregaría secrets y un segundo lugar donde el build
puede fallar por motivos distintos a los del build real. La garantía de que lo que se despliega pasó
la CI no la da el deploy en sí: la da la protección de la rama —PR obligatorio y el check `verify` en
verde para poder mergear a `main`—, así que todo lo que Vercel termina desplegando ya pasó por ahí.

### El home y la página de error se cargan eager; el resto, diferido

De las cinco rutas que existen hoy, dos se bajan en el bundle inicial y tres son `lazy`. No es
inconsistencia: cada una tiene un motivo propio para quedar de un lado o del otro.

`PokemonListPage` es eager porque es la ruta de entrada: diferirla solo agrega un round-trip después
del `PersistGate`, con el chrome ya pintado y nada más que hacer mientras se espera. `ErrorPage` es
eager **a propósito**, aunque no sea la ruta de entrada: es el `errorElement` de la raíz, así que
corre en el peor momento posible —algo de la app ya falló—, y un chunk que todavía no bajó no puede
ser quien reporte que algo salió mal. La página de 404, `PokemonDetailPage`, `TeamPage` y `ComparePage` sí son
`lazy`: ninguna es la ruta de entrada, ninguna corre en un momento crítico, y el patrón que dejó
puesto la 404 es el que usa el resto de las rutas de producto.

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

**El listado siembra el cache del detalle.** `getPokemonById` vive en `services/pokemonApi.js` porque
lo consumen dos features: `pokemon-list` lo escribe y `pokemon-detail` lo lee. Cada vez que
`getPokemonPage` transforma un detalle, lo escribe también en la entrada de `getPokemonById` con
`upsertQueryData`; abrir un pokémon desde la grilla lee de ahí y no pega a la red. El costo es
duplicación: un pokémon visto en el listado y abierto en el detalle queda en dos entradas de
`localStorage` en vez de una, así que la dex entera recorrida pesa ~2 MB en vez de ~1 MB. La salida,
si algún día molesta, es normalizar el cache del listado por id — deliberadamente fuera de esta
slice.

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
`fulfilled` que un predicado marca como persistibles, y poda la tabla de tags a esas mismas
entradas. Hoy ese predicado excluye además `getPokemonPage` con un término de búsqueda: cada uno
deja hasta 20 pokémon nuevos en `localStorage`, y la cuota ya está justa solo con la dex sin filtrar.
El listado sin término y `getPokemonById` —que la propia grilla siembra— se siguen guardando
enteros.

**La invalidación por tags corre contra las dos.** PokeAPI es de solo lectura: no hay mutations, así
que nada invalida nada solo. El disparador es `baseApi.util.invalidateTags` desde la app, y funciona
igual sobre el cache de la sesión viva y sobre el que se acaba de rehidratar — por eso el transform
conserva la tabla de tags podada en vez de descartarla. Descartarla es un bug que no falla en ningún
lado: la app arranca desde cache y la invalidación deja de tener efecto, en silencio.

**Lo que nunca se persiste**: el momento en que la sesión se rehidrató. Es un dato de _esta_ sesión;
restaurarlo desde disco es una contradicción, y además el reconciliador de `redux-persist` corre
después del reducer, así que el valor viejo le pisaría el nuevo.

**Volver a entrar no re-pide las páginas que ya se trajeron.** `pages` y `pageParams` se persisten
juntos en la misma entrada, así que al rehidratar, `fetchNextPage` retoma desde el último offset sin
refetchear nada, y las páginas que ya estaban en cache se pintan todas de una. La contracara: la
posición de scroll no se restaura, la sesión rehidratada arranca siempre arriba, con el cache ya
pintado debajo.

### El buscador filtra el índice que ya está en cache, no pide un endpoint nuevo

PokeAPI no tiene un endpoint de búsqueda: no existe un `GET /pokemon?name=pika`. Lo único que hace
falta para encontrar "pikachu" o el `#25` es el nombre y el id de cada especie, y eso es exactamente
lo que `getPokemonIndex` ya trajo entero en una sola request (ver Cache y persistencia, arriba).
`getPokemonPage` pasa a recibir el término escrito, filtra las 1025 entradas del índice en memoria
—substring de nombre o id exacto, según si el término es numérico— y baja los detalles solo de las
que matchean, con el mismo paginado y el mismo tope de requests en vuelo que ya tenía. No hay
request nueva contra PokeAPI: la única diferencia con el listado sin filtro es qué ventana del
índice se recorta antes de pedir los detalles.

Cada término queda como su propia entrada de cache, independiente del listado sin filtro y entre sí.
La contracara es que los resultados de una búsqueda no se persisten en `localStorage`: guardar hasta
20 pokémon por término escrito llenaría la cuota de ~5 MB mucho antes que guardar solo la dex sin
filtrar, así que `pickFulfilledQueries` los deja afuera a propósito (ver Cache y persistencia).

### El filtro por tipo pide `/type`, no lee los detalles que ya están en cache

El índice que ya está en memoria (`getPokemonIndex`) solo trae id y nombre: PokeAPI no expone el
tipo en el listado, y el único lugar donde aparece es el detalle de cada pokémon. Filtrar por tipo
leyendo esos detalles exigiría tenerlos **todos** cacheados de antemano —los 1025 de la dex
nacional—, que es exactamente la llamada redundante que el resto de esta app evita a propósito (ver
Cache y persistencia, arriba). `/type/{nombre}` en cambio devuelve de una los ids de todos los
pokémon de ese tipo, así que `getIdsByType` pide esa lista una vez por tipo elegido y la interseca
contra el índice ya en memoria, con el mismo costo que ya tenía la búsqueda por nombre: ningún
detalle se baja hasta que se sabe qué página mostrar. Por el mismo motivo, `getIdsByGeneration` lee
`/generation/{id}` en vez de derivar la generación del id del pokémon: la relación id → generación
no es aritmética simple (los rangos de la dex nacional no son parejos) y PokeAPI ya la resuelve.

### Las barras de stats escalan contra 255, no contra el máximo del pokémon

`PokemonStats` le pasa a cada `PokemonStatBar` el mismo `max`: `MAX_BASE_STAT = 255`, el tope real de
una base stat en los juegos, no el mayor valor entre las seis stats de ese pokémon en particular.
Escalar contra el propio máximo haría que cualquier pokémon se vea con una barra llena así tenga 45
de HP — comparable solo contra sí mismo, no contra el resto de la dex. Contra 255 las barras son
comparables entre pokémon: el 45 de HP de Bulbasaur se ve corto de verdad, que es la información real.
El costo aceptado es que casi ninguna barra llega a la mitad del ancho.

### El slice de equipo guarda ids, no pokémon

`team` es la primera slice cuyo estado no viene de la API: es un dato del usuario, no cache. Aun así
no copia los pokémon adentro. `transformResponse` ya guarda en `localStorage`, vía RTK Query, todo lo
que la UI necesita de cada pokémon (ver Cache y persistencia); duplicarlo en el slice del equipo
repetiría esos bytes por partida doble y los dejaría congelados en el momento en que se agregaron,
sin enterarse de nada que cambie después. El slice guarda `{ ids: [] }`, y `TeamMemberCard` lee cada
pokémon del cache que `pokemon-list` o `pokemon-detail` ya sembraron con `useGetPokemonByIdQuery`,
pidiendo a la red solo los que falten. El costo es que un id sin detalle en cache —cache vencido o
limpiado— dispara requests al entrar a `/team`; es correcto, y la primera pantalla de la app que
puede cargar de a pedazos.

### El botón de agregar/quitar vive en el detalle, no en las cards del listado

`TeamToggleButton` lee el store del equipo, así que es un componente de `features/team/`: meterlo
adentro de `PokemonCard` haría que `pokemon-list` importe de `team` y rompería la regla 1 (una
feature nunca importa de otra). El detalle es una página, y las páginas son el único lugar donde el
contrato permite componer dos features. El costo aceptado es que armar un equipo completo pide abrir
cada pokémon uno por uno desde el listado; si eso resulta insufrible en el uso real, la salida es un
slot que `PokemonListPage` le pase a `PokemonGrid`, nunca un import cruzado entre features.

### La selección de la comparación vive en la URL, no en un slice

`/compare?a=25&b=6` sigue la misma regla que ya rige los filtros del listado: lo que el usuario
eligió para ver una pantalla es estado de navegación, no estado de aplicación. Guardarlo en un slice
—o en `useState`— lo perdería al recargar y lo haría imposible de compartir por link; guardarlo en la
URL hace que compartir la comparación sea copiar la barra de direcciones, y que el botón atrás
deshaga una elección como deshace cualquier otra navegación. `useComparisonSelection` solo lee y
escribe esos dos parámetros.

### El combobox de la comparación se escribió a mano, no con el `<select>` nativo de los filtros

Los filtros del listado usan `<select>` porque eligen entre un puñado de tipos o generaciones —18 y
menos de 10 opciones—, donde el control nativo alcanza. Elegir un pokémon entre 1025 es un problema
distinto: hace falta poder escribir para filtrar mientras se elige, y ningún `<select>` nativo lo
hace. `SearchableSelect` es un combobox ARIA propio —input con `role="combobox"`, lista con
`role="listbox"`/`role="option"`, navegación por teclado y filtrado en memoria sobre el índice que ya
está en cache—, no una variante del `Select` de los filtros: unificarlos habría sido forzar un mismo
componente a servir a dos problemas distintos con una prop que decide cuál de los dos es.

### El radar es SVG propio, no una librería de charts

Es el único gráfico de todo el proyecto —un polígono por pokémon sobre seis ejes— y elegir una
librería de charts para eso suma una dependencia con sus propios peers contra React 18 por cuatro
operaciones de trigonometría (`RadarChart` calcula la posición de cada vértice con seno y coseno
sobre el ángulo de cada eje). Es el mismo criterio que ya se usó en la ilustración de `EmptyState`:
cero assets, cero requests, y el color sale del `theme` en vez de una paleta propia de la librería.
La tabla de stats sigue siendo la fuente de verdad accesible; el radar es un complemento visual, así
que el SVG no repite los números adentro —esa alternativa textual ya la da la tabla— y **las
barras de stats siguen escalando contra 255** por el mismo motivo de arriba: el radar usa el mismo
`max` que `PokemonStatBar`, así que la forma de dos pokémon comparados también es comparable contra
el resto de la dex, no solo entre ellos dos.

### La frescura se mide contra `hydratedAt`, no contra un TTL inventado

Un dato "fresco" no es el que tiene menos de N minutos: es el que se trajo en _esta_ sesión.
`uiSlice` ya escribía `hydratedAt` en el `REHYDRATE` desde la slice 2a sin que nadie lo leyera;
`DataFreshnessIndicator` compara el `fulfilledTimeStamp` de la query reportada contra ese valor
—anterior significa que salió de `localStorage`, no de la red— y con `hydratedAt` en `null`
(primera visita, disco vacío) todo es fresco por definición. Un TTL fijo mentiría igual de rápido
para un dato recién rehidratado que para uno recién pedido.

### La frescura viaja por contexto, no por el store

El header no sabe qué query alimenta la pantalla que se está mirando —es `/pokemon/:id` o el
listado con sus filtros— y no le corresponde adivinarlo. `FreshnessProvider` guarda lo último que
reportó la página (`fulfilledTimeStamp`, `isFetching`, tags) y `useDataFreshness` es el lado que
escribe, con un `useEffect` que limpia a `null` al desmontar: salir del detalle no puede dejar al
header anunciando la edad de un pokémon que ya no está en pantalla. No es un slice porque no es
estado de aplicación —nace y muere con la navegación—, y no es prop drilling porque el header y la
página son ramas hermanas del layout: el mismo patrón que ya usa `ToastProvider`.

### El refresco es manual, y solo invalida los tags de lo que está en pantalla

PokeAPI es de solo lectura: no hay mutation que dispare una invalidación sola, así que alguien
tiene que pedirla. Automatizarla al reconectar dispararía el refetch justo cuando la red recién
vuelve, sin que nadie lo haya pedido; el botón de `DataFreshnessIndicator` deja esa decisión —y el
gasto de red— donde se puede ver, y solo funciona con conexión (`useOnlineStatus`, sobre
`useSyncExternalStore` y los eventos `online`/`offline` de `window`). Invalida los tags que reportó
la página, no el tipo `Pokemon` entero: con el tipo completo, un click en el detalle se llevaría
puestos los `getPokemonById` que sembró la grilla y lo que alimenta `/team` y `/compare` —el cache
en disco que sostiene el offline de la app—. Acotado a la query en pantalla, lo único que se pierde
es la entrada del listado que comparte ese mismo id, que se vuelve a pedir sola la próxima vez que
aparezca.

## Mejoras futuras identificadas

- **Filtro por más de un tipo a la vez** (fuego + volador). El `<select>` nativo de un solo valor no
  sirve para eso —`<select multiple>` no es usable en este contexto—, así que hace falta un control
  multi, y además decidir si los tipos elegidos combinan en AND o en OR, que son dos features
  distintas y no una variante de la misma.
- **Contratos de props.** `react/prop-types` está apagado y no hay reemplazo (ni PropTypes ni JSDoc).
  Es sostenible con componentes chicos; cuando alguno crezca, nada va a avisar si una prop cambia de
  forma. La señal para revisar la decisión es la primera vez que haya que leer el componente entero
  para saber qué recibe.
- **Validación de imports absolutos.** `no-restricted-imports` prohíbe los relativos, pero no
  comprueba que el import absoluto apunte a un archivo que existe: un typo falla en runtime, no en
  lint. Cerrarlo requiere `eslint-plugin-import` con un resolver de alias. Por ahora lo tapa
  parcialmente el `build`, que sí falla ante un import roto que esté en el árbol de módulos.
- **Warnings de future flags de React Router.** La v6 avisa por consola sobre `v7_startTransition` y
  `v7_relativeSplatPath` en cada test que monta un router. Activarlos silencia el ruido pero adopta
  comportamiento de v7, que está fuera del stack del challenge: la decisión queda para cuando se
  pueda subir de major.
- **Advisory de esbuild vía Vite 5.** `npm audit` reporta la vulnerabilidad del dev server de esbuild
  (GHSA-67mh-4wv8-2f99). El fix es Vite 8, que rompe la restricción de stack del challenge. Solo
  afecta al servidor de desarrollo, no al build de producción, y se resuelve cuando se pueda subir de
  major.
