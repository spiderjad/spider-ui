/*
 * spider-ui · selector (1.3.0)
 * Convierte cada <select data-v-select> en un desplegable con el estilo de v-menu (ver panel.css, «Selector»).
 * El <select> original queda en el formulario, oculto: se envía igual, sigue disparando «change» y su valor
 * manda. Para apps sin React (HTML, Flask, Electron sin bundler):
 *
 *   <script src="node_modules/spider-ui/select.js" defer></script>
 *   <select class="v-input" data-v-select>…</select>          (data-v-select="sm": versión chica)
 *   <option value="admin" data-desc="Puede todo">Administrador</option>   (data-desc: texto gris debajo)
 *
 * Se aplica solo a los <select> que ya están y a los que se agregan después (formularios armados con JS).
 * Teclado (patrón «combobox de solo selección» de WAI-ARIA): ↑ ↓ Inicio Fin para moverse, Enter o Espacio para
 * elegir, Esc para cerrar, y escribir una letra salta a la opción que empieza así.
 * React: usar el Select de Radix con las mismas clases (v-select__boton, v-menu, v-menu__item, v-menu__check).
 * Íconos: chevrons-up-down y check de Lucide (licencia ISC).
 */
(() => {
  'use strict';
  if (window.spiderSelect) return;

  const ICONO_ABRIR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>';
  const ICONO_ELEGIDO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const estados = new WeakMap();   // <select> -> { caja, boton, lista, ... }
  let contador = 0;

  function etiquetaDe(select) {
    const propia = select.getAttribute('aria-label');
    if (propia) return propia.trim();
    const label = select.labels && select.labels[0];
    if (!label) return '';
    // <label>Campo <select>…</select></label>: el texto del label sin el de las opciones.
    const copia = label.cloneNode(true);
    copia.querySelectorAll('select, .v-select').forEach((n) => n.remove());
    return copia.textContent.replace(/\s+/g, ' ').trim();
  }

  function mejorar(select) {
    if (!(select instanceof HTMLSelectElement) || estados.has(select) || select.multiple) return;
    const id = `v-select-${++contador}`;
    const caja = document.createElement('span');
    caja.className = 'v-select' + (select.dataset.vSelect === 'sm' ? ' v-select--sm' : '');
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'v-select__boton';
    boton.setAttribute('role', 'combobox');
    boton.setAttribute('aria-haspopup', 'listbox');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', id);
    const valor = document.createElement('span');
    valor.className = 'v-select__valor';
    boton.append(valor);
    boton.insertAdjacentHTML('beforeend', ICONO_ABRIR);
    const lista = document.createElement('div');
    lista.className = 'v-menu v-select__lista';
    lista.id = id;
    lista.setAttribute('role', 'listbox');
    lista.tabIndex = -1;
    lista.hidden = true;
    caja.append(boton, lista);
    select.after(caja);
    select.hidden = true;
    select.tabIndex = -1;
    // Un <label for="…"> del select ahora lleva al botón.
    if (select.labels) for (const l of select.labels) l.addEventListener('click', (e) => { e.preventDefault(); boton.focus(); });

    const st = { caja, boton, lista, valor, resaltado: -1, letras: '', reloj: 0 };
    estados.set(select, st);

    const opciones = () => [...select.options];
    const refrescar = () => {
      const o = select.options[select.selectedIndex];
      valor.textContent = o ? o.text : '';
      const etiqueta = etiquetaDe(select);
      boton.setAttribute('aria-label', etiqueta ? `${etiqueta}: ${valor.textContent}` : valor.textContent);
      boton.disabled = select.disabled;
      if (select.hasAttribute('aria-invalid')) boton.setAttribute('aria-invalid', select.getAttribute('aria-invalid'));
      if (!lista.hidden) pintar();
    };
    const pintar = () => {
      lista.replaceChildren(...opciones().map((o, i) => {
        const item = document.createElement('div');
        item.className = 'v-menu__item';
        item.id = `${id}-${i}`;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(i === select.selectedIndex));
        if (o.disabled) item.setAttribute('aria-disabled', 'true');
        if (o.hidden) item.hidden = true;
        item.dataset.i = String(i);
        const texto = document.createElement('span');
        texto.className = 'v-menu__label';
        texto.textContent = o.text;
        if (o.dataset.desc) {
          const desc = document.createElement('span');
          desc.className = 'v-menu__desc';
          desc.textContent = o.dataset.desc;
          texto.append(desc);
        }
        const marca = document.createElement('span');
        marca.className = 'v-menu__check';
        marca.innerHTML = ICONO_ELEGIDO;
        item.append(texto, marca);
        return item;
      }));
      resaltar(st.resaltado);
    };
    const habilitadas = () => opciones().map((o, i) => (o.disabled || o.hidden ? -1 : i)).filter((i) => i >= 0);
    const resaltar = (i) => {
      st.resaltado = i;
      lista.querySelectorAll('[data-highlighted]').forEach((x) => x.removeAttribute('data-highlighted'));
      const item = lista.querySelector(`[data-i="${i}"]`);
      if (item) {
        item.setAttribute('data-highlighted', '');
        boton.setAttribute('aria-activedescendant', item.id);
        item.scrollIntoView({ block: 'nearest' });
      } else boton.removeAttribute('aria-activedescendant');
    };
    const ubicar = () => {
      const r = boton.getBoundingClientRect();
      lista.style.minWidth = `${Math.round(r.width)}px`;
      const ancho = lista.offsetWidth;
      const alto = lista.offsetHeight;
      lista.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - ancho - 8))}px`;
      const abajo = r.bottom + 4 + alto <= window.innerHeight - 8 || r.top < alto + 12;
      lista.style.top = `${abajo ? r.bottom + 4 : r.top - 4 - alto}px`;
    };
    const abrir = () => {
      if (boton.disabled || !lista.hidden) return;
      pintar();
      lista.hidden = false;
      boton.setAttribute('aria-expanded', 'true');
      ubicar();
      resaltar(select.selectedIndex >= 0 ? select.selectedIndex : habilitadas()[0] ?? -1);
      document.addEventListener('pointerdown', fuera, true);
      window.addEventListener('scroll', alDesplazar, true);
      window.addEventListener('resize', cerrar);
    };
    const cerrar = () => {
      if (lista.hidden) return;
      lista.hidden = true;
      boton.setAttribute('aria-expanded', 'false');
      boton.removeAttribute('aria-activedescendant');
      document.removeEventListener('pointerdown', fuera, true);
      window.removeEventListener('scroll', alDesplazar, true);
      window.removeEventListener('resize', cerrar);
    };
    const fuera = (e) => { if (!caja.contains(e.target)) cerrar(); };
    const alDesplazar = (e) => { if (e.target !== lista && !lista.contains(e.target)) cerrar(); };
    const elegir = (i) => {
      const o = select.options[i];
      if (!o || o.disabled) return;
      const cambio = select.selectedIndex !== i;
      select.selectedIndex = i;
      refrescar();
      cerrar();
      boton.focus();
      if (cambio) {
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    const mover = (paso) => {
      const h = habilitadas();
      if (!h.length) return;
      const pos = h.indexOf(st.resaltado);
      resaltar(h[Math.max(0, Math.min(h.length - 1, (pos < 0 ? (paso > 0 ? -1 : h.length) : pos) + paso))]);
    };
    const buscarLetra = (letra) => {
      clearTimeout(st.reloj);
      st.letras += letra.toLowerCase();
      st.reloj = setTimeout(() => { st.letras = ''; }, 600);
      const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      const i = habilitadas().find((k) => norm(select.options[k].text).startsWith(norm(st.letras)));
      if (i !== undefined) {
        if (lista.hidden) elegir(i); else resaltar(i);
      }
    };

    boton.addEventListener('click', () => (lista.hidden ? abrir() : cerrar()));
    boton.addEventListener('keydown', (e) => {
      const abierta = !lista.hidden;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!abierta) abrir(); else mover(e.key === 'ArrowDown' ? 1 : -1);
      } else if (e.key === 'Home' || e.key === 'End') {
        if (!abierta) return;
        e.preventDefault();
        const h = habilitadas();
        resaltar(e.key === 'Home' ? h[0] : h[h.length - 1]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (abierta && st.resaltado >= 0) elegir(st.resaltado); else abrir();
      } else if (e.key === 'Escape') {
        if (abierta) { e.preventDefault(); e.stopPropagation(); cerrar(); }
      } else if (e.key === 'Tab') {
        cerrar();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buscarLetra(e.key);
      }
    });
    lista.addEventListener('pointermove', (e) => {
      const item = e.target.closest('[role="option"]');
      if (item && Number(item.dataset.i) !== st.resaltado) resaltar(Number(item.dataset.i));
    });
    lista.addEventListener('click', (e) => {
      const item = e.target.closest('[role="option"]');
      if (item && item.getAttribute('aria-disabled') !== 'true') elegir(Number(item.dataset.i));
    });
    // El valor manda: si el código cambia las opciones o el select se deshabilita, el botón lo refleja.
    select.addEventListener('change', refrescar);
    new MutationObserver(refrescar).observe(select, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['disabled', 'aria-invalid', 'selected'] });
    st.refrescar = refrescar;
    refrescar();
  }

  function mejorarTodo(raiz = document) {
    if (raiz instanceof HTMLSelectElement) { if (raiz.matches('[data-v-select]')) mejorar(raiz); return; }
    raiz.querySelectorAll?.('select[data-v-select]').forEach(mejorar);
  }

  /** Después de cambiar select.value desde el código (eso no dispara eventos), para que el botón lo muestre. */
  function refrescar(select) {
    estados.get(select)?.refrescar();
  }

  const empezar = () => {
    mejorarTodo();
    new MutationObserver((cambios) => {
      for (const c of cambios) for (const nodo of c.addedNodes) if (nodo.nodeType === 1) mejorarTodo(nodo);
    }).observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', empezar);
  else empezar();

  window.spiderSelect = { mejorar, mejorarTodo, refrescar };
})();
