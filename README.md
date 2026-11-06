# spider-ui

Sistema de diseño compartido de los proyectos Spider (Spidercitas, SpiderPDF, SpiderFolio…). Es la única fuente del estilo.

| Archivo | Qué es |
|---|---|
| `tokens.css` | Colores, tipografía, radios y sombras (`--sp-*`). **Aquí se cambia el estilo de todo.** |
| `panel.css` | Componentes de aplicación `v-*` (estilo Vercel). |
| `auth.css` | Pantallas de acceso `auth-*` (estilo Stripe, violeta y ámbar). |
| `spider-ui.css` | Importa los tres anteriores. |
| `tailwind-preset.js` / `tailwind-v4.css` | Colores `spider-*` para Tailwind. |
| `GUIDE.md` | Cómo usarlo (Claude Code la lee desde `node_modules`). |
| `demo.html` | Vista de todos los componentes. Abrir en el navegador. |

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
