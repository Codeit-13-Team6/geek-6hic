//useIntersectionObserver 커스텀 훅 테스트 -> 요소가 뷰포트에 들어왔는지 감지 / 요소 화면에 들어왔을 때 상태 변경 / 콜백 함수 실행 확인

import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// 1. 가짜 브라우저 엔진(IntersectionObserver) 준비
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("useIntersectionObserver 훅 단위 테스트", () => {
  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("바닥에 닿고(intersecting), 다음 페이지가 있으면, 콜백을 호출한다", () => {
    // [Arrange] 준비: 다음 페이지 있음(true), 로딩 중 아님(false)
    renderHook(() => useIntersectionObserver(mockFetchNextPage, true, false));

    // [Act] 실행: 브라우저가 요소를 발견했다고 가정하고 콜백 실행
    const [[callback]] = (global.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    // [Assert] 검증: 호출되어야 함
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("다음 페이지가 없으면(hasNextPage: false), 바닥에 닿아도 호출하지 않는다", () => {
    // [Arrange] 준비: 다음 페이지 없음(false)
    renderHook(() => useIntersectionObserver(mockFetchNextPage, false, false));

    // [Act] 실행
    const [[callback]] = (global.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    // [Assert] 검증: 절대 호출되면 안 됨
    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });
});
