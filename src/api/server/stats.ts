import { serverAxios } from "@/lib/serverFetcher";
import { getMyMeetings } from "./favorites";
import { getMyPostsServer } from "./posts";
import { getUserMeetingsPageServer, getUserPostsPageServer } from "./users";
import type { GetMeetingsResponse, Meeting, MeetingResponse } from "@/types";

export interface ParticipantStats {
  team: number;
  study: number;
  project: number;
  jobPrep: number;
  etc: number;
}

export interface BasicProfileStats {
  postCount: number;
  meetingCount: number;
  favoriteCount: number;
}

const MEETING_SCAN_SIZE = 100;

function createEmptyParticipantStats(): ParticipantStats {
  return {
    team: 0,
    study: 0,
    project: 0,
    jobPrep: 0,
    etc: 0,
  };
}

function accumulateParticipantStats(
  stats: ParticipantStats,
  meetings: Array<Pick<Meeting, "type" | "participantCount">>,
) {
  meetings.forEach((meeting) => {
    switch (meeting.type) {
      case "팀미팅":
      case "team":
        stats.team += meeting.participantCount - 1;
        break;
      case "스터디":
      case "study":
        stats.study += meeting.participantCount - 1;
        break;
      case "프로젝트":
      case "project":
        stats.project += meeting.participantCount - 1;
        break;
      case "취준생":
      case "jobPrep":
        stats.jobPrep += meeting.participantCount - 1;
        break;
      default:
        stats.etc += meeting.participantCount - 1;
    }
  });
}

async function getOwnMeetingParticipantStats(): Promise<ParticipantStats> {
  const stats = createEmptyParticipantStats();
  let offset = 0;
  let totalCount = Number.POSITIVE_INFINITY;

  while (offset < totalCount) {
    const response = await getMyMeetings({
      offset,
      limit: MEETING_SCAN_SIZE,
    });

    accumulateParticipantStats(stats, response.data);

    totalCount = response.totalCount;
    offset += response.limit;

    if (response.data.length === 0) {
      break;
    }
  }

  return stats;
}

async function getUserMeetingParticipantStats(
  userId: number,
): Promise<ParticipantStats> {
  const stats = createEmptyParticipantStats();
  let cursor: string | undefined;
  let hasMore = true;
  const seenCursors = new Set<string>();

  while (hasMore) {
    const { data } = await serverAxios.get<GetMeetingsResponse>("/meetings", {
      params: {
        sortBy: "dateTime",
        sortOrder: "desc",
        size: MEETING_SCAN_SIZE,
        ...(cursor ? { cursor } : {}),
      },
    });

    const filteredMeetings = data.data.filter(
      (meeting: MeetingResponse) =>
        meeting.hostId === userId ||
        meeting.host?.id === userId ||
        meeting.createdBy === userId,
    );

    accumulateParticipantStats(stats, filteredMeetings);

    if (!data.hasMore || !data.nextCursor || seenCursors.has(data.nextCursor)) {
      break;
    }

    seenCursors.add(data.nextCursor);
    cursor = data.nextCursor;
    hasMore = data.hasMore;
  }

  return stats;
}

export async function getBasicProfileStats({
  isOwnProfile,
  userId,
}: {
  isOwnProfile: boolean;
  userId: number;
}): Promise<BasicProfileStats> {
  if (isOwnProfile) {
    const [meetings, posts] = await Promise.all([
      getMyMeetings({ offset: 0, limit: 1 }),
      getMyPostsServer({ offset: 0, limit: 1 }),
    ]);

    return {
      postCount: posts.totalCount,
      meetingCount: meetings.totalCount,
      favoriteCount: posts.totalLikeCount,
    };
  }

  const [meetings, posts] = await Promise.all([
    getUserMeetingsPageServer({ userId, offset: 0, limit: 1 }),
    getUserPostsPageServer({ userId, offset: 0, limit: 1 }),
  ]);

  return {
    postCount: posts.totalCount,
    meetingCount: meetings.totalCount,
    favoriteCount: posts.totalLikeCount,
  };
}

export async function getDetailedParticipantStats({
  isOwnProfile,
  userId,
}: {
  isOwnProfile: boolean;
  userId: number;
}): Promise<ParticipantStats> {
  if (isOwnProfile) {
    return getOwnMeetingParticipantStats();
  }

  return getUserMeetingParticipantStats(userId);
}
