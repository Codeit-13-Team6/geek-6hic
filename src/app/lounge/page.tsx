import { cookies } from "next/headers";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { BtnCommon } from "@/components/ui/BtnCommon";
import { getHotPosts, getPosts } from "@/api/posts";
import HotPostList from "./component/HotPostList";
import LoungeContent from "./component/LoungeSection";

export default async function LoungePage() {
  const queryClient = new QueryClient();
  // 1. 서버에서 쿠키 꺼내기
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // 2. 쿠키를 헤더에 담아서 보냄
  await queryClient.prefetchQuery({
    queryKey: ["posts", "hot"],
    queryFn: () => getHotPosts({ Cookie: cookieString }),
  });

  // 2. 전체 게시물 첫 페이지(최신순, 검색어 없음) 미리 가져오기
  // QueryKey를 클라이언트에서 쓸 훅과 똑같이 맞춰주는 게 핵심
  await queryClient.prefetchQuery({
    queryKey: ["posts", "list", "latest", ""],
    queryFn: () =>
      getPosts(
        { sortBy: "createdAt", sortOrder: "desc", size: 10 },
        { Cookie: cookieString },
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full bg-gray-50 pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* 헤더 구역 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full sm:mr-2 sm:size-[54px]">
                <span className="text-3xl sm:text-5xl">💬</span>
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-gray-900 sm:text-[24px] lg:text-[32px]">
                  스프린트 라운지
                </h1>
                <p className="mt-1 text-base font-medium text-gray-500 sm:text-lg lg:text-xl">
                  코드잇 스프린터의 정보 공유 라운지
                </p>
              </div>
            </div>

            <Link href="/lounge/create" className="hidden sm:block">
              <BtnCommon size="fixedSize" className="w-auto px-6">
                + 게시물 등록하기
              </BtnCommon>
            </Link>
          </div>

          {/* 핫 게시물 (SSR 버프 받아 즉시 렌더링) */}
          <section className="mt-8 sm:mt-12">
            <h2 className="mb-4 text-[18px] font-bold text-gray-900 sm:mb-6 sm:text-[20px]">
              | 이번주 HOT 게시물
            </h2>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto p-0.5 pt-1 pb-4 sm:gap-6">
              <HotPostList />
            </div>
          </section>

          {/* 검색, 필터, 일반 게시물 리스트 (클라이언트 컴포넌트) */}
          <LoungeContent />
        </div>

        <Link href="/lounge/create">
          <BtnCommon
            size="icon-md"
            className="fixed right-4 bottom-6 z-50 size-14 pb-1 text-3xl leading-none shadow-lg transition-transform hover:scale-105 sm:hidden"
          >
            +
          </BtnCommon>
        </Link>
      </div>
    </HydrationBoundary>
  );
}
