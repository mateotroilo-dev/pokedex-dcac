import { SkeletonBlock } from 'src/shared/ui/Skeleton/Skeleton.styles.js';

const Skeleton = ({ width, height, radius }) => (
  <SkeletonBlock $width={width} $height={height} $radius={radius} aria-hidden="true" />
);

export default Skeleton;
