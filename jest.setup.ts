import "@testing-library/jest-dom";

if (typeof window !== "undefined") {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    },
  });
}
