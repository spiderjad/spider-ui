# spider-ui · Guía de uso (para personas y para Claude)

Esta guía viaja dentro del paquete: al actualizar `spider-ui`, todos los
proyectos reciben las reglas nuevas sin copiar nada.

## 1. Instalación en un proyecto

```bash
npm install github:spiderjad/spider-ui#<commit>
```
Fijar el commit (`#<sha>`) deja la versión exacta en cada instalación. Para actualizar, el mismo comando con el commit nuevo.

Importar UNA vez en el entry del frontend (por ejemplo `src/main.jsx`, `src/main.ts`, `src/renderer.js`):

```js
import 'spider-ui/spider-ui.css';
```

Sin bundler (HTML plano, renderer de Electron sin Vite):

```html
<link rel="stylesheet" href="./node_modules/spider-ui/spider-ui.css">
```

Fuente Inter: si el proyecto no la carga (apps de escritorio u offline):

```bash
npm install @fontsource-variable/inter
```
```js
import '@fontsource-variable/inter';
```

Tailwind v3: `presets: [require('spider-ui/tailwind-preset')]` en `tailwind.config.js`.
Tailwind v4: `@import "spider-ui/tailwind-v4.css";` después de `@import "tailwindcss";`.
Con eso existen `bg-spider-primary`, `text-spider-muted`, `border-spider-border`, `rounded-spider`, etc.

Para actualizar: el mismo `npm install github:spiderjad/spider-ui#<commit nuevo>`.

**Modo oscuro** (1.1.0): los tokens cambian solos con el del sistema (`prefers-color-scheme`). Para forzar uno, `data-theme="dark"` o `data-theme="light"` en `<html>`. Todo lo visual debe salir de `var(--sp-*)`: así funciona en los dos modos sin hacer nada más. Las pantallas `auth-*` se ven igual en los dos (fondo oscuro y tarjeta blanca).

Tokens nuevos en 1.1.0: `--sp-bg-muted` (hover, fondo de controles), `--sp-canvas` (zona de trabajo bajo documentos), `--sp-inverse` / `--sp-on-inverse` / `--sp-inverse-hover` (botón primario), `--sp-on-primary`, `--sp-focus` / `--sp-focus-ring`, `--sp-backdrop`, `--sp-shadow-md`, `--sp-primary-border`, `--sp-danger-text` y los `--sp-*-border` de los estados.

**Cambios en 1.2.0** (el menú, las letras y los tamaños de SpiderFolio):
- `shell.css`: el marco de la app (rail, menú lateral, cabecera, contenido y barra inferior). Ver la sección 4.
- Escala de letra `--sp-fs-*` / `--sp-lh-*` y medidas del marco (`--sp-rail-width`, `--sp-menu-width`…).
- **`.v-app` pone ahora el texto base en 14/22 px** (antes heredaba los 16 px del navegador). Al actualizar un
  proyecto, revisar los textos que no tenían tamaño propio.
- `.v-app [hidden]` oculta siempre, aunque el componente tenga su propio `display`.
- Clases de texto: `v-eyebrow`, `v-text-sm`, `v-text-muted`, `v-prose`, y `v-ocultar-movil` (menos de 640 px).

**Cambios en 1.3.0:** selector moderno (`select.js` + `v-select`), en lugar del `<select>` nativo. Ver «Selector»
en la sección 3.

**Cambios en 1.4.0** (el estilo de phpMyFlow):
- `data.css`: apps de datos (cabecera `v-appbar`, pestañas `v-tabs`, explorador `v-explorer`, tabla `v-grid`, barra
  de selección `v-selectionbar`, interruptor `v-switch`). Ver la sección 5 y `demo-datos.html`.
- `themes.css`: paletas con `data-theme="graphite|slate|spider|forest|contrast"` en `<html>`. Sin atributo, la de
  siempre (Monocromo). Esquinas con `data-radius="sharp|round"` y filas más altas con `data-density="comfortable"`.
