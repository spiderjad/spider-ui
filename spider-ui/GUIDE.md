# spider-ui · Guía de uso (para personas y para Claude)

Esta guía viaja dentro del paquete: al actualizar `spider-ui`, todos los
proyectos reciben las reglas nuevas sin copiar nada.

## 1. Instalación en un proyecto

```bash
npm install github:seecorpdesarrollos/spider-ui
```

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

Para actualizar: volver a ejecutar el mismo `npm install github:...`.

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

**Tabla**: `<div class="v-table-wrap"><table class="v-table">…</table></div>`

**Estados**: `v-badge` más `--success`, `--warning`, `--danger` o `--brand`.
**Avisos**: `v-banner` más `--danger`, `--success`, `--warning` o `--info` (con `role="alert"` si es un error).
**Títulos**: `v-page-title`, `v-page-subtitle` y `v-divider`.

## 4. Pantallas de acceso (`auth-*`)

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

## 5. Reglas

1. **Reutilizar antes de crear.** Si existe una clase `v-*` o `auth-*`, usarla.
2. **Nunca usar colores hex sueltos ni colores de la paleta de Tailwind** (`bg-blue-500`, `text-gray-700`…). Solo `var(--sp-*)` o las clases `spider-*` del preset.
3. Para el layout (flex, grid, márgenes) sí se pueden usar utilidades de Tailwind o CSS propio. Lo visual (colores, radios, sombras, tipografía) sale siempre de spider-ui.
4. **CSS propio de una pantalla:** en el proyecto, con un prefijo corto de esa pantalla (`ed-` para editor, `cfg-` para configuración…) y un comentario que diga dónde se usa.
5. **Accesibilidad:** contraste AA, `:focus-visible` en todo lo interactivo, `aria-invalid` en los errores, `.sr-only` para texto solo de lectores de pantalla, modales con `<dialog>`, y animaciones desactivadas con `prefers-reduced-motion`.
6. **Animaciones:** solo `transform` y `opacity`, de 150 a 300ms.
7. **Responsive:** comprobar a 375px. Puntos de corte habituales: 480, 640, 767 y 900px.
8. Si falta un componente que se va a repetir en varios proyectos, no inventarlo en el proyecto: proponer añadirlo a spider-ui.
