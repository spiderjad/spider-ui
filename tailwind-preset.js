/**
 * spider-ui · preset para Tailwind v3
 *   // tailwind.config.js
 *   presets: [require('spider-ui/tailwind-preset')]
 *   // o en ESM:  import spider from 'spider-ui/tailwind-preset'; presets: [spider]
 * Los colores apuntan a las variables de tokens.css: importar también
 * 'spider-ui/spider-ui.css' (o al menos tokens.css).
 */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        spider: {
          primary: 'var(--sp-primary)',
          'primary-hover': 'var(--sp-primary-hover)',
          'primary-light': 'var(--sp-primary-light)',
          'primary-text': 'var(--sp-primary-text)',
          'on-primary': 'var(--sp-on-primary)',
          accent: 'var(--sp-accent)',
          bg: 'var(--sp-bg)',
          'bg-subtle': 'var(--sp-bg-subtle)',
          'bg-muted': 'var(--sp-bg-muted)',
          canvas: 'var(--sp-canvas)',
          inverse: 'var(--sp-inverse)',
          'on-inverse': 'var(--sp-on-inverse)',
          focus: 'var(--sp-focus)',
          border: 'var(--sp-border)',
          'border-hover': 'var(--sp-border-hover)',
          text: 'var(--sp-text-primary)',
          muted: 'var(--sp-text-secondary)',
          faint: 'var(--sp-text-tertiary)',
          danger: 'var(--sp-danger)',
          'danger-light': 'var(--sp-danger-light)',
          'danger-text': 'var(--sp-danger-text)',
          success: 'var(--sp-success)',
          'success-light': 'var(--sp-success-light)',
          warning: 'var(--sp-warning)',
          'warning-light': 'var(--sp-warning-light)',
        },
      },
      // 1.2.0: la escala de letra de SpiderFolio (text-spider-sm, text-spider-base…).
      fontSize: {
        'spider-2xs': 'var(--sp-fs-2xs)',
        'spider-xs': 'var(--sp-fs-xs)',
        'spider-sm': ['var(--sp-fs-sm)', 'var(--sp-lh-sm)'],
        'spider-base': ['var(--sp-fs-base)', 'var(--sp-lh-base)'],
        'spider-lg': 'var(--sp-fs-lg)',
        'spider-xl': 'var(--sp-fs-xl)',
        'spider-prose': ['var(--sp-fs-prose)', 'var(--sp-lh-prose)'],
      },
      borderRadius: {
        spider: 'var(--sp-radius)',
        'spider-lg': 'var(--sp-radius-lg)',
      },
      boxShadow: {
        spider: 'var(--sp-shadow)',
        'spider-md': 'var(--sp-shadow-md)',
        'spider-lg': 'var(--sp-shadow-lg)',
      },
    },
  },
};
