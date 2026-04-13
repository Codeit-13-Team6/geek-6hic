import { NextResponse } from "next/server";
import { getHotPostsBFF } from "@/app/api/internal/hot";

export const revalidate = 600;

export async function GET() {
  try {
    const result = await getHotPostsBFF();
    return NextResponse.json(result ?? []);
  } catch (error: any) {
    console.error("Hot Posts BFF Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "핫 게시물을 불러오지 못했습니다.", detail: error.message },
      { status: 500 },
    );
  }
}
