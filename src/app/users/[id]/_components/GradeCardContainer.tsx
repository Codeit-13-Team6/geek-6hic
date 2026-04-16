import type { BasicProfileStats, CreatedMeetingSummary } from "@/shared/types";
import { deriveUserType } from "@/app/users/[id]/_lib/userType";
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

  return (
    <>
      <div className="mb-3 flex items-center gap-3 px-1 lg:mt-5">
        <div className="h-4 w-[2px] rounded-full bg-slate-950/20" />
        <h2 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">
          Garden
        </h2>
      </div>
      {totalActivity === 0 ? (
        <GradeCardAnimated />
      ) : (
        <GradeCard userType={userType} />
      )}
    </>
  );
}
