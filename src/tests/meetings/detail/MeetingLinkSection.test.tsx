import { render, screen } from "@testing-library/react";
import { MeetingLinkSection } from "@/app/meetings/[id]/_components/MeetingLinkSection";
// 이 테스트는 기능 동작 없이 전달된 링크가 화면에 렌더링되는지만 확인한다.

describe("MeetingLinkSection", () => {
  test("전달받은 링크가 화면에 보인다", () => {
    render(
      <MeetingLinkSection
        link="https://meet.example.com"
        canViewLink={true}
        isLoggedIn={true}
      />,
    );

    // 전달한 링크가 anchor 요소로 렌더링되는지만 확인한다.
    expect(
      screen.getByRole("link", { name: /https:\/\/meet\.example\.com/i }),
    ).toBeInTheDocument();
  });
});
