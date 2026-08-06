import styled from 'styled-components';

// Reproducen el espaciado de lo que reemplazan: el Wrapper el gap que PageLayout deja entre la
// galeria y el summary, y cada bloque el gap interno de su componente.
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Thumbnails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
