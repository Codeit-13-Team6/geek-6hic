import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getPosts } from "@/api/posts";
import { Posts } from "@/types";

interface UsePostsOptions {
  filterFn?: (post: Posts) => boolean;
}

export function usePosts({ filterFn }: UsePostsOptions = {}) {
  const router = useRouter();

  // 원래는 백엔드측에서 필터걸어서 주는 형식이어야 하지만 프론트쪽에서 제한적으로 적용하는것이기 때문에
  // 최근 게시물 100개중에서만 나의 게시물 찾아오는 형식으로 제한적 구현
  const size = filterFn ? 100 : 10;

  const { data: loungeList, isLoading } = useQuery({
    queryKey: ["posts", size],
    queryFn: () => getPosts({ size }),
  });

  // 해당 hook이 라운지쪽과 마이페이지에서 사용하는데 필터링 기준이 각각 달라서 외부에서 주입하는 형식으로 진행
  const list = filterFn ? loungeList?.filter(filterFn) : loungeList;

  const handleDetailClick = (postId: number) => router.push(`/lounge/${postId}`);

  return { list, isLoading, handleDetailClick };
}
