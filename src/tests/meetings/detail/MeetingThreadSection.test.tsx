import { render, screen } from "@testing-library/react";
import { MeetingThreadSection } from "@/app/meetings/[id]/_components/MeetingThreadSection";
import { useMeetingThread } from "@/hooks/queries/useThread";
// 이 테스트는 실제 스레드 생성/조회 로직이 아니라 스레드 영역의 렌더링만 확인한다.

// 실제 스레드 훅을 mock 처리해서 렌더링 결과만 확인한다.
jest.mock("@/hooks/queries/useThread", () => ({
  useMeetingThread: jest.fn(),
}));

jest.mock("@/components/features/comment/CommentSection", () => ({
  __esModule: true,
  default: ({ postId }: { postId: number }) => (
    <div>thread-comments-{postId}</div>
  ),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("MeetingThreadSection", () => {
  test("스레드 댓글 영역이 보인다", () => {
    // 스레드 글이 이미 존재하는 상황을 가정한다.
    (useMeetingThread as jest.Mock).mockReturnValue({
      threadPost: {
        id: 301,
        _count: { comments: 0 },
      },
      isPostLoading: false,
      hasComments: false,
    });

    render(
      <MeetingThreadSection
        meetingId={101}
        canWriteThread={true}
        isLoggedIn={true}
      />,
    );

    // mock 된 댓글 컴포넌트가 보이면 스레드 영역이 렌더링된 것으로 본다.
    expect(screen.getByText("thread-comments-301")).toBeInTheDocument();
  });
});
