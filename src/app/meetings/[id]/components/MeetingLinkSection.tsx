import { MeetingLinkSectionProps } from "@/types";

export function MeetingLinkSection({
  link,
  canViewLink,
  guideText,
}: MeetingLinkSectionProps) {
  return (
    <section className="w-full space-y-3 md:space-y-4">
      <h2 className="text-[24px] font-semibold text-gray-900">모임 링크</h2>
      <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-5 shadow-sm md:rounded-[24px] md:px-8 xl:rounded-[32px]">
        <a
          href={canViewLink ? link : undefined}
          target="_blank"
          rel="noreferrer"
          className={`block text-[16px] text-gray-700 transition ${
            canViewLink
              ? "hover:text-main-green-600"
              : "pointer-events-none blur-[6px] select-none"
          }`}
        >
          {link}
        </a>
        {!canViewLink ? (
          <p className="mt-2 text-sm text-gray-500 md:text-[15px]">
            {guideText}
          </p>
        ) : null}
      </div>
    </section>
  );
}
