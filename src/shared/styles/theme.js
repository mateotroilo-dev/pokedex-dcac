export const theme = {
  colors: {
    background: '#f4f5f7',
    surface: '#ffffff',
    text: '#1b1c1e',
    textMuted: '#6b7280',
    textInverted: '#ffffff',
    border: '#e3e6eb',
    accent: '#e63946',
    // Verde azulado: el hueco de tono mas grande entre las 18 paletas de tipo (entre grass ~100° y
    // ice ~177°). El acento normal (rojo) colisiona con fuego/lucha/tierra/roca, y un azul lleno
    // colisiona con water — ambos ya se probaron y fallaban cuando la comparacion caia en ese tipo.
    accentSecondary: '#0d9488',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    pill: '999px',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
  },
};
