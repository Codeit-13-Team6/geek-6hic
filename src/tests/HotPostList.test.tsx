import { render, screen, fireEvent } from "@testing-library/react";
import { useGetHotPosts } from "../hooks/queries/usePosts";
import HotPostList from "@/app/lounge/_component/HotPostList";
import HotPostListSkeleton from "@/components/skeleton/HotPostListSkeleton";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: jest.fn(),
  }),
}));

jest.mock("../hooks/queries/usePosts", () => ({
  useGetHotPosts: jest.fn(),
}));

describe("HotPostList 컴포넌트 기능 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("HotPostList: 목록 조회 및 상세 이동", () => {
    // 1. 정상 렌더링
    it("핫 게시물 데이터가 성공적으로 렌더링된다", () => {
      const mockHotPosts = [
        {
          id: 99,
          title: "핫 게시글 1",
          author: { name: "유저1" },
          _count: { comments: 10 },
        },
        {
          id: 100,
          title: "핫 게시글 2",
          author: { name: "유저2" },
          _count: { comments: 5 },
        },
      ];

      (useGetHotPosts as jest.Mock).mockReturnValue({
        data: mockHotPosts,
      });

      render(<HotPostList />);

      expect(screen.getByText("핫 게시글 1")).toBeInTheDocument();
      expect(screen.getByText("핫 게시글 2")).toBeInTheDocument();
    });

    // 2. 상세 이동
    it("핫 게시물을 클릭하면 상세 페이지로 이동한다", () => {
      const mockHotPosts = [
        {
          id: 99,
          title: "상세 테스트 핫 게시글",
          author: { name: "유저" },
          _count: { comments: 0 },
        },
      ];

      (useGetHotPosts as jest.Mock).mockReturnValue({
        data: mockHotPosts,
      });

      render(<HotPostList />);

      const hotPostCard = screen.getByText("상세 테스트 핫 게시글");
      fireEvent.click(hotPostCard);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/lounge/99"),
      );
    });

    // 3. 데이터 없을 시
    it("핫 게시물이 없을 경우 안내 문구를 렌더링하고 게시글 카드는 보여주지 않는다", () => {
      (useGetHotPosts as jest.Mock).mockReturnValue({
        data: [],
      });

      render(<HotPostList />);

      // 카드 요소가 없는지 확인
      expect(screen.queryByRole("article")).not.toBeInTheDocument();

      // 안내 문구가 화면에 나타나는지 확인
      expect(
        screen.getByText("이번주의 HOT 게시물이 없습니다."),
      ).toBeInTheDocument();
    });
  });

  describe("HotPostList: 로딩 및 에러 UI", () => {
    // 1. 스켈레톤 테스트 (로딩)
    it("로딩 중일 때 표시될 스켈레톤 UI가 정상적으로 렌더링된다", () => {
      render(<HotPostListSkeleton />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/인기글을 불러오는 중/i)).toBeInTheDocument();
    });

    // 2. 에러 테스트 (ErrorBoundary 용)
    it("데이터 패칭 실패 시 에러를 던져야 한다", () => {
      (useGetHotPosts as jest.Mock).mockImplementation(() => {
        throw new Error("서버 에러");
      });

      // ErrorBoundary가 잡을 수 있도록 에러를 던지는지 확인
      expect(() => render(<HotPostList />)).toThrow("서버 에러");
    });
  });
});
