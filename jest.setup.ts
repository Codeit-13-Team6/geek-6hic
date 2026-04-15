import "@testing-library/jest-dom";

// IntersectionObserver가 없는 환경(JSDOM)에서 에러가 나지 않게 가짜(Mock)를 만듭니다.
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
