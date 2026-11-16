---
name: spider-ui
description: Sistema de diseño de todos los proyectos de Diego (SpiderPDF, SpiderFolio y cualquier proyecto nuevo), con el estilo de Spidercitas. Úsala SIEMPRE que vayas a crear o modificar interfaz en cualquier proyecto (pantallas, componentes, formularios, botones, tablas, modales, login, CSS, estilos, layout, React, Vue, HTML, Electron), aunque el usuario no diga "estilo" ni "diseño". También cuando pida "que se vea como Spidercitas", "con nuestro estilo" o "que quede lindo/profesional".
---

# spider-ui

Toda la interfaz de los proyectos de Diego usa el paquete **spider-ui** (repositorio privado `spiderjad/spider-ui`). El estilo NO se inventa en cada proyecto: sale de ese paquete.

## Paso 1: Excepción

Si el proyecto es **Spidercitas**, no uses esta skill: tiene su propio CSS y su propia skill (`spidercitas-ui`).

## Paso 2: Asegurar que el paquete está instalado

Mirá el `package.json` del frontend.

- Si `spider-ui` **no** está en las dependencias, instalalo:
  ```bash
  npm install github:spiderjad/spider-ui#<commit>
  ```
  Si no hay `package.json` (por ejemplo, HTML suelto), creá uno con `npm init -y` y luego instalá.
- Comprobá que se importa **una sola vez** en el entry del frontend (`src/main.*`, `src/renderer.*`, `src/index.*`…):
  ```js
  import 'spider-ui/spider-ui.css';
  ```
  Sin bundler: `<link rel="stylesheet" href="./node_modules/spider-ui/spider-ui.css">`.
- Si el proyecto usa Tailwind, conectá el preset (v3) o el tema (v4) como indica la guía.
- Si la app no carga Inter (por ejemplo, Electron u offline), instalá `@fontsource-variable/inter` e importalo.

## Paso 3: Leer la guía del paquete (obligatorio)

Antes de escribir interfaz, leé:

```
node_modules/spider-ui/GUIDE.md
```

Es la fuente de verdad: qué clases existen, la estructura HTML de cada componente y las reglas. Cambia con cada versión del paquete, así que no confíes en lo que recuerdes: leela en cada sesión. Si dudás de un valor, mirá `node_modules/spider-ui/tokens.css`.

## Paso 4: Construir

- Aplicación (listados, formularios, ajustes, editores) → clases `v-*`, con la raíz envuelta en `v-app`.
- Marco de la app (rail de áreas, menú lateral, cabecera, barra inferior del teléfono) → las clases del marco
  (`v-shell`, `v-rail`, `v-sidebar`, `v-nav-item`, `v-topbar`, `v-main`…), que copian a SpiderFolio. No armar un
  menú propio. Tamaños de letra: `var(--sp-fs-*)`.
- Herramienta de datos (administrador de bases, catálogos o registros con muchas filas) → las clases de `data.css`
  (`v-appbar`, `v-tabs`, `v-explorer`, `v-grid`, `v-selectionbar`, `v-switch`), el estilo de phpMyFlow. El menú
  lateral de objetos es `v-explorer` y tiene reglas propias (dos filas arriba, una cifra por fila, grupos por prefijo):
  GUIDE.md, sección 5. Paletas: `data-theme="graphite|slate|spider|forest|contrast"`; modo: `data-mode`.
- Selectores: **nunca un `<select>` nativo a la vista** (su lista la dibuja el sistema operativo). En HTML/Flask/
  Electron: `<select class="v-input" data-v-select>` + `select.js` del paquete (`data-v-select="sm"` en barras y
  tablas). En React: Select de Radix con las clases `v-select__boton`, `v-menu v-select__lista`, `v-menu__item`
  y `v-menu__check`. Detalle en GUIDE.md, «Selector».
- Login, registro, OTP o bienvenida → clases `auth-*` con la estructura completa de la guía.
- Colores, radios, sombras y tipografía: **solo** `var(--sp-*)` o las clases `spider-*` de Tailwind. Nunca hex sueltos ni `bg-blue-500` / `text-gray-700`.
- Para el layout (flex, grid, márgenes) podés usar CSS propio o utilidades de Tailwind.
- El CSS propio de una pantalla va en el proyecto, con un prefijo corto y un comentario que diga dónde se usa.
- No edites nada dentro de `node_modules/spider-ui`. Si falta un componente reutilizable, avisale a Diego y proponé añadirlo al repositorio spider-ui.

## Paso 5: Antes de terminar, comprobá

- ¿El paquete está instalado e importado una sola vez?
- ¿Usaste clases existentes y ningún color inventado?
- ¿Ningún `<select>` nativo a la vista (todos con `data-v-select` o el Select de Radix)?
- ¿Tiene foco visible, contraste AA, `aria-invalid` en los errores y funciona a 375px?
- ¿Usaste un solo sistema (`v-*` o `auth-*`) en cada pantalla?
