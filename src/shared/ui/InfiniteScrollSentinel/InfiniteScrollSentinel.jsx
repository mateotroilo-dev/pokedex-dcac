import { useIntersectionObserver } from 'src/shared/hooks/useIntersectionObserver.js';
import {
  SENTINEL_ROOT_MARGIN,
  SENTINEL_TEST_ID,
} from 'src/shared/ui/InfiniteScrollSentinel/InfiniteScrollSentinel.constants.js';

const InfiniteScrollSentinel = ({ onLoadMore, enabled }) => {
  const ref = useIntersectionObserver({
    onIntersect: onLoadMore,
    enabled,
    rootMargin: SENTINEL_ROOT_MARGIN,
  });

  return <div ref={ref} role="presentation" aria-hidden="true" data-testid={SENTINEL_TEST_ID} />;
};

export default InfiniteScrollSentinel;
