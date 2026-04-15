import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MeetingList from "@/components/features/list/MeetingList";
import * as meetingHooks from "@/hooks/queries/useMeetings";

// src/tests/meetingList.test.tsx 상단에 추가
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 1. 필요한 외부 모듈 모킹
jest.mock("@/hooks/queries/useMeetings");
// src/tests/meetingList.test.tsx 상단 수정

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  // 🔽 이 부분들이 추가되어야 useUrlQuery 에러가 해결됩니다.
  useSearchParams: () => ({
    get: jest.fn((key) => null), // 기본적으로 쿼리 파라미터가 없는 상태 반환
    getAll: jest.fn(),
    has: jest.fn(),
  }),
  usePathname: () => "/meetings",
}));

describe("MeetingList 무한 스크롤 동작 테스트", () => {
  // 테스트마다 독립적인 상태를 유지하기 위해 QueryClient 생성
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("사용자가 리스트 바닥에 도달하면 다음 데이터를 불러오는 함수(fetchNextPage)가 호출되어야 한다", async () => {
    // [Arrange] 준비
    // useGetMeetings 훅이 가짜 데이터와 함께 '다음 페이지가 있음'을 반환하도록 설정
    (meetingHooks.useGetMeetings as jest.Mock).mockReturnValue({
      meetingList: [
        { id: 1, title: "테스트 모임 1", participantCount: 0, capacity: 10 },
      ],
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      sortValue: "createdAt",
      favoriteQueryKey: ["meetings"],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MeetingList variant="all" />
      </QueryClientProvider>,
    );

    // [Act] 실행
    const trigger = document.querySelector(".h-40");
    if (!trigger) throw new Error("트리거 요소를 찾을 수 없습니다.");

    // IntersectionObserver가 호출될 때까지 잠시 기다렸다가 낚아챕니다.
    await waitFor(() => {
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    // 67번 줄: 좀 더 안전한 접근 방식
    const mockObserver = global.IntersectionObserver as jest.Mock;
    const callback = mockObserver.mock.calls[0][0]; // 첫 번째 호출의 첫 번째 인자(callback)

    // 실제로 사용자가 스크롤을 내려서 요소가 보인 것처럼 이벤트를 발생시킵니다.
    callback([{ isIntersecting: true, target: trigger }]);

    // [Assert] 검증
    // fetchNextPage가 비동기적으로 호출될 수 있으므로 waitFor로 기다립니다.
    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });
  });
});