- **Modo:** `data-mode="dark|light"` fuerza el modo (`data-theme="dark|light"` sigue funcionando, pero `data-theme`
  queda para la paleta). `data-mode-scope="light|dark"` aplica un modo solo a un elemento y lo que tiene dentro.
- **`--sp-text-tertiary` pasa a AA:** `#737373` en claro (antes `#8f8f8f`) y `#8a8a8a` en oscuro (antes `#737373`).
  Ya sirve para pistas y contadores, no solo para placeholders (sobre `--sp-bg-muted` todavía no: ahí, secundario).
- `v-segmented` también marca `aria-checked="true"` (grupo de radios), token `--sp-row-dense` (28 px) y utilidades
  `v-mono`, `v-page-meta` y `v-btn-ghost--danger`.

## 2. Qué estilo usar en cada pantalla

| Pantalla | Sistema | Clases |
|---|---|---|
| La aplicación en sí (listados, formularios, ajustes, dashboards, editores) | Panel estilo Vercel, monocromo | `v-*` |
| Herramienta de datos: administrador de bases, catálogos o registros con muchas filas | Apps de datos (phpMyFlow) | `v-*` + `data.css` |
| Login, registro, recuperar contraseña, código OTP, pantalla de bienvenida | Acceso estilo Stripe, violeta y ámbar | `auth-*` |

No mezclar: nada de `auth-*` dentro del panel ni violeta en los botones del panel.

## 3. Componentes del panel (`v-*`)

Envolver la raíz de la app con `class="v-app"` (fuente, color y box-sizing).

**Botones**
- `v-btn-primary`: negro. Una sola acción principal por vista.
- `v-btn-secondary`: blanco con borde (cancelar, acciones secundarias).
- `v-btn-danger`: solo para borrar o acciones destructivas.
- Modificadores: `v-btn--sm` y `v-btn--block`.

**Formularios**
```html
<div class="v-field">
  <label class="v-label" for="nombre">Nombre</label>
  <input class="v-input" id="nombre" aria-invalid="false" aria-describedby="nombre-help">
  <p class="v-help" id="nombre-help">Texto de ayuda</p>
  <!-- con error: aria-invalid="true" y <p class="v-error"> -->
</div>
```
`v-input` sirve también para `<textarea>`.

**Selector** (1.3.0). **Nunca un `<select>` nativo a la vista**: su lista la dibuja el sistema operativo (gris,
con el azul de Windows) y no sigue el estilo. Usar el selector de spider-ui, que abre una lista con el estilo de
`v-menu` (como el menú de la cuenta), con ✓ en la opción elegida.
- **HTML / Flask / Electron sin React:** cargar `select.js` una vez y marcar el `<select>` con `data-v-select`.
  El `<select>` sigue en el formulario (oculto): se envía igual y sigue disparando `change`.
  ```html
  <script src="node_modules/spider-ui/select.js" defer></script>
  <label class="v-label" for="rol">Rol</label>
  <select class="v-input" id="rol" name="rol" data-v-select>
    <option value="admin" data-desc="Todo, también los usuarios">Administrador</option>   <!-- data-desc: opcional -->
    <option value="lectura" selected>Solo lectura</option>
  </select>
  ```
  `data-v-select="sm"`: versión chica (30 px) para barras, tablas y paginación. Los `<select>` que se agregan
  después (formularios armados con JS) se convierten solos. Si el código cambia `select.value`, llamar a
  `spiderSelect.refrescar(select)` para que el botón lo muestre.
- **React:** el Select de Radix con las mismas clases: disparador `v-select__boton`, lista `v-menu v-select__lista`,
  opciones `v-menu__item` con `aria-selected` y `<span class="v-menu__check">` (ícono check).
- Teclado: ↑ ↓ Inicio Fin, Enter o Espacio para elegir, Esc para cerrar, y una letra salta a la opción.

**Tarjeta**
```html
<section class="v-card">
  <header class="v-card__header"><h2 class="v-card__title">Título</h2></header>
  <div class="v-card__body">…</div>
  <footer class="v-card__footer">
    <button class="v-btn-secondary">Cancelar</button>
    <button class="v-btn-primary">Guardar</button>
  </footer>
</section>
```

