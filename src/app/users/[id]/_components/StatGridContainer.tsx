import type { BasicProfileStats, ParticipantStats } from "@/api/server";
import StatGrid from "./StatGrid";

export default async function StatGridContainer({
  basicStatsPromise,
  participantStatsPromise,
}: {
  basicStatsPromise: Promise<BasicProfileStats>;
  participantStatsPromise: Promise<ParticipantStats>;
}) {
  const [basicStats, participantStats] = await Promise.all([
    basicStatsPromise,
    participantStatsPromise,
  ]);

  return (
    <StatGrid
      postCount={basicStats.postCount}
      meetingCount={basicStats.meetingCount}
      favoriteCount={basicStats.favoriteCount}
      participantStats={participantStats}
    />
  );
}
