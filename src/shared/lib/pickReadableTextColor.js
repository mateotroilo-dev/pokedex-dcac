const HEX_COLOR = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i;

const toChannelLuminance = (channel) => {
  const ratio = channel / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
};

// Luminancia relativa y ratio de contraste, tal como los define WCAG 2.1.
const toRelativeLuminance = (hexColor) => {
  const parsed = HEX_COLOR.exec(hexColor ?? '');
  if (!parsed) return null;

  const [red, green, blue] = parsed.slice(1).map((pair) => toChannelLuminance(parseInt(pair, 16)));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const toContrastRatio = (luminance, otherLuminance) =>
  (Math.max(luminance, otherLuminance) + 0.05) / (Math.min(luminance, otherLuminance) + 0.05);

// Sobre una paleta de fondos variada no hay un color de texto unico que contraste con todos, asi
// que lo elige el fondo. Devuelve el primer candidato si no puede leer el color: un fondo que no
// parsea no vale romper el render.
export const pickReadableTextColor = (backgroundColor, candidates) => {
  const backgroundLuminance = toRelativeLuminance(backgroundColor);
  if (backgroundLuminance === null) return candidates[0];

  const contrastAgainstBackground = (candidate) => {
    const luminance = toRelativeLuminance(candidate);
    return luminance === null ? 0 : toContrastRatio(luminance, backgroundLuminance);
  };

  return candidates.reduce((best, candidate) =>
    contrastAgainstBackground(candidate) > contrastAgainstBackground(best) ? candidate : best,
  );
};