**Barras de herramientas** (1.1.0)
```html
<div class="v-toolbar" role="toolbar" aria-label="Acciones">
  <div class="v-toolbar__group">
    <button class="v-btn-ghost"><svg/>Abrir</button>
    <button class="v-btn-icon" aria-label="Deshacer"><svg/></button>
  </div>
  <span class="v-toolbar__sep" aria-hidden="true"></span>
  <span class="v-toolbar__spacer"></span>
  <button class="v-btn-primary">Guardar</button>
</div>
```
- `v-btn-ghost` (icono + texto) y `v-btn-icon` (solo icono, con `aria-label`): sin fondo; `aria-pressed="true"` = herramienta activa; `aria-expanded="true"` = su menú está abierto. Con `v-btn--sm`, 28 px.
- `v-toolbar--sub`: barra secundaria (opciones de la herramienta), fondo sutil.

**Control segmentado** (cambiar de vista): `<div class="v-segmented" role="tablist">` con `<button class="v-segmented__item" role="tab" aria-selected="true">`.

**Menú desplegable**
```html
<div class="v-menu" role="menu" aria-label="Exportar">
  <button class="v-menu__item" role="menuitem"><svg/>
    <span class="v-menu__label">Word <span class="v-menu__desc">Texto editable</span></span>
    <span class="v-menu__hint">Ctrl+S</span>
  </button>
  <div class="v-menu__sep" role="separator"></div>
</div>
```
Elemento resaltado con el teclado: `data-highlighted` o `:focus-visible`. Desactivado: `aria-disabled="true"`.

**Modal**: `<dialog class="v-app v-dialog">` abierto con `showModal()` (atrapa el foco, cierra con Esc), con `v-card__header`, `v-card__body` (hace scroll) y `v-card__footer` dentro (o dentro de un `<form>`). `v-dialog--wide`: 720 px.

**Tecla**: `<kbd class="v-kbd">Ctrl</kbd>`.


**Tabla**: `<div class="v-table-wrap"><table class="v-table">…</table></div>`

**Estados**: `v-badge` más `--success`, `--warning`, `--danger` o `--brand`.
**Avisos**: `v-banner` más `--danger`, `--success`, `--warning` o `--info` (con `role="alert"` si es un error).
**Títulos**: `v-page-title`, `v-page-subtitle` y `v-divider`.

**Letras** (1.2.0, las de SpiderFolio; siempre con los tokens, nunca con px sueltos):

| Token | Tamaño | Para qué |
|---|---|---|
| `--sp-fs-2xs` | 10 px | nombres del rail, títulos de grupo del menú («ESPACIOS»), teclas |
| `--sp-fs-xs` | 11 px | contadores, secciones plegables («RECIENTES») |
| `--sp-fs-sm` / `--sp-lh-sm` | 13 / 18 px | texto secundario, ayudas, buscador del menú, fecha de la cabecera |
| `--sp-fs-base` / `--sp-lh-base` | 14 / 22 px | texto de interfaz: filas del menú, tablas, formularios (base de `.v-app`) |
| `--sp-fs-lg` | 15 px | título de tarjeta |
| `--sp-fs-xl` | 24 px | título de página |
| `--sp-fs-prose` / `--sp-lh-prose` | 17 px / 1,75 | documentos y textos largos (`v-prose`) |

`v-eyebrow`: etiqueta de 13 px en mayúsculas con espaciado .18em (encima de un número o de un bloque).

## 4. Marco de la app (1.2.0, `shell.css`)

El de SpiderFolio. Ver `demo-marco.html`.

