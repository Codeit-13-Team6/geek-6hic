import { serverFetch } from "@/lib/auth/fetcher.server";
import { CursorResponse } from "@/types";
import { fetchAllCursor } from "@/lib";

interface MeetingRankData {
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
  linkPostId: number;
  image?: string;
}

type MeetingRankMap = Record<number, MeetingRankData>;

interface MeetingItem {
  id: number;
  participantCount: number;
  type: string;
  name: string;
  latitude: number;
  region: string;
  image?: string;
}

interface CommentItem {
  meeting: { id: number };
  authorId: string;
  content: string;
}

export async function getRankingBFF() {
  const meetingMap: MeetingRankMap = {};

  const meetings = await fetchAllCursor<MeetingItem>({
    fetchPage: (cursor) =>
      serverFetch<CursorResponse<MeetingItem>>({ method: "GET", url: "/meetings", params: { cursor } })
        .then((r) => r.data),
  });

  meetings.forEach((item) => {
    meetingMap[item.id] = {
      totalUserLeng: item.participantCount,
      commentLeng: 0,
      checkScore: 0,
      commentingUserList: [],
      meetType: item.type,
      meetName: item.name,
      image: item.image,
      rankScore: 0,
      linkPostId: Number(item.region),
    };
  });

  await Promise.all(
    Object.entries(meetingMap).map(async ([, meeting]) => {
      if (!meeting.linkPostId) return;

      try {
        const comments = await fetchAllCursor<CommentItem>({
          fetchPage: (cursor) =>
            serverFetch<CursorResponse<CommentItem>>({
              method: "GET",
              url: `/posts/${meeting.linkPostId}/comments`,
              params: { cursor },
            }).then((r) => r.data),
        });

        for (const item of comments) {
          if (item.content.startsWith("onlyScore_")) {
            meeting.checkScore += Number(item.content.split("_")[2]);
          } else {
            meeting.commentLeng += 1;
            if (!meeting.commentingUserList.includes(item.authorId)) {
              meeting.commentingUserList.push(item.authorId);
            }
          }
        }
      } catch {
        // 존재하지 않는 postId → 스킵
      }
    }),
  );

  return Object.entries(meetingMap)
    .map(([id, data]) => {
      const commentScore = data.commentLeng * 3;
      const userScore = data.commentingUserList.length * 30;
      const rankScore = commentScore + data.checkScore + userScore;

      return {
        id: Number(id),
        ...data,
        rankScore,
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore);
}
