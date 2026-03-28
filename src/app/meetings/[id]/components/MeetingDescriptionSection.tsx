import { MeetingDescriptionSectionProps } from "@/types";

export function MeetingDescriptionSection({
  data,
}: MeetingDescriptionSectionProps) {
  return (
    <section className="w-full space-y-3 md:space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 설명</h2>
      <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-6 text-[15px] leading-[26px] text-gray-700 shadow-sm md:rounded-[24px] md:px-8 md:py-7 md:text-[16px] md:leading-[28px] xl:rounded-[32px]">
        {data.description}
      </div>
    </section>
  );
}
