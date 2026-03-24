import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";

interface MeetingDescriptionSectionProps {
  data: MeetingDetailData;
}

export function MeetingDescriptionSection({
  data,
}: MeetingDescriptionSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 설명</h2>
      <div className="rounded-[24px] border border-gray-100 bg-white px-8 py-7 text-[16px] leading-[28px] text-gray-700 shadow-sm">
        {data.description}
      </div>
    </section>
  );
}
