import { getPostDetail } from "@/api/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import LoungeDetailClient from "./component/LoungeDetailClient";

export default async function LoungeDetailPageServer({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15+ 에서는 params가 Promise
}) {
  const { id } = await params;
  const postId = Number(id);

  const queryClient = new QueryClient();
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  await queryClient.prefetchQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostDetail(postId, { Cookie: cookieString }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LoungeDetailClient postId={postId} />
    </HydrationBoundary>
  );
}