| Parte | Medida | Letra | Color |
|---|---|---|---|
| Rail de áreas `v-rail` | 64 px; ítem de 52 px, ícono de 20 px | 10 px | fondo `--sp-bg-subtle`; actual en violeta suave |
| Menú `v-sidebar` | 260 px (72 contraído) | 14 px; título del área 14 semibold | fondo `--sp-bg`, borde derecho |
| Fila `v-nav-item` | 36 px; ícono de 18 px en un hueco de 36 | 14 px, texto al 90 % | hover `--sp-bg-muted`; actual `--sp-primary-light` / `--sp-primary-text` |
| Fila secundaria `v-nav-item--compact` | 30 px, ícono de 16 | 13 px gris | |
| Grupo `v-sidebar__section` | 28 px | 10 px, mayúsculas, .18em | `--sp-text-secondary` |
| Contador `v-nav-count` | 20 px de alto | 11 px semibold | `--sp-primary` (`--warning`, `--danger`) |
| Cabecera `v-topbar` | 56 px | título 14 medium, fecha 13 gris | fondo `--sp-bg` al 95 % con desenfoque |
| Contenido `v-main` | máx. 1400 px; 16/24/32 px de margen | | fondo `--sp-bg-subtle` |
| Barra inferior `v-bottombar` | 64 px (solo < 768 px) | 10 px | actual en `--sp-primary-text` |

El violeta suave va **solo** en el ítem actual del rail y del menú; los avisos (punto del rail, contadores,
número sobre un ícono) en `--sp-primary`. Todo lo demás, gris.

```html
<div class="v-shell">                                   <!-- + v-shell--contraido · v-shell--menu-abierto -->
  <nav class="v-rail" aria-label="Áreas">
    <a class="v-rail__item" href="/docs" aria-current="page"><svg/><span>Docs</span><span class="v-rail__dot"></span></a>
    <div class="v-rail__foot"><a class="v-rail__item" href="/ajustes"><svg/><span>Ajustes</span></a></div>
  </nav>

  <div class="v-sidebar">
    <aside class="v-sidebar__panel" aria-label="Menú de Docs">
      <div class="v-sidebar__top">
        <button class="v-sidebar__row" aria-label="Empresa: Demo">
          <span class="v-sidebar__slot"><span class="v-mark">D</span></span>
          <span class="v-sidebar__row-text v-sidebar__hide"><strong>Demo</strong></span>
          <svg/>                                         <!-- chevrons-up-down -->
        </button>
      </div>
      <div class="v-sidebar__actions">
        <button class="v-sidebar__search" aria-keyshortcuts="Control+K">
          <span class="v-sidebar__slot"><svg/></span><span>Buscar…</span><kbd>Ctrl K</kbd>
        </button>
        <button class="v-sidebar__add" aria-label="Crear"><svg/></button>
      </div>
      <nav class="v-sidebar__nav" aria-label="Docs">
        <p class="v-sidebar__title">Documentación</p>
        <a class="v-nav-item" href="…" aria-current="page">
          <span class="v-sidebar__slot"><svg/></span><span class="v-nav-item__label">Vencimientos</span>
          <span class="v-nav-count v-nav-count--danger">2</span>
        </a>
        <p class="v-sidebar__section">Espacios</p>
        <button class="v-sidebar__group" aria-expanded="true"><svg/>Recientes</button>   <!-- plegable -->
        <a class="v-nav-item v-nav-item--compact" href="…">…</a>
        <hr class="v-sidebar__sep">
      </nav>
      <div class="v-sidebar__foot">
        <button class="v-sidebar__row" aria-label="Diego Pennisi">
          <span class="v-sidebar__slot"><span class="v-avatar">DP</span></span>
          <span class="v-sidebar__row-text v-sidebar__hide"><strong>Diego Pennisi</strong><span>Administrador</span></span>
          <svg/>
        </button>
      </div>
    </aside>
    <button class="v-sidebar__edge" aria-label="Contraer menú (Ctrl+B)" aria-keyshortcuts="Control+B"><svg/></button>
  </div>

  <div class="v-shell__body">
    <header class="v-topbar">
      <p class="v-topbar__title">Archivos</p>
      <p class="v-topbar__date">domingo, 8 de noviembre de 2026</p>
      <div class="v-topbar__actions">
        <button class="v-btn-icon" aria-label="Avisos: 5"><svg/><span class="v-count">5</span></button>
      </div>
    </header>
    <main class="v-main">…</main>
  </div>

  <nav class="v-bottombar" aria-label="Áreas">           <!-- solo se ve en el teléfono -->
    <a class="v-bottombar__item" href="/docs" aria-current="page"><svg/><span>Docs</span></a>
  </nav>
</div>
```

