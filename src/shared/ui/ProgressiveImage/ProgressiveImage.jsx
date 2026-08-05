import { useState } from 'react';
import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import {
  IMAGE_FALLBACK_TEXT,
  IMAGE_STATUS,
} from 'src/shared/ui/ProgressiveImage/ProgressiveImage.constants.js';
import { Fallback, Frame, Image } from 'src/shared/ui/ProgressiveImage/ProgressiveImage.styles.js';

const ProgressiveImage = ({ src, alt, width, height }) => {
  const [status, setStatus] = useState(IMAGE_STATUS.LOADING);

  const handleLoad = () => setStatus(IMAGE_STATUS.LOADED);
  const handleError = () => setStatus(IMAGE_STATUS.ERROR);

  // Sin src no hay carga que esperar: una img sin el atributo no dispara load ni error, y el
  // skeleton se quedaria animando para siempre.
  const hasFailed = !src || status === IMAGE_STATUS.ERROR;

  if (hasFailed) {
    return (
      <Frame $width={width} $height={height}>
        <Fallback>{IMAGE_FALLBACK_TEXT}</Fallback>
      </Frame>
    );
  }

  const isLoaded = status === IMAGE_STATUS.LOADED;

  return (
    <Frame $width={width} $height={height} aria-busy={!isLoaded}>
      {!isLoaded && <Skeleton />}
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        $isLoaded={isLoaded}
        onLoad={handleLoad}
        onError={handleError}
      />
    </Frame>
  );
};

export default ProgressiveImage;
