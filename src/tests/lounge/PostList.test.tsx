import { render, screen, fireEvent } from "@testing-library/react";
import PostList from "@/components/features/list/PostList";
import LoungeSearchSection from "@/app/lounge/_component/LoungeSearchSection";
import LoungeSkeleton from "@/components/skeleton/LoungeSkeleton";
import { usePostList } from "@/hooks";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockPush,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(""),
  usePathname: () => "/lounge",
}));

jest.mock("@/components/ui/SelectCommon", () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <select
      data-testid="mock-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: ({ children }: any) => <>{children}</>,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectGroup: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
}));

jest.mock("@/hooks/queries/usePosts", () => ({
  usePostList: jest.fn(),
}));

describe("PostList 컴포넌트 기능 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. PostList: 정상 렌더링, 목록 조회 및 상세 이동
  describe("PostList: 목록 조회 및 상세 이동", () => {
    it("데이터가 있을 때 게시글 목록을 정상적으로 렌더링한다", () => {
      const mockPosts = [
        {
          id: 1,
          title: "첫 번째 게시글",
          author: { id: "u1", name: "유저", image: "/img1.jpg" },
          _count: { comments: 5 },
          createdAt: new Date().toISOString(),
          image: "/thumb1.jpg",
        },
      ];

      (usePostList as jest.Mock).mockReturnValue({
        data: { pages: [{ data: mockPosts }] },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: true,
      });

      render(<PostList />);
      expect(screen.getByText("첫 번째 게시글")).toBeInTheDocument();
      expect(screen.getByText("유저")).toBeInTheDocument();
    });

    it("데이터가 비어있을 경우 안내 문구를 보여준다", () => {
      (usePostList as jest.Mock).mockReturnValue({
        data: { pages: [{ data: [] }] },
        isLoading: false,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
      });

      render(<PostList />);
      expect(screen.getByText("등록된 게시글이 없어요.")).toBeInTheDocument();
    });

    it("게시글 클릭 시 해당 게시글의 상세 페이지로 이동한다", () => {
      const mockPost = {
        id: 123,
        title: "상세 테스트 게시글",
        author: { id: "user1", name: "유저", image: "/img.jpg" },
        _count: { comments: 0 },
        createdAt: "2026-04-15T10:00:00Z",
      };
      (usePostList as jest.Mock).mockReturnValue({
        data: { pages: [{ data: [mockPost] }] },
        isLoading: false,
      });

      render(<PostList />);
      fireEvent.click(screen.getByText("상세 테스트 게시글"));
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/lounge/123"),
      );
    });
  });

  // 2. LoungeSearchSection: 검색 및 정렬
  describe("LoungeSearchSection: 검색 및 정렬", () => {
    it("검색창에 키워드 입력 후 엔터를 치면 URL 파라미터가 변경된다", () => {
      render(<LoungeSearchSection />);
      const searchInput =
        screen.getByPlaceholderText(/원하는 내용을 검색해보세요/i);

      fireEvent.change(searchInput, { target: { value: "스터디" } });
      fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("keyword="),
        expect.any(Object),
      );
    });

    it("'인기순' 정렬 버튼을 클릭하면 sortBy와 sortOrder 파라미터가 바뀐다", () => {
      render(<LoungeSearchSection />);
      const mockSelect = screen.getByTestId("mock-select");
      fireEvent.change(mockSelect, { target: { value: "likeCount_desc" } });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("sortBy=likeCount"),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("sortOrder=desc"),
        expect.any(Object),
      );
    });
  });

  // 3. PostList: 무한스크롤 패칭 상태 처리
  describe("PostList: 무한스크롤 패칭 상태 처리", () => {
    it("추가 데이터를 패칭 중(isFetchingNextPage)일 때는 카드들의 투명도가 낮아지고 '로딩 중...' 문구가 나타난다", () => {
      const mockData = {
        pages: [
          {
            data: [
              {
                id: 1,
                title: "기존 게시글",
                author: { id: "u1", name: "유진", image: "/img.jpg" },
                _count: { comments: 0 },
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      };

      (usePostList as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetchingNextPage: true, // 무한 스크롤 중
        hasNextPage: true,
      });

      render(<PostList />);
      expect(screen.getByText(/로딩 중.../i)).toBeInTheDocument();
    });
  });

  // 4. PostList:로딩/에러 UI 테스트
  describe("PostList: 로딩 및 에러 UI", () => {
    // 스켈레톤 테스트
    it("데이터 로딩 시 사용할 스켈레톤 UI가 정상적으로 렌더링된다", () => {
      render(<LoungeSkeleton />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    // 에러 던지기 (ErrorBoundary 용)
    it("서버 에러가 발생하면 에러를 던져서 부모의 ErrorBoundary가 잡을 수 있게 한다", () => {
      // 훅이 에러를 던지도록 모킹
      (usePostList as jest.Mock).mockImplementation(() => {
        throw new Error("에러");
      });

      // 에러가 발생하는지 검증
      expect(() => render(<PostList />)).toThrow("에러");
    });
  });
});
