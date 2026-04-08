import axiosInstance from "@/lib/clientFetcher";
import { filterThreadPosts } from "@/lib/postUtils";
import { GetPostsParams, GetPostsResponse, MyPostsPageResponse, Post } from "@/types";
import { threadKeyword } from "@/constans/post";

export async function getHotPosts(): Promise<Post[]> {
  const { data } = await axiosInstance.get<Post[]>("/hot");
  return data;
}

export async function getPosts(
  params: GetPostsParams,
): Promise<GetPostsResponse> {
  const { data: res } = await axiosInstance.get("/posts", {
    params,
  });

  return filterThreadPosts(res);
}

export async function getUserPosts(params: {
  userId: number;
  cursor?: string;
  size?: number;
}): Promise<GetPostsResponse> {
  // 타유저 페이지는 아직 전용 API가 없어서 이 우회 로직이 계속 필요합니다.
  // /posts 전체를 순회하면서 해당 userId 글만 모으는 임시 구현입니다.
  // TODO: 타유저 전용 BFF 페이지네이션이 생기면 이 cursor 기반 우회 로직은 제거 대상입니다.
  const { userId, cursor, size = 20 } = params;
  const collected: GetPostsResponse["data"] = [];
  let nextCursor = cursor;
  let hasMore = true;

  while (hasMore && collected.length < size) {
    const { data: res } = await axiosInstance.get("/posts", {
      params: {
        keyword: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        size: 50,
        ...(nextCursor ? { cursor: nextCursor } : {}),
      },
    });

    const filteredPage = filterThreadPosts(res);

    collected.push(
      ...filteredPage.data.filter((post: Post) => post.author.id === userId),
    );
    if (filteredPage.hasMore && !filteredPage.nextCursor) {
      hasMore = false;
      nextCursor = undefined;
      break;
    }

    hasMore = filteredPage.hasMore;
    nextCursor = filteredPage.nextCursor ?? undefined;
  }

  return {
    data: collected,
    hasMore,
    nextCursor: nextCursor ?? null,
  };
}

export async function getMyPosts(
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<MyPostsPageResponse> {
  const { data } = await axiosInstance.get<MyPostsPageResponse>(
    "/users/me/posts-visible",
    {
    params: {
      offset: params.offset ?? 0,
      limit: params.limit ?? 20,
      // BFF가 내부에서 /users/me/posts 정렬/필터링을 처리하므로
      // 클라이언트에서는 offset/limit만 넘기면 됩니다.
      // sortBy / sortOrder 는 여기서 더 이상 필요하지 않아 제거했습니다.
    },
  });

  return data;
}

export async function getPostDetail(postId: number): Promise<Post> {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
  return data;
}

export async function createPost(postData: {
  title: string;
  content: string;
  image?: string | null;
}): Promise<Post> {
  const { data } = await axiosInstance.post("/posts", postData);
  return data;
}

export async function deletePost(postId: number): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}`);
}

export async function updatePost(
  postId: number,
  postData: { title: string; content: string; image?: string | null },
): Promise<Post> {
  const { data } = await axiosInstance.patch<Post>(
    `/posts/${postId}`,
    postData,
  );
  return data;
}

export async function likePost(postId: number): Promise<void> {
  await axiosInstance.post(`/posts/${postId}/like`);
}

export async function unlikePost(postId: number): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}/like`);
}
export async function getThreadPost(meetingId: number): Promise<Post> {
  const { data } = await axiosInstance.get("/posts", {
    params: { keyword: threadKeyword.build(meetingId) },
  });
  return data?.data?.[0] || null;
}
