import { NextResponse } from "next/server";
import { serverAxios } from "@/lib/serverFetcher";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { filterThreadPosts } from "@/lib/postUtils";
import type { GetPostsResponse, MyPostsPageResponse, Post } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "10");

  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  try {
    const data = await getVisibleCursorPage<Post>({
      offset: safeOffset,
      limit: safeLimit,
      fetchPage: async ({ cursor, size }) => {
        const response = await serverAxios.get<GetPostsResponse>("/posts", {
          params: {
            keyword: "",
            sortBy: "createdAt",
            sortOrder: "desc",
            size,
            ...(cursor ? { cursor } : {}),
          },
        });

        return filterThreadPosts(response.data);
      },
      filter: (post) => post.author.id === userId,
    });

    return NextResponse.json<MyPostsPageResponse>(data);
  } catch (error) {
    console.error("[Visible User Posts BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch visible user posts" },
      { status: 500 },
    );
  }
}
