import {
  meetingDetailMock,
  meetingDetailMocks,
} from "@/app/meetings/[meetingId]/mock";
import { MeetingDetailContent } from "@/app/meetings/[meetingId]/components/MeetingDetailContent";

const MOCK_CURRENT_TIMESTAMP = new Date("2026-03-20T12:00:00.000Z").getTime();

interface MeetingDetailPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  const { meetingId } = await params;
  const resolvedMeetingId = Number(meetingId);

  // meetingId가 있으면 해당 mock을, 없으면 기본 mock을 사용한다.
  const data = {
    ...(meetingDetailMocks[resolvedMeetingId] ?? meetingDetailMock),
    id: resolvedMeetingId || meetingDetailMock.id,
  };

  return (
    <main className="mx-auto flex w-full max-w-[375px] flex-col px-4 py-6 md:max-w-[744px] md:px-6 md:py-8 xl:max-w-[1280px] xl:px-0 xl:py-12">
      <MeetingDetailContent
        initialData={data}
        currentTimestamp={MOCK_CURRENT_TIMESTAMP}
      />
    </main>
  );
}
