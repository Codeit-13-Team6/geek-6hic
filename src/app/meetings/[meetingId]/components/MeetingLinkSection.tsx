import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";

interface MeetingLinkSectionProps {
  data: MeetingDetailData;
}

export function MeetingLinkSection({ data }: MeetingLinkSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 링크</h2>
      <div className="rounded-[24px] border border-gray-100 bg-white px-8 py-5 shadow-sm">
        <a
          href={data.link}
          target="_blank"
          rel="noreferrer"
          className="block text-[16px] text-gray-700 transition hover:text-main-green-600"
        >
          {data.link}
        </a>
      </div>
    </section>
  );
}
