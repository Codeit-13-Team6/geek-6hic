import { NextResponse } from "next/server";
import { serverAxios } from "@/lib/serverFetcher";
import { getVisibleMyPostsPage } from "@/lib/myVisiblePosts";
import type { GetPostsResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "20");

  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;

  try {
    const data = await getVisibleMyPostsPage(
      {
        offset: safeOffset,
        limit: safeLimit,
      },
      async ({ offset: pageOffset, limit: pageLimit }) => {
        const response = await serverAxios.get<GetPostsResponse>(
          "/users/me/posts",
          {
            params: {
              sortBy: "createdAt",
              sortOrder: "desc",
              offset: pageOffset,
              limit: pageLimit,
            },
          },
        );

        return response.data;
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Visible My Posts BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch visible my posts" },
      { status: 500 },
    );
  }
}