- **Contraer** (solo en pantalla grande): la app alterna `v-shell--contraido` con la flecha del borde y con
  Ctrl+B, y lo recuerda. Contraído, el menú mide 72 px y cada fila es un cuadrado de 36 px; lo que lleva
  `v-sidebar__hide` desaparece (poné un `title` o tooltip con el nombre de cada fila).
- **Menos de 1024 px**: el menú se abre como hoja sobre el contenido con `v-shell--menu-abierto` (un botón ☰ en
  la cabecera). Detrás, `<div class="v-shell__scrim">` para cerrarlo con un clic. Esc también debe cerrarlo.
- **Menos de 768 px**: el rail desaparece y aparece `v-bottombar` (hasta 4 áreas y «Más»). La fecha de la
  cabecera se oculta; los rótulos de los botones, con `v-ocultar-movil`.
- Navegación: `aria-current="page"` en el ítem actual (rail, menú y barra inferior).
- Íconos: Lucide con trazo 1,75.

## 5. Apps de datos (1.4.0, `data.css`)

El estilo de phpMyFlow: monocromo, compacto, nombres técnicos en monoespaciada y números alineados a la derecha.
Para herramientas donde se trabaja con muchas filas. Ver `demo-datos.html`.

```
+- v-appbar ------------------------------------------------------------------------+
| phpMyFlow / tienda    Vista general  Datos  Estructura  SQL            acciones   |
+- v-explorer -------+--------------------------------------------------------------+
| [tienda     v] [...]| título + v-page-meta                         botones          |
| [Buscar tabla] [=]  | [filtro]  v-selectionbar                                      |
| ven_ 4     FILAS v  | v-grid-wrap > v-grid                                          |
|   pedidos    1,2 M  |                                                               |
+--------------------+--------------------------------------------------------------+
```

| Parte | Medida | Letra |
|---|---|---|
| Cabecera `v-appbar` | 48 px, borde inferior | marca 14 semibold; ruta en `v-mono`; usuario 12 mono gris |
| Pestañas `v-tabs` | toda la altura de la cabecera (40 px sueltas) | 13 medium; la actual subrayada con `--sp-text-primary` |
| Explorador `v-explorer` | 248 px, fondo `--sp-bg-subtle` | filas de 28 px (`--sp-row-dense`), nombres 12,5 mono, cifra 11 |
| Tabla `v-grid` | filas de 28 px, cabecera fija de 34 | celdas 12,5 mono, cabecera 12 semibold Inter |

**Cabecera y pestañas**
```html
<header class="v-appbar">
  <nav class="v-appbar__crumbs" aria-label="Ubicación">
    <strong class="v-appbar__brand">phpMyFlow</strong><span class="v-appbar__sep" aria-hidden="true">/</span>
    <a class="v-appbar__crumb v-mono" href="…">tienda</a>
  </nav>
  <nav class="v-tabs" aria-label="Vistas">
    <a class="v-tabs__item" href="…" aria-current="page">Vista general</a>
    <a class="v-tabs__item" aria-disabled="true">Relaciones</a>
  </nav>
  <div class="v-appbar__actions"><span class="v-appbar__user">root@127.0.0.1</span>…</div>
</header>
```
`v-tabs` cambia de página o de vista (`aria-current="page"`). Si cambia un panel dentro de la página, `role="tablist"`
y `role="tab"` con `aria-selected`. Para elegir entre 2-4 opciones de una misma vista, `v-segmented`.

**Explorador** (el menú lateral de objetos: tablas, documentos, registros). Reglas, para que no confunda:
1. Arriba **solo dos filas**: el selector de lo que se está mirando (con su menú `⋯`) y el buscador (con el botón de
   opciones). Ordenar, agrupar y mostrar ocultos van en ese menú de opciones (`menuitemradio` / `menuitemcheckbox`),
   no como casillas sueltas sobre la lista.
