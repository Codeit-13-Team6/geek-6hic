export const QUERY_KEYS = {
  favorites: ["favorite"] as const,
  posts: {
    root: ["post"] as const, // 하위애들까지 전부 초기화
    my: ["posts", "list", "my", "latest"] as const,
  },
  meetings: {
    root: ["meetings"] as const,
    my: ["meetings", "my"] as const,

  },
};