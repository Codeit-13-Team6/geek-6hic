import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { MeetingHeaderSection } from "@/app/meetings/[id]/_components/MeetingHeaderSection";
import type { MeetingDetailApiData, MeetingParticipant } from "@/types";
// 이 테스트는 mock 데이터를 기준으로 헤더 영역의 제목, 참여자 정보, 버튼 렌더링만 확인한다.

// 렌더링만 확인하는 테스트이므로 외부 UI/상태 의존성은 mock 처리한다.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("lottie-react", () => ({
  __esModule: true,
  default: () => <div>lottie</div>,
}));

jest.mock("@/assets/icon/meatballs/meatballs-lg.svg", () => "meatballs-icon");
jest.mock("@/assets/lottie/check-anim.json", () => ({}));

jest.mock("@/app/meetings/_components/modal/EditMeetingModal", () => ({
  EditMeetingModal: () => null,
}));

jest.mock("@/components/modal/DeleteModal", () => ({
  DeleteModal: () => null,
}));

jest.mock("@/components/modal/ConfirmModal", () => ({
  ConfirmModal: () => null,
}));

jest.mock("@/components/modal/ModalBase", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/ui/Input", () => ({
  Input: () => null,
}));

jest.mock("@/components/img/FallbackImage", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

jest.mock("@/components/ui/HeartIcon", () => ({
  HeartIcon: () => <button type="button">favorite</button>,
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/Dropdown", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  DropdownMenuTrigger: ({ render }: { render: ReactNode }) => <>{render}</>,
}));

jest.mock("@/store/useLoginModalStore", () => ({
  useLoginModalStore: (
    selector: (state: {
      loginGuardAction: (fn: () => void) => void;
    }) => unknown,
  ) =>
    selector({
      loginGuardAction: (fn: () => void) => fn(),
    }),
}));

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: (selector: (state: { isAuthLoading: boolean }) => unknown) =>
    selector({
      isAuthLoading: false,
    }),
}));

jest.mock("@/app/meetings/[id]/_hooks/useMeetingDetail", () => ({
  useMeetingJoinMutations: () => ({
    isJoinPending: false,
    handleJoinMeeting: jest.fn(),
    handleCancelJoinMeeting: jest.fn(),
  }),
  useMeetingHostMutations: () => ({
    handleEditMeeting: jest.fn(),
    handleDeleteMeeting: jest.fn(),
  }),
  useMeetingAttendMutation: () => ({
    hasAttended: false,
    isCheckingAttendance: false,
    handleAttendMeeting: jest.fn(),
  }),
  useMeetingDetailFavoriteMutation: () => ({
    isFavoritePending: false,
    handleToggleFavorite: jest.fn(),
  }),
}));

jest.mock("@/lib/meetingSecret", () => ({
  extractSecretCode: () => "1234",
  isSecretMeeting: () => false,
  verifySecretCode: () => true,
}));

jest.mock("@/app/meetings/[id]/_lib/share", () => ({
  shareLink: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
  copyToClipboard: jest.fn(),
}));

// 헤더에 표시되는 제목, 참여자, 버튼 정보를 확인하기 위한 최소 목데이터이다.
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

describe("MeetingHeaderSection", () => {
  test("목데이터로 받은 헤더 정보가 화면에 보인다", () => {
    render(
      <MeetingHeaderSection
        meetingId={101}
        detail={mockDetail}
        participants={mockParticipants}
        isHost={false}
        isJoined={true}
        isLoggedIn={true}
      />,
    );

    // 모임 제목이 heading 요소로 렌더링되는지 확인한다.
    expect(
      screen.getByRole("heading", { name: "프론트엔드 스터디" }),
    ).toBeInTheDocument();

    // 참여 인원 텍스트는 중첩된 요소로 나뉠 수 있어 textContent 기준으로 확인한다.
    expect(
      screen.getAllByText((_, element) => {
        const text = element?.textContent?.replace(/\s/g, "") ?? "";
        return text.includes("2") && text.includes("/10");
      }).length,
    ).toBeGreaterThan(0);

    // 참여자 이름으로 만들어지는 프로필 alt 텍스트가 보이는지 확인한다.
    expect(screen.getByAltText(/호스트/)).toBeInTheDocument();
    expect(screen.getByAltText(/김코드/)).toBeInTheDocument();

    // 좋아요 액션은 단순 버튼으로 mock 했기 때문에 존재 여부만 확인한다.
    expect(
      screen.getByRole("button", { name: "favorite" }),
    ).toBeInTheDocument();
  });
});
