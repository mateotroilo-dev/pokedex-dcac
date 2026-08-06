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

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StatRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Mismas columnas que PokemonStatBar: etiqueta, barra y valor.
export const StatRow = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 1fr 2.5rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StatTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Mismas columnas que el <dl> de PokemonFacts: termino y detalle.
export const Facts = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
`;

export const Abilities = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
