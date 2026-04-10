import { serverAxios } from "@/lib/serverFetcher";
import { NextResponse } from "next/server";
import { CursorResponse } from "@/types";
import { fetchAllCursor } from "@/lib/fetchAllCursor";

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

interface AxiosErrorLike {
  response?: { data?: unknown; status?: number };
  message: string;
}

export async function GET() {
  try {
    // 1. 전체 meetings cursor pagination 수집
    // meeting 수집이 현재 api 스펙 상의 제한으로 인해 체인형식으로 진행
    // 미리 준비한 미팅맵에 값들을 바인딩하는 형태
    const meetingMap: MeetingRankMap = {};

    const meetings = await fetchAllCursor<MeetingItem>({
      fetchPage: (cursor) =>
        serverAxios
          .get<CursorResponse<MeetingItem>>("/meetings", { params: { cursor } })
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

    // 2. 전체 reviews cursor pagination 수집 후 meetingMap에 반영
    // 마찬가지로 체인형식으로 진행

    // 모임과 연결된 게시물 양식 , 댓글 출석체크용 양식
    // 'isThread_1332'
    // 'onlyScore_3'

    await Promise.all(
      Object.entries(meetingMap).map(async ([, meeting]) => {
        if (!meeting.linkPostId) return;

        try {
          const comments = await fetchAllCursor<CommentItem>({
            fetchPage: (cursor) =>
              serverAxios
                .get<CursorResponse<CommentItem>>(
                  `/posts/${meeting.linkPostId}/comments`,
                  { params: { cursor } },
                )
                .then((r) => r.data),
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

    // 3. 랭킹 점수 계산 후 정렬
    const rankedList = Object.entries(meetingMap)
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

    return NextResponse.json(rankedList);
  } catch (err) {
    const error = err as AxiosErrorLike;
    console.error("Ranking BFF Error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data ?? { message: "랭킹 데이터를 불러오지 못했습니다." },
      { status: error.response?.status ?? 500 },
    );
  }
}
