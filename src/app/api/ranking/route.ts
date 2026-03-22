import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type MeetingRankData = {
  commentLeng: number;
  checkScore: number;
  totalUserLeng: number;
  commentingUserList: string[];
  rankScore: number;
  meetName: string;
  meetType: string;
};

type MeetingRankMap = Record<number, MeetingRankData>;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  try {
    // 1. 전체 meetings cursor pagination 수집
    // meeting 수집이 현재 api 스펙 상의 제한으로 인해 체인형식으로 진행
    // 미리 준비한 미팅맵에 값들을 바인딩하는 형태
    const meetingMap: MeetingRankMap = {};
    let cursor: number | undefined = undefined;

    while (true) {
      const params = cursor ? { cursor } : {};
      const { data: meetRes } = await axios.get(`${API_BASE_URL}/meetings`, {
        headers,
        params,
      });

      meetRes.data.forEach((item: any) => {
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
      const params = cursor ? { cursor } : {};
      const { data: reviewRes } = await axios.get(`${API_BASE_URL}/reviews`, {
        headers,
        params,
      });

      reviewRes.data.forEach((item: any) => {
        if (Object.prototype.hasOwnProperty.call(meetingMap, item.meeting.id)) {
          const meeting = meetingMap[item.meeting.id];
          meeting.commentingUserList = [...meeting.commentingUserList, item.userId];
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
  } catch (error: any) {
    console.error("Ranking BFF Error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data ?? { message: "랭킹 데이터를 불러오지 못했습니다." },
      { status: error.response?.status ?? 500 },
    );
  }
}
