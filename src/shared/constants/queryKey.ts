import { MeetingSortBy, SortOrder } from "@/shared/types";
import { LoungeSortBy } from "@/shared/types/post";

export const QUERY_KEYS = {
  favorites: {
    root: ["favorites"] as const,
    page: (page: number, limit: number) =>
      ["favorites", "page", `${page}`, `${limit}`] as const,
  },
  posts: {
    root: ["posts"] as const, // 하위애들까지 전부 초기화
    my: ["posts", "my"] as const,
    myPage: (page: number, limit: number) =>
      ["posts", "my", "page", `${page}`, `${limit}`] as const,
    user: (userId: number | string) =>
      ["posts", "user", `${String(userId)}`] as const,
    userPage: (userId: number | string, page: number, limit: number) =>
      [
        "posts",
        "user",
        `${String(userId)}`,
        "page",
        `${page}`,
        `${limit}`,
      ] as const,
    hot: ["posts", "hot"] as const,
    list: ["posts", "list"] as const,
    listParams: (params: {
      keyword: string;
      sortBy: LoungeSortBy;
      sortOrder: SortOrder;
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
    myPage: (page: number, limit: number) =>
      ["meetings", "my", "page", `${page}`, `${limit}`] as const,
    user: (userId: number | string) =>
      ["meetings", "user", `${String(userId)}`] as const,
    userPage: (userId: number | string, page: number, limit: number) =>
      [
        "meetings",
        "user",
        `${String(userId)}`,
        "page",
        `${page}`,
        `${limit}`,
      ] as const,
    joined: ["meetings", "joined"] as const,
    joinedIds: ["meetings", "joined", "ids"] as const,
    participants: (meetingId: number | string) =>
      ["meetings", "participants", `${String(meetingId)}`] as const,
    detail: (meetingId: number | string) => [
      "meetings",
      "detail",
      `${String(meetingId)}`,
    ],
    attendance: (meetingId: number | string) =>
      ["meetings", "attendance", `${String(meetingId)}`] as const,
    recommendations: (meetingId: number) =>
      ["meetings", meetingId, "recommendations"] as const,
    list: ["meetings", "list"] as const,
    listParams: (params: {
      type: string;
      keyword: string;
      sortBy: MeetingSortBy;
      sortOrder: SortOrder;
    }) => ["meetings", "list", params] as const,
    meetingType: ["meetings", "meetingType"] as const,
  },
  comments: {
    root: ["comments"] as const,
    detail: (postId: number | string) => ["comments", `${String(postId)}`],
    page: (postId: number | string, page: number, limit: number) =>
      ["comments", `${String(postId)}`, "page", `${page}`, `${limit}`] as const,
  },
  ranking: {
    root: ["ranking"] as const,
  },
  threads: {
    root: ["threads"] as const,
    detail: (meetingId: number | string) =>
      ["threads", "detail", String(meetingId)] as const,
  },
};