2. **Una sola cifra por fila**, y la cabecera del grupo dice cuál es (`v-explorer__metric`: «Filas ↓»). La flecha
   indica por qué está ordenada la lista. La cifra, corta («1,2 M», «402 mil», con `Intl.NumberFormat` compacto); la
   exacta, en el `title`.
3. Si los nombres comparten **prefijos** (`sap_`, `cfg_`, `wp_`), un grupo por prefijo (`v-explorer__title v-mono`)
   y el nombre sin el prefijo. No pintar el prefijo en gris dentro del nombre.
4. **Grupos vacíos fuera.** Sin nada elegido, `v-explorer__empty` («Elige una base de datos») en vez de grupos en cero.
5. La fila actual lleva `aria-current="page"`: fondo de tarjeta con borde (como el segmentado), no un bloque negro.

```html
<aside class="v-explorer" aria-label="Base de datos">
  <div class="v-explorer__top">
    <div class="v-explorer__row">
      <select class="v-input" aria-label="Base de datos" data-v-select="sm">…</select>
      <button class="v-btn-icon v-btn--sm" aria-label="Acciones de tienda" aria-haspopup="menu"><svg/></button>
    </div>
    <div class="v-explorer__row">
      <label class="v-explorer__search"><svg/><input type="search" placeholder="Buscar tabla" aria-label="Buscar tabla"></label>
      <button class="v-btn-icon v-btn--sm" aria-label="Opciones de la lista" aria-haspopup="menu"><svg/></button>
    </div>
  </div>
  <nav class="v-explorer__list" aria-label="Tablas">
    <section class="v-explorer__group">
      <h3 class="v-explorer__head"><button aria-expanded="true"><svg class="v-explorer__chev"/>
        <span class="v-explorer__title v-mono">ven_</span><span class="v-explorer__count">4</span>
        <span class="v-explorer__metric">Filas ↓</span></button></h3>
      <div class="v-explorer__item">
        <a class="v-explorer__link" href="…" aria-current="page" title="ven_pedidos · ~1.204.388 filas">
          <svg class="v-explorer__icon"/><span class="v-explorer__name">pedidos</span><span class="v-explorer__value">1,2 M</span></a>
        <button class="v-explorer__action" aria-pressed="false" aria-label="Fijar ven_pedidos"><svg/></button>
      </div>
    </section>
  </nav>
</aside>
```
- Grupo que no se pliega (por ejemplo «Fijadas»): `<h3 class="v-explorer__head"><span>Fijadas</span></h3>`.
- Coincidencias de la búsqueda: `<mark>` dentro de `v-explorer__name`.
- Tamaño relativo: `<span class="v-explorer__bar" style="width: 40%">` dentro de `v-explorer__item`.
- Sin `v-explorer__action` cuando la fila no tiene acción. En pantallas táctiles la acción se ve siempre.

**Tabla de datos**
```html
<div class="v-grid-wrap">
  <table class="v-grid">
    <thead><tr>
      <th class="v-grid__check"><input type="checkbox" aria-label="Seleccionar todas"></th>
      <th aria-sort="ascending"><button class="v-grid__sort">Nombre</button></th>
      <th class="v-grid__num"><button class="v-grid__sort">Filas</button></th>
    </tr></thead>
    <tbody>
      <tr aria-selected="true"><td class="v-grid__check">…</td><td><a class="v-grid__link" href="…">ven_pedidos</a></td>
        <td class="v-grid__num">~1.204.388</td></tr>
    </tbody>
  </table>
</div>
```
`v-grid__num` (derecha, cifras tabulares), `v-grid__muted`, `v-grid__null` (vacío / NULL, cursiva gris),
`v-grid--lines` (líneas verticales, como una hoja de cálculo). La flecha de orden sale sola de `aria-sort`.
`.v-table` (sección 3) sigue siendo la tabla cómoda de un panel de administración.

