const observersByNode = new Map();
const intersectingNodes = new Set();

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(node) {
    const observers = observersByNode.get(node) ?? new Set();
    observers.add(this);
    observersByNode.set(node, observers);

    // Reproduce al IntersectionObserver real: si el nodo ya esta marcado en viewport, observe()
    // dispara el callback de una, sin esperar a que nada se mueva.
    if (intersectingNodes.has(node)) {
      this.callback([{ target: node, isIntersecting: true }]);
    }
  }

  unobserve(node) {
    observersByNode.get(node)?.delete(this);
  }

  disconnect() {
    observersByNode.forEach((observers) => observers.delete(this));
  }
}

export const mockIntersectionObserver = {
  install: () => {
    globalThis.IntersectionObserver = MockIntersectionObserver;
  },

  reset: () => {
    observersByNode.clear();
    intersectingNodes.clear();
  },

  intersect: (node) => {
    intersectingNodes.add(node);
    observersByNode.get(node)?.forEach((observer) => {
      observer.callback([{ target: node, isIntersecting: true }]);
    });
  },
};
