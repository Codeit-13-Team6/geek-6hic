import { MeetingDescriptionSection } from "@/app/meetings/[meetingId]/components/MeetingDescriptionSection";
import { MeetingHeaderSection } from "@/app/meetings/[meetingId]/components/MeetingHeaderSection";
import { MeetingLinkSection } from "@/app/meetings/[meetingId]/components/MeetingLinkSection";
import { MeetingThreadSection } from "@/app/meetings/[meetingId]/components/MeetingThreadSection";
import { RecommendedMeetingsSection } from "@/app/meetings/[meetingId]/components/RecommendedMeetingsSection";
import { meetingDetailMock } from "@/app/meetings/[meetingId]/mock";

const MOCK_CURRENT_TIMESTAMP = new Date("2026-03-20T12:00:00.000Z").getTime();

export default function MeetingDetailPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-16 px-6 py-12 xl:px-0">
      <MeetingHeaderSection
        data={meetingDetailMock}
        currentTimestamp={MOCK_CURRENT_TIMESTAMP}
      />
      <MeetingDescriptionSection data={meetingDetailMock} />
      <MeetingLinkSection data={meetingDetailMock} />
      <MeetingThreadSection data={meetingDetailMock} />
      <RecommendedMeetingsSection data={meetingDetailMock} />
    </main>
  );
}