**Barra de selección**: sin nada marcado, un aviso de qué se puede hacer, **no** una fila de botones grises.
```html
<p class="v-selectionbar v-selectionbar--idle">Marca tablas para exportarlas, vaciarlas o borrarlas.</p>
<div class="v-selectionbar" role="toolbar" aria-label="Acciones sobre la selección">
  <span class="v-selectionbar__count" aria-live="polite">3 seleccionadas</span>
  <button class="v-btn-ghost v-btn--sm">Exportar</button>
  <button class="v-btn-ghost v-btn--sm v-btn-ghost--danger">Borrar…</button>
  <button class="v-btn-ghost v-btn--sm v-selectionbar__clear">Quitar selección</button>
</div>
```

**Interruptor**: `<button class="v-switch" role="switch" aria-checked="true" aria-label="Activo"></button>`
(sí/no en filas densas y ajustes que se aplican al instante; en un formulario que se envía, una casilla).

**Paletas** (`themes.css`): `data-theme` en `<html>` con `graphite` (Grafito), `slate` (Pizarra), `spider`,
`forest` (Bosque) o `contrast` (Alto contraste); el modo, con `data-mode` o el del sistema. Para mostrar una paleta
en una parte de la página (tarjetas para elegir tema): `data-preview-theme="slate" data-mode-scope="dark"`.
Si la app guarda el tema en `localStorage`, ponerlo en `<html>` con un `<script>` en línea dentro de `<head>`
(antes de pintar), para que no parpadee.

## 6. Pantallas de acceso (`auth-*`)

Estructura obligatoria:

```html
<div class="auth-page">
  <div class="auth-bg" aria-hidden="true">
    <div class="auth-blob auth-blob--violeta"></div>
    <div class="auth-blob auth-blob--ambar"></div>
    <div class="auth-blob auth-blob--oscuro"></div>
    <div class="auth-blob auth-blob--rosa"></div>
  </div>
  <main class="auth-card">
    <header class="auth-header">
      <img class="auth-logo" src="logo.svg" alt="Nombre de la app">
      <h1 class="auth-title">Iniciá sesión</h1>
      <p class="auth-subtitle">…</p>
    </header>
    <form>
      <div class="auth-field">
        <label class="auth-label" for="email">Email</label>
        <input class="auth-input" id="email" type="email">
        <p class="auth-error">…</p>
      </div>
      <button class="auth-btn" type="submit">Entrar</button>
    </form>
  </main>
</div>
```

Extras: `auth-card--wide` + `auth-grid` (formularios largos de 2 columnas), `auth-input--otp`, `auth-input-wrap` + `auth-eye` (mostrar contraseña), `auth-banner(--success|--info)`, `auth-badge`, `auth-link`, `auth-divider`, `auth-alt`, `auth-check`, `auth-spinner`, `auth-card--shake` (error), `<dialog class="auth-modal">`, `auth-footer`.

## 7. Reglas

1. **Reutilizar antes de crear.** Si existe una clase `v-*` o `auth-*`, usarla.
2. **Nunca usar colores hex sueltos ni colores de la paleta de Tailwind** (`bg-blue-500`, `text-gray-700`…). Solo `var(--sp-*)` o las clases `spider-*` del preset.
3. Para el layout (flex, grid, márgenes) sí se pueden usar utilidades de Tailwind o CSS propio. Lo visual (colores, radios, sombras, tipografía) sale siempre de spider-ui.
4. **CSS propio de una pantalla:** en el proyecto, con un prefijo corto de esa pantalla (`ed-` para editor, `cfg-` para configuración…) y un comentario que diga dónde se usa.
5. **Accesibilidad:** contraste AA, `:focus-visible` en todo lo interactivo, `aria-invalid` en los errores, `.sr-only` para texto solo de lectores de pantalla, modales con `<dialog>`, y animaciones desactivadas con `prefers-reduced-motion`.
6. **Animaciones:** solo `transform` y `opacity`, de 150 a 300ms.
7. **Responsive:** comprobar a 375px. Puntos de corte habituales: 480, 640, 767 y 900px.
8. Si falta un componente que se va a repetir en varios proyectos, no inventarlo en el proyecto: proponer añadirlo a spider-ui.
