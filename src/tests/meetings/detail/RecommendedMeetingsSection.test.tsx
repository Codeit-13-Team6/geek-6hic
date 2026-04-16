import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { RecommendedMeetingsSection } from "@/app/meetings/[id]/_components/RecommendedMeetingsSection";
import { useMeetingRecommendationsQuery } from "@/app/meetings/[id]/_hooks/useMeetingDetail";
import { RecommendedMeetingItem } from "@/types";
// 이 테스트는 추천 데이터가 들어왔을 때 추천 모임 링크가 화면에 보이는지만 확인한다.

// 추천 모임이 화면에 렌더링되는지 확인하기 위한 목데이터이다.
const mockRecommendations: RecommendedMeetingItem[] = [
  {
    id: 201,
    name: "추천 모임 A",
    image: null,
    participantCount: 3,
    capacity: 10,
    registrationEnd: "2099-12-30T12:00:00.000Z",
    dateTime: "2099-12-31T12:00:00.000Z",
  },
];

jest.mock("@/app/meetings/[id]/_hooks/useMeetingDetail", () => ({
  useMeetingRecommendationsQuery: jest.fn(),
}));

jest.mock("@/hooks/useDragScroll", () => ({
  useDragScroll: () => ({ dragProps: {} }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/img/FallbackImage", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("RecommendedMeetingsSection", () => {
  test("추천 모임 이름이 링크로 보인다", () => {
    // 실제 조회 대신 mock 데이터를 반환하도록 설정한다.
    (useMeetingRecommendationsQuery as jest.Mock).mockReturnValue({
      data: mockRecommendations,
      isPending: false,
    });

    render(
      <RecommendedMeetingsSection meetingId={101} meetingType="frontend" />,
    );

    // 추천 모임 이름이 링크 형태로 보이는지 확인한다.
    expect(
      screen.getByRole("link", { name: /추천 모임 A/ }),
    ).toBeInTheDocument();
  });
});
