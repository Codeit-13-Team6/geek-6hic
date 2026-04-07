import { cookies } from "next/headers";
import { Metadata } from "next";
import { Tab } from "@/components/ui/Tab";
import { TabsContent } from "@/components/shadcnOrigin/tabs";
import ProfileSection from "@/app/users/[id]/_components/ProfileSection";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import MyMeetingList from "@/app/users/[id]/_components/MyMeetingList";
import MyPostList from "@/app/users/[id]/_components/MyPostList";
import { Suspense } from "react";
import FavoriteList from "@/app/users/[id]/_components/FavoriteList";
import type {
  FavoritesResponse,
  MyMeetingsResponse,
  GetPostsResponse,
} from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getFavorites, getMyMeetings, getLoungePosts } from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import { UserTabSkeleton } from "@/components/skeleton/UserTabSkeleton";
import { QUERY_KEYS } from "@/constans/queryKey";
import GamificationSidebar from "@/components/features/card/GamificationSidebar";
// import FlipWrapper from "./_components/FlipWrapper";
import StatGrid from "./_components/StatGrid";
import GradeCard from "./_components/GridCard";

const defaultTabs = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "내가 쓴 게시물" },
];

export const metadata: Metadata = {
  title: "마이 페이지",
  description:
    "내 정보를 확인하고, 내가 찜한 모임, 참여한 모임, 작성한 게시물을 한눈에 확인하세요.",
  openGraph: {
    title: "마이 페이지 | co-Git",
    description:
      "내 정보를 확인하고, 내가 찜한 모임, 참여한 모임, 작성한 게시물을 한눈에 확인하세요.",
    images: ["/img/logo/cogit.png"],
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("user_display")?.value;
  const initialUser = raw ? JSON.parse(raw) : null;

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-20 2xl:px-0">
      <div className="mb-10 border-b-2 border-slate-950 pb-6 sm:mb-16 sm:pb-10">
        <div className="flex items-center gap-3">
          <div className="bg-main-purple h-[6px] w-10 rounded-full" />
          <h1 className="text-3xl font-black tracking-tighter text-slate-950 uppercase sm:text-4xl lg:text-5xl">
            MY <span className="text-main-purple">PAGE.</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-16">
        <aside className="custom-scrollbar flex w-full shrink-0 flex-row items-stretch gap-4 overflow-x-auto pb-4 lg:w-[310px] lg:flex-col lg:overflow-visible lg:pb-0 snap-x snap-mandatory">
          {/* 1. 뒤집히는 카드 구역 (프로필 & Grade) */}
          <div className="min-w-[180%] lg:min-w-full flex items-stretch gap-4 lg:w-full lg:flex-col">
            <div className="w-1/2 lg:w-full snap-center lg:min-w-full">
              <ProfileSection initialUser={initialUser} />
            </div>
            <div className="w-1/2 lg:w-full snap-center">
              <GradeCard daysSinceJoin={42} />
            </div>
          </div>

          {/* 2. 게이미피케이션 스탯 그리드 구역 (옆으로 슬라이드) */}
          <div className="min-w-[90%] lg:min-w-full snap-center">
            <StatGrid
              postCount={10}
              meetingCount={2}
              favoriteCount={5}
            // insight="오늘도 즐거운 코딩 되세요! 🚀"
            />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <Tab tabs={defaultTabs} defaultValue="liked">
            <TabsContent value="liked" className="mt-8 md:mt-12">
              <Suspense fallback={<UserTabSkeleton variant="meeting" />}>
                <PrefetchBoundary
                  prefetchFn={(qc) =>
                    qc.prefetchInfiniteQuery<
                      FavoritesResponse,
                      Error,
                      InfiniteData<FavoritesResponse>,
                      readonly string[],
                      string | undefined
                    >({
                      queryKey: QUERY_KEYS.favorites.root,
                      queryFn: ({ pageParam }) => getFavorites(pageParam),
                      initialPageParam: undefined,
                      getNextPageParam,
                    })
                  }
                >
                  <FavoriteList />
                </PrefetchBoundary>
              </Suspense>
            </TabsContent>

            <TabsContent value="created" className="mt-8 !border-none md:mt-12">
              <Suspense fallback={<UserTabSkeleton variant="meeting" />}>
                <PrefetchBoundary
                  prefetchFn={(qc) =>
                    qc.prefetchInfiniteQuery<
                      MyMeetingsResponse,
                      Error,
                      InfiniteData<MyMeetingsResponse>,
                      readonly string[],
                      string | undefined
                    >({
                      queryKey: QUERY_KEYS.meetings.my,
                      queryFn: ({ pageParam }) => getMyMeetings(pageParam),
                      initialPageParam: undefined,
                      getNextPageParam,
                    })
                  }
                >
                  <MyMeetingList />
                </PrefetchBoundary>
              </Suspense>
            </TabsContent>

            <TabsContent value="lounge" className="mt-8 md:mt-12">
              <Suspense fallback={<UserTabSkeleton variant="post" />}>
                <PrefetchBoundary
                  prefetchFn={(qc) =>
                    qc.prefetchInfiniteQuery<
                      GetPostsResponse,
                      Error,
                      InfiniteData<GetPostsResponse>,
                      readonly string[],
                      string | undefined
                    >({
                      queryKey: QUERY_KEYS.posts.my,
                      queryFn: ({ pageParam }) => getLoungePosts(pageParam),
                      initialPageParam: undefined,
                      getNextPageParam,
                    })
                  }
                >
                  <MyPostList />
                </PrefetchBoundary>
              </Suspense>
            </TabsContent>
          </Tab>
        </section>
      </div>
    </div>
  );
}
