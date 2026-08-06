import styled from 'styled-components';
import Button from 'src/shared/ui/Button/Button.jsx';

export const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

// Ancho fijo para el caso mas largo ("hace unos minutos · cacheado"): sin esto, cada tramo de
// edad o el toggle de "cacheado" (por ejemplo al refrescar) corre el boton de al lado.
export const AgeLabel = styled.span`
  display: inline-block;
  min-width: 15em;
`;

// El texto accesible del boton va oculto (VisuallyHidden): el icono solo no alcanza como fuente
// de verdad, y padding parejo (en vez del rectangular de un boton de texto) lo hace circular.
export const RefreshButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const RefreshIcon = styled.svg`
  width: 1rem;
  height: 1rem;
`;
