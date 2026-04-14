import type { BasicProfileStats, CreatedMeetingSummary } from "@/types";
import { deriveUserType } from "@/lib/userType";
import GradeCardAnimated from "@/app/users/[id]/_components/GradeCardAnimated";
import GradeCard from "./GridCard";

interface GradeCardContainerProps {
  basicStatsPromise: Promise<BasicProfileStats>;
  createdMeetingsPromise: Promise<CreatedMeetingSummary[]>;
}

export default async function GradeCardContainer({
  basicStatsPromise,
  createdMeetingsPromise,
}: GradeCardContainerProps) {
  const [basicStats, createdMeetings] = await Promise.all([
    basicStatsPromise,
    createdMeetingsPromise,
  ]);

  const totalActivity = basicStats.postCount + basicStats.meetingCount;

  if (totalActivity === 0) {
    return <GradeCardAnimated />;
  }

  const userType = deriveUserType({
    postCount: basicStats.postCount,
    meetingCount: basicStats.meetingCount,
    favoriteCount: basicStats.favoriteCount,
    createdMeetings,
  });

  return <GradeCard userType={userType} />;
}
