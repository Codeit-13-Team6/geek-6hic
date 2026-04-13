import type { BasicProfileStats, CreatedMeetingSummary } from "@/api/server";
import { deriveUserType } from "@/lib/userType";
import GradeCardSkeletonAnimated from "../../../../components/skeleton/GradeCardSkeletonAnimated";
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
    return <GradeCardSkeletonAnimated />;
  }

  const userType = deriveUserType({
    postCount: basicStats.postCount,
    meetingCount: basicStats.meetingCount,
    favoriteCount: basicStats.favoriteCount,
    createdMeetings,
  });

  return <GradeCard userType={userType} />;
}
