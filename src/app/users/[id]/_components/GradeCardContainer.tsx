import type { BasicProfileStats, CreatedMeetingSummary } from "@/api/server";
import GradeCard from "./GridCard";
import { deriveUserType } from "./gradeType";

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

  const userType = deriveUserType({
    postCount: basicStats.postCount,
    meetingCount: basicStats.meetingCount,
    favoriteCount: basicStats.favoriteCount,
    createdMeetings,
  });

  return <GradeCard userType={userType} />;
}
