import { NextRequest, NextResponse } from "next/server";
import type { GetPostsResponse, LoungeSortBy } from "@/types";
import type { SortOrder } from "@/types";
import { fetchLoungePostsPage } from "@/lib/loungePosts";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor") || undefined;
    const size = Math.min(Number(searchParams.get("size") || 10), 50);
    const keyword = searchParams.get("keyword") || undefined;
    const sortBy = (searchParams.get("sortBy") || "createdAt") as LoungeSortBy;
    const sortOrder = (searchParams.get("sortOrder") || "desc") as SortOrder;

    const result = await fetchLoungePostsPage({
      cursor,
      size,
      keyword,
      sortBy,
      sortOrder,
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
