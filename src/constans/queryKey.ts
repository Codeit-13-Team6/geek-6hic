export const QUERY_KEYS = {
  favorites: {
    root: ["favorite"] as const,
  },
  posts: {
    root: ["posts"] as const, // 하위애들까지 전부 초기화
    my: ["posts", "my"] as const,
    hot: ["posts", "hot"] as const,
    list: ["posts", "list"] as const,
    listParams: (params: {
      keyword: string;
      sortBy: "createdAt" | "likeCount" | "commentCount";
      sortOrder: "desc" | "asc";
    }) => ["posts", "list", params] as const,
    detail: (postId: number | string) => [
      "posts",
      "detail",
      `${String(postId)}`,
    ],
  },
  meetings: {
    root: ["meetings"] as const,
    my: ["meetings", "my"] as const,
    joined: ["meetings", "joined"] as const,
    participants: (meetingId: number | string) =>
      ["meetings", "participants", `${String(meetingId)}`] as const,
    detail: (meetingId: number | string) => [
      "meetings",
      "detail",
      `${String(meetingId)}`,
    ],
    recommendations: (meetingId: number) =>
      ["meetings", meetingId, "recommendations"] as const,

    list: ["meetings", "list"] as const,
    listParams: (params: { type: string; sortBy: string; sortOrder: string }) =>
      ["meetings", "list", params] as const,
    meetingType: ["meetings", "meetingType"] as const,
  },
  comments: {
    root: ["comments"] as const,
    detail: (postId: number | string) => ["comments", `${String(postId)}`],
  },
  ranking: {
    root: ["ranking"] as const,
  },
};
