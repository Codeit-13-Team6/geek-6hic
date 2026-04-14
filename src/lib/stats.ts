import type {
  BasicProfileStats,
  CreatedMeetingSummary,
  GetMeetingsResponse,
  Meeting,
  MeetingResponse,
  MyMeetingsPageResponse,
  ParticipantStats,
} from "@/types";
import { getMyMeetings } from "@/api/server/favorites";
import { getMyPostsServer } from "@/api/server/posts";
import { getMeetingsCursorPageForStats } from "@/api/server/stats";
import {
  getUserMeetingsPageServer,
  getUserPostsPageServer,
} from "@/api/server/users";

type ParticipantMeeting = Pick<Meeting, "type" | "participantCount">;
const MEETING_SCAN_SIZE = 100;

export function normalizeCreatedMeetingCategory(
  type?: string,
): CreatedMeetingSummary["category"] | null {
  const normalized = type?.trim().toLowerCase();

  if (normalized === "project" || type === "프로젝트") {
    return "PROJECT";
  }

  if (normalized === "study" || type === "스터디") {
    return "STUDY";
  }

  return null;
}

export function createEmptyParticipantStats(): ParticipantStats {
  return {
    team: 0,
    study: 0,
    project: 0,
    jobPrep: 0,
    etc: 0,
  };
}

export function accumulateParticipantStats(
  stats: ParticipantStats,
  meetings: ParticipantMeeting[],
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

export function isMeetingCreatedByUser(
  meeting: MeetingResponse,
  userId: number,
) {
  return (
    meeting.hostId === userId ||
    meeting.host?.id === userId ||
    meeting.createdBy === userId
  );
}

export function toBasicProfileStats({
  postCount,
  meetingCount,
  favoriteCount,
}: BasicProfileStats): BasicProfileStats {
  return {
    postCount,
    meetingCount,
    favoriteCount,
  };
}

export function extractCreatedMeetingSummaries(
  meetings: Array<Pick<Meeting, "type">>,
): CreatedMeetingSummary[] {
  return meetings.flatMap((meeting) => {
    const category = normalizeCreatedMeetingCategory(meeting.type);
    return category ? [{ category }] : [];
  });
}

export async function collectParticipantStatsFromOffsetPages(
  fetchPage: (params: {
    offset: number;
    limit: number;
  }) => Promise<MyMeetingsPageResponse>,
  pageSize: number,
): Promise<ParticipantStats> {
  const stats = createEmptyParticipantStats();
  let offset = 0;
  let totalCount = Number.POSITIVE_INFINITY;

  while (offset < totalCount) {
    const response = await fetchPage({
      offset,
      limit: pageSize,
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

export async function collectParticipantStatsFromCursorPages(
  fetchPage: (cursor?: string) => Promise<GetMeetingsResponse>,
  userId: number,
): Promise<ParticipantStats> {
  const stats = createEmptyParticipantStats();
  let cursor: string | undefined;
  const seenCursors = new Set<string>();

  while (true) {
    const data = await fetchPage(cursor);
    const filteredMeetings = data.data.filter((meeting) =>
      isMeetingCreatedByUser(meeting, userId),
    );

    accumulateParticipantStats(stats, filteredMeetings);

    if (!data.hasMore || !data.nextCursor || seenCursors.has(data.nextCursor)) {
      break;
    }

    seenCursors.add(data.nextCursor);
    cursor = data.nextCursor;
  }

  return stats;
}

export async function collectCreatedMeetingsFromOffsetPages(
  fetchPage: (params: {
    offset: number;
    limit: number;
  }) => Promise<MyMeetingsPageResponse>,
  pageSize: number,
): Promise<CreatedMeetingSummary[]> {
  const createdMeetings: CreatedMeetingSummary[] = [];
  let offset = 0;
  let totalCount = Number.POSITIVE_INFINITY;

  while (offset < totalCount) {
    const response = await fetchPage({
      offset,
      limit: pageSize,
    });

    createdMeetings.push(...extractCreatedMeetingSummaries(response.data));

    totalCount = response.totalCount;
    offset += response.limit;

    if (response.data.length === 0) {
      break;
    }
  }

  return createdMeetings;
}

export async function collectCreatedMeetingsFromCursorPages(
  fetchPage: (cursor?: string) => Promise<GetMeetingsResponse>,
  userId: number,
): Promise<CreatedMeetingSummary[]> {
  const createdMeetings: CreatedMeetingSummary[] = [];
  let cursor: string | undefined;
  const seenCursors = new Set<string>();

  while (true) {
    const data = await fetchPage(cursor);
    const filteredMeetings = data.data.filter((meeting) =>
      isMeetingCreatedByUser(meeting, userId),
    );

    createdMeetings.push(...extractCreatedMeetingSummaries(filteredMeetings));

    if (!data.hasMore || !data.nextCursor || seenCursors.has(data.nextCursor)) {
      break;
    }

    seenCursors.add(data.nextCursor);
    cursor = data.nextCursor;
  }

  return createdMeetings;
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

  return toBasicProfileStats({
    postCount: posts.totalCount,
    meetingCount: meetings.totalCount,
    favoriteCount: posts.totalLikeCount,
  });
}

export async function getDetailedParticipantStats({
  isOwnProfile,
  userId,
}: {
  isOwnProfile: boolean;
  userId: number;
}): Promise<ParticipantStats> {
  if (isOwnProfile) {
    return collectParticipantStatsFromOffsetPages(
      getMyMeetings,
      MEETING_SCAN_SIZE,
    );
  }

  return collectParticipantStatsFromCursorPages(
    (cursor) => getMeetingsCursorPageForStats(cursor, MEETING_SCAN_SIZE),
    userId,
  );
}

export async function getCreatedMeetingsByUser({
  isOwnProfile,
  userId,
}: {
  isOwnProfile: boolean;
  userId: number;
}): Promise<CreatedMeetingSummary[]> {
  if (isOwnProfile) {
    return collectCreatedMeetingsFromOffsetPages(
      getMyMeetings,
      MEETING_SCAN_SIZE,
    );
  }

  return collectCreatedMeetingsFromCursorPages(
    (cursor) => getMeetingsCursorPageForStats(cursor, MEETING_SCAN_SIZE),
    userId,
  );
}
