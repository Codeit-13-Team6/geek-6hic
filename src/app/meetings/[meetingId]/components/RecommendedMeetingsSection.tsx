import Image from "next/image";
import Link from "next/link";

import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";
import { TagCommon } from "@/components/ui/TagCommon";

const formatMonthDay = (value: string) => {
  const date = new Date(value);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatHourMinute = (value: string) => {
  const date = new Date(value);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

interface RecommendedMeetingsSectionProps {
  data: MeetingDetailData;
}

export function RecommendedMeetingsSection({
  data,
}: RecommendedMeetingsSectionProps) {
  if (data.recommendedMeetings.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-5 md:space-y-6">
      <h2 className="text-[24px] font-semibold text-gray-900">
        이런 모임은 어때요?
      </h2>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {data.recommendedMeetings.map((meeting) => (
          <Link
            key={meeting.id}
            href={`/meetings/${meeting.id}`}
            className="group overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:rounded-[24px]"
          >
            {meeting.image ? (
              <Image
                src={meeting.image}
                alt={meeting.name}
                width={320}
                height={168}
                className="h-[168px] w-full object-cover"
              />
            ) : (
              <div className="h-[168px] w-full bg-gray-100" />
            )}

            <div className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2">
                <TagCommon variant="blue">
                  {formatMonthDay(meeting.registrationEnd)} 마감
                </TagCommon>
                <TagCommon variant="white">
                  {formatHourMinute(meeting.dateTime)}
                </TagCommon>
              </div>

              <h3 className="line-clamp-2 text-[18px] font-semibold text-gray-900">
                {meeting.name}
              </h3>

              <p className="text-sm text-gray-500">
                {meeting.participantCount}/{meeting.capacity}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
