import type {
  BasicProfileStats,
  MeetingTypeStats,
  ParticipantStats,
} from "@/types";
import StatGrid from "./StatGrid";

export default async function StatGridContainer({
  basicStatsPromise,
  participantStatsPromise,
  meetingTypeStatsPromise,
}: {
  basicStatsPromise: Promise<BasicProfileStats>;
  participantStatsPromise: Promise<ParticipantStats>;
  meetingTypeStatsPromise: Promise<MeetingTypeStats>;
}) {
  const [basicStats, participantStats, meetingTypeStats] = await Promise.all([
    basicStatsPromise,
    participantStatsPromise,
    meetingTypeStatsPromise,
  ]);

  return (
    <StatGrid
      postCount={basicStats.postCount}
      meetingCount={basicStats.meetingCount}
      favoriteCount={basicStats.favoriteCount}
      participantStats={participantStats}
      meetingTypeStats={meetingTypeStats}
    />
  );
}
