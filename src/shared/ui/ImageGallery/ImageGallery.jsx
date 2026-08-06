import { useState } from 'react';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import { Thumbnail, Thumbnails, Wrapper } from 'src/shared/ui/ImageGallery/ImageGallery.styles.js';

const ImageGallery = ({ images, width, height }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { src, label } = images[selectedIndex] ?? {};

  return (
    <Wrapper>
      {/* ProgressiveImage guarda su estado de carga en useState y no lo reinicia al cambiar de src:
          sin el key, una imagen que falla deja el fallback pegado para la que se elija despues. */}
      <ProgressiveImage key={src} src={src} alt={label} width={width} height={height} />
      <Thumbnails>
        {images.map((image, index) => (
          // La etiqueta va en el boton y no en el alt: asi la unica imagen con nombre accesible es
          // la principal, y una miniatura que falla no le mete su fallback al nombre del boton.
          <Thumbnail
            key={image.src}
            type="button"
            aria-label={image.label}
            aria-pressed={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          >
            <ProgressiveImage src={image.src} alt="" />
          </Thumbnail>
        ))}
      </Thumbnails>
    </Wrapper>
  );
};

export default ImageGallery;
