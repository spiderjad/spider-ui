# spider-ui

Sistema de diseño compartido de los proyectos Spider (Spidercitas, SpiderPDF, SpiderFolio…). Es la única fuente del estilo.

| Archivo | Qué es |
|---|---|
| `tokens.css` | Colores, tipografía, radios y sombras (`--sp-*`). **Aquí se cambia el estilo de todo.** |
| `panel.css` | Componentes de aplicación `v-*` (estilo Vercel). |
| `select.js` | Selector moderno: convierte `<select data-v-select>` en un desplegable con el estilo de `v-menu`. |
| `shell.css` | Marco de la app: rail de áreas, menú lateral, cabecera, contenido y barra inferior (el de SpiderFolio). |
| `data.css` | Apps de datos (1.4.0, el estilo de phpMyFlow): cabecera, pestañas, explorador, tabla de datos, barra de selección, interruptor. |
| `themes.css` | Paletas (1.4.0): Grafito, Pizarra, Spider, Bosque y Alto contraste con `data-theme`; esquinas y densidad. |
| `auth.css` | Pantallas de acceso `auth-*` (estilo Stripe, violeta y ámbar). |
| `spider-ui.css` | Importa todos los anteriores. |
| `tailwind-preset.js` / `tailwind-v4.css` | Colores `spider-*` para Tailwind. |
| `GUIDE.md` | Cómo usarlo (Claude Code la lee desde `node_modules`). |
| `demo.html` | Vista de todos los componentes. Abrir en el navegador. |
| `demo-marco.html` | El marco de la app completo (rail, menú, cabecera), como SpiderFolio. |
| `demo-datos.html` | Una app de datos completa (cabecera, explorador, tabla), como phpMyFlow. Con paletas y modo oscuro. |

## Usar en un proyecto

```bash
npm install github:spiderjad/spider-ui#<commit>
```
```js
import 'spider-ui/spider-ui.css';
```

Detalle completo en [GUIDE.md](GUIDE.md).

## Publicar un cambio

1. Editar `tokens.css` (o el componente correspondiente) y comprobarlo en `demo.html`.
2. Subir `version` en `package.json` (por ejemplo, de 1.0.0 a 1.1.0).
3. `git commit -am "…" && git push`
4. En cada proyecto: `npm install github:spiderjad/spider-ui#<commit>`

## Pendiente

- [ ] Reemplazar los valores **provisionales** del panel en `tokens.css` (`--sp-bg`, `--sp-border`, `--sp-text-*`, `--sp-radius`) por los reales de Spidercitas.
