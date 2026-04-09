import { serverAxios } from "@/lib/serverFetcher";
import { NextResponse } from "next/server";
import type { JoinedMeetingsResponse } from "@/types";

interface AxiosErrorLike {
  response?: { data?: unknown; status?: number };
  message: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const { data, status } = await serverAxios.get<JoinedMeetingsResponse>(
      "/meetings",
      {
        params: Object.fromEntries(searchParams),
      },
    );

    return NextResponse.json(data, { status });
  } catch (err) {
    const error = err as AxiosErrorLike;
    console.error(
      "Meetings BFF Error:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      error.response?.data ?? { message: "모임 데이터를 불러오지 못했습니다." },
      { status: error.response?.status ?? 500 },
    );
  }
}