import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostList from "@/components/features/list/PostList";
import * as postHooks from "@/hooks"; // usePostList가 들어있는 위치

// 1. 필요한 외부 모듈 모킹
jest.mock("hooks");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(), // 추가
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null),
    getAll: jest.fn(),
    has: jest.fn(),
  }),
  usePathname: () => "/lounge",
}));

// IntersectionObserver 전역 모킹 (중요!)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("PostList 무한 스크롤 동작 테스트", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("사용자가 리스트 바닥에 도달하면 다음 포스트를 불러오는 함수가 호출되어야 한다", async () => {
    // [Arrange] 준비
    // usePostList가 가짜 데이터를 반환하도록 설정
    (postHooks.usePostList as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 1,
                title: "첫 포스트",
                createdAt: new Date().toISOString(),
                author: { id: "user1", name: "민주", image: "" },
                _count: { comments: 0 },
              },
            ],
          },
        ],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <PostList />
      </QueryClientProvider>,
    );

    // [Act] 실행
    const trigger = document.querySelector(".h-40");
    if (!trigger) throw new Error("트리거 요소를 찾을 수 없습니다.");
    await waitFor(() => {
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });
    // IntersectionObserver의 콜백 낚아채기
    const mockObserver = global.IntersectionObserver as jest.Mock;
    const callback = mockObserver.mock.calls[0][0];

    // 화면에 나타났다고 신호 보내기
    callback([{ isIntersecting: true, target: trigger }]);
    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1); //제대로 한번 호출되었는지 확인 (중복 호출x)
    });
    // [Assert] 검증
  });
});
