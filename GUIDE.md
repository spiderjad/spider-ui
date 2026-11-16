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

## 2. Qué estilo usar en cada pantalla

| Pantalla | Sistema | Clases |
|---|---|---|
| La aplicación en sí (listados, formularios, ajustes, dashboards, editores) | Panel estilo Vercel, monocromo | `v-*` |
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
`v-input` sirve también para `<select>` y `<textarea>`.

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

## 5. Pantallas de acceso (`auth-*`)

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

## 6. Reglas

1. **Reutilizar antes de crear.** Si existe una clase `v-*` o `auth-*`, usarla.
2. **Nunca usar colores hex sueltos ni colores de la paleta de Tailwind** (`bg-blue-500`, `text-gray-700`…). Solo `var(--sp-*)` o las clases `spider-*` del preset.
3. Para el layout (flex, grid, márgenes) sí se pueden usar utilidades de Tailwind o CSS propio. Lo visual (colores, radios, sombras, tipografía) sale siempre de spider-ui.
4. **CSS propio de una pantalla:** en el proyecto, con un prefijo corto de esa pantalla (`ed-` para editor, `cfg-` para configuración…) y un comentario que diga dónde se usa.
5. **Accesibilidad:** contraste AA, `:focus-visible` en todo lo interactivo, `aria-invalid` en los errores, `.sr-only` para texto solo de lectores de pantalla, modales con `<dialog>`, y animaciones desactivadas con `prefers-reduced-motion`.
6. **Animaciones:** solo `transform` y `opacity`, de 150 a 300ms.
7. **Responsive:** comprobar a 375px. Puntos de corte habituales: 480, 640, 767 y 900px.
8. Si falta un componente que se va a repetir en varios proyectos, no inventarlo en el proyecto: proponer añadirlo a spider-ui.
