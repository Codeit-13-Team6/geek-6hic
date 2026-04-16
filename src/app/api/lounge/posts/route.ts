import { NextRequest, NextResponse } from "next/server";
import type { GetPostsResponse, LoungeSortBy, SortOrder } from "@/types";
import { getLoungePostsPageBFF } from "@/bff/lounge";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await getLoungePostsPageBFF({
      cursor: searchParams.get("cursor") || undefined,
      size: Number(searchParams.get("size")) || undefined,
      keyword: searchParams.get("keyword") || undefined,
      sortBy: (searchParams.get("sortBy") || undefined) as LoungeSortBy | undefined,
      sortOrder: (searchParams.get("sortOrder") || undefined) as SortOrder | undefined,
    });

    return NextResponse.json(result satisfies GetPostsResponse);
  } catch (error: any) {
    console.error("Lounge Posts BFF Error:", error.message);
    return NextResponse.json(
      { error: "게시글을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
