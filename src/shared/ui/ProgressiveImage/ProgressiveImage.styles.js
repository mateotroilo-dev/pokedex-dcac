import styled from 'styled-components';

export const Frame = styled.div`
  position: relative;
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '100%'};
`;

// Absoluta sobre el skeleton, y oculta con opacity en vez de display: none. Una imagen
// loading="lazy" fuera del layout no la pide el navegador, y el skeleton quedaria para siempre.
export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
  transition: opacity 200ms ease-in;
`;

// El borde no es decorativo: el fondo del hueco es colors.background, el mismo que GlobalStyle le
// pone al body, asi que en una pantalla sin card encima el recuadro no se ve y el texto queda
// flotando en el vacio.
export const Fallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-align: center;
`;
