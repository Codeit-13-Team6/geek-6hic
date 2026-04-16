import type {
  BasicProfileStats,
  MeetingTypeStats,
  ParticipantStats,
} from "@/shared/types";
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
    basicStatsPromise.catch((err) => {
      console.error("기본 통계 실패:", err);
      return { postCount: 0, meetingCount: 0, favoriteCount: 0 };
    }),
    participantStatsPromise.catch((err) => {
      console.error("참여자 통계 실패:", err);
      return { team: 0, study: 0, project: 0, jobPrep: 0, etc: 0 };
    }),
    meetingTypeStatsPromise.catch((err) => {
      console.error("모임 타입 통계 실패:", err);
      return { team: 0, study: 0, project: 0, jobPrep: 0, etc: 0 };
    }),
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
