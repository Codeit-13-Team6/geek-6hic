import { serverAxios } from "@/lib/server-fetcher";
import { NextResponse } from "next/server";

interface MeetingRankData {
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
}

type MeetingRankMap = Record<number, MeetingRankData>;

interface MeetingItem {
  id: number;
  participantCount: number;
  type: string;
  name: string;
}

interface ReviewItem {
  meeting: { id: number };
  userId: string;
  score: number;
}

interface CursorResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor: string;
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
    let cursor: string | undefined = undefined;

    while (true) {
      const { data: meetRes }: { data: CursorResponse<MeetingItem> } =
        await serverAxios.get("/meetings", { params: { cursor } });

      meetRes.data.forEach((item) => {
        meetingMap[item.id] = {
          totalUserLeng: item.participantCount,
          commentLeng: 0,
          checkScore: 0,
          commentingUserList: [],
          meetType: item.type,
          meetName: item.name,
          rankScore: 0,
        };
      });

      if (!meetRes.hasMore) break;
      cursor = meetRes.nextCursor;
    }

    // 2. 전체 reviews cursor pagination 수집 후 meetingMap에 반영
    // 마찬가지로 체인형식으로 진행
    cursor = undefined;

    while (true) {
      const { data: reviewRes }: { data: CursorResponse<ReviewItem> } =
        await serverAxios.get("/reviews", { params: { cursor } });

      reviewRes.data.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(meetingMap, item.meeting.id)) {
          const meeting = meetingMap[item.meeting.id];
          meeting.commentingUserList = [
            ...meeting.commentingUserList,
            item.userId,
          ];
          meeting.commentLeng += 1;
          meeting.checkScore += item.score;
        }
      });

      if (!reviewRes.hasMore) break;
      cursor = reviewRes.nextCursor;
    }

    // 3. 랭킹 점수 계산 후 정렬
    const rankedList = Object.entries(meetingMap)
      .map(([id, data]) => ({
        id: Number(id),
        ...data,
        rankScore:
          data.commentLeng * 3 +
          data.checkScore +
          data.commentingUserList.length * 30,
      }))
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
