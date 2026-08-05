import { render } from '@testing-library/react';
import { useIntersectionObserver } from 'src/shared/hooks/useIntersectionObserver.js';
import { mockIntersectionObserver } from 'test/utils/mockIntersectionObserver.js';

const SENTINEL_TEST_ID = 'sentinel';

const Sentinel = ({ onIntersect, enabled }) => {
  const ref = useIntersectionObserver({ onIntersect, enabled, rootMargin: '0px' });
  return <div ref={ref} data-testid={SENTINEL_TEST_ID} />;
};

describe('useIntersectionObserver', () => {
  it('calls onIntersect when the observed node enters the viewport', () => {
    let calls = 0;
    const { getByTestId } = render(<Sentinel onIntersect={() => (calls += 1)} enabled />);

    mockIntersectionObserver.intersect(getByTestId(SENTINEL_TEST_ID));

    expect(calls).toBe(1);
  });

  it('does not observe while disabled', () => {
    let calls = 0;
    const { getByTestId } = render(<Sentinel onIntersect={() => (calls += 1)} enabled={false} />);

    mockIntersectionObserver.intersect(getByTestId(SENTINEL_TEST_ID));

    expect(calls).toBe(0);
  });

  it('fires again when enabled flips back to true with the node still in the viewport', () => {
    let calls = 0;
    const onIntersect = () => (calls += 1);
    const { getByTestId, rerender } = render(<Sentinel onIntersect={onIntersect} enabled />);
    const node = getByTestId(SENTINEL_TEST_ID);

    mockIntersectionObserver.intersect(node);
    expect(calls).toBe(1);

    rerender(<Sentinel onIntersect={onIntersect} enabled={false} />);
    rerender(<Sentinel onIntersect={onIntersect} enabled />);

    expect(calls).toBe(2);
  });

  it('disconnects the observer on unmount', () => {
    let calls = 0;
    const { getByTestId, unmount } = render(<Sentinel onIntersect={() => (calls += 1)} enabled />);
    const node = getByTestId(SENTINEL_TEST_ID);

    unmount();
    mockIntersectionObserver.intersect(node);

    expect(calls).toBe(0);
  });
});
