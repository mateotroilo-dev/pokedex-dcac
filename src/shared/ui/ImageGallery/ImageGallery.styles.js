import styled from 'styled-components';
import { IMAGE_GALLERY_THUMBNAIL_SIZE } from 'src/shared/ui/ImageGallery/ImageGallery.constants.js';

export const Wrapper = styled.div`
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

// El estado activo se lee del aria-pressed que ya lleva el boton: una prop transient seria el mismo
// dato escrito dos veces.
export const Thumbnail = styled.button`
  width: ${IMAGE_GALLERY_THUMBNAIL_SIZE};
  height: ${IMAGE_GALLERY_THUMBNAIL_SIZE};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;

  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
