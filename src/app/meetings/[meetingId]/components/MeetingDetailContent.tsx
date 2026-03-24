"use client";

import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";
import { MeetingDescriptionSection } from "@/app/meetings/[meetingId]/components/MeetingDescriptionSection";
import { MeetingHeaderSection } from "@/app/meetings/[meetingId]/components/MeetingHeaderSection";
import { MeetingLinkSection } from "@/app/meetings/[meetingId]/components/MeetingLinkSection";
import { MeetingThreadSection } from "@/app/meetings/[meetingId]/components/MeetingThreadSection";
import { RecommendedMeetingsSection } from "@/app/meetings/[meetingId]/components/RecommendedMeetingsSection";

interface MeetingDetailContentProps {
  initialData: MeetingDetailData;
  currentTimestamp: number;
}

export function MeetingDetailContent({
  initialData,
  currentTimestamp,
}: MeetingDetailContentProps) {
  return (
    <>
      <MeetingHeaderSection
        data={initialData}
        currentTimestamp={currentTimestamp}
      />
      <MeetingDescriptionSection data={initialData} />
      <MeetingLinkSection data={initialData} />
      <MeetingThreadSection data={initialData} />
      <RecommendedMeetingsSection data={initialData} />
    </>
  );
}
