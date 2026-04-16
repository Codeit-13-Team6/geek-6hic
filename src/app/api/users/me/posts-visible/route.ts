import { NextResponse } from "next/server";
import { getMyPostsBFF } from "@/bff/users";
import type { VisiblePostsPageResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const data = await getMyPostsBFF({
      offset: Number(searchParams.get("offset")) || undefined,
      limit: Number(searchParams.get("limit")) || undefined,
    });

    return NextResponse.json<VisiblePostsPageResponse>(data);
  } catch (error) {
    console.error("[Visible My Posts BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch visible my posts" },
      { status: 500 },
    );
  }
}
