import { MeetingDetailData } from "@/app/meetings/[id]/types";

interface MeetingDescriptionSectionProps {
  data: MeetingDetailData;
}

export function MeetingDescriptionSection({
  data,
}: MeetingDescriptionSectionProps) {
  return (
    <section className="w-full space-y-3 sm:space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 설명</h2>
      <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-6 text-[15px] leading-[26px] text-gray-700 shadow-sm sm:rounded-[24px] sm:px-8 sm:py-7 sm:text-[16px] sm:leading-[28px] lg:rounded-[32px]">
        {data.description}
      </div>
    </section>
  );
}
