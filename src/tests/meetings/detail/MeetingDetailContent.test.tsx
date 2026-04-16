import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MeetingDetailContent } from "@/app/meetings/[id]/_components/MeetingDetailContent";
import { useMeetingDetailQueries } from "@/hooks";
import { useAuthStore } from "@/store/useAuthStore";
import { MeetingDetailApiData, MeetingParticipant } from "@/types";
// 이 테스트는 상세 설명과 하위 섹션이 화면에 렌더링되는지만 확인한다.

// 상세 뷰 테스트에 필요한 목데이터를 이 파일 안에 함께 둔다.
const mockParticipants: MeetingParticipant[] = [
  {
    id: 1,
    teamId: "team-1",
    meetingId: 101,
    userId: 1,
    joinedAt: "2026-04-01T00:00:00.000Z",
    user: {
      id: 1,
      name: "호스트",
      image: null,
    },
  },
  {
    id: 2,
    teamId: "team-1",
    meetingId: 101,
    userId: 2,
    joinedAt: "2026-04-01T00:00:00.000Z",
    user: {
      id: 2,
      name: "김코드",
      image: null,
    },
  },
];

const mockDetail: MeetingDetailApiData = {
  id: 101,
  teamId: "team-1",
  name: "프론트엔드 스터디",
  type: "frontend",
  region: "1",
  address: "https://meet.example.com",
  latitude: 0,
  longitude: 0,
  dateTime: "2099-12-31T12:00:00.000Z",
  registrationEnd: "2099-12-30T12:00:00.000Z",
  capacity: 10,
  image: null,
  description: "테스트용 모임입니다.",
  participantCount: 2,
  canceledAt: null,
  confirmedAt: null,
  hostId: 1,
  createdBy: 1,
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
  host: {
    id: 1,
    name: "호스트",
    image: null,
  },
  isFavorited: false,
  isCompleted: false,
  isJoined: true,
};

jest.mock("@/hooks", () => ({
  useMeetingDetailQueries: jest.fn(),
}));

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

// 이 테스트는 컨테이너 렌더링과 데이터 전달만 보기 위해 하위 섹션을 mock 처리한다.
jest.mock("next/dist/client/components/error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("@/app/meetings/[id]/_components/MeetingHeaderSection", () => ({
  MeetingHeaderSection: ({ detail }: { detail: { name: string } }) => (
    <h1>{detail.name}</h1>
  ),
}));

jest.mock("@/app/meetings/[id]/_components/MeetingLinkSection", () => ({
  MeetingLinkSection: ({ link }: { link: string }) => <a href={link}>{link}</a>,
}));

jest.mock("@/app/meetings/[id]/_components/MeetingThreadSection", () => ({
  MeetingThreadSection: () => <div>thread-section</div>,
}));

jest.mock("@/app/meetings/[id]/_components/RecommendedMeetingsSection", () => ({
  RecommendedMeetingsSection: () => <div>recommended-section</div>,
}));

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockedUseMeetingDetailQueries =
  useMeetingDetailQueries as jest.MockedFunction<
    typeof useMeetingDetailQueries
  >;

describe("MeetingDetailContent", () => {
  test("상세 설명과 하위 섹션이 보인다", () => {
    // 실제 API나 스토어 없이도 렌더링되도록 고정된 값을 주입한다.
    mockedUseAuthStore.mockReturnValue({ id: 1 } as never);

    mockedUseMeetingDetailQueries.mockReturnValue({
      detailQuery: { data: mockDetail },
      participantsQuery: { data: { data: mockParticipants } },
    } as never);

    render(<MeetingDetailContent meetingId={101} />);

    // 상세 설명과 하위 섹션들이 함께 렌더링되는지 확인한다.
    expect(
      screen.getByRole("heading", { name: "프론트엔드 스터디" }),
    ).toBeInTheDocument();
    expect(screen.getByText("테스트용 모임입니다.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "https://meet.example.com" }),
    ).toBeInTheDocument();
    expect(screen.getByText("thread-section")).toBeInTheDocument();
    expect(screen.getByText("recommended-section")).toBeInTheDocument();
  });
});
