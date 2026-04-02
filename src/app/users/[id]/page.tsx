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
    <div className="w-full">
      <header className="mb-10 border-b-2 border-slate-950 pb-6 sm:mb-16 sm:pb-10">
        <div className="flex items-center gap-3">
          <div className="bg-main-purple h-[6px] w-10 rounded-full" />
          <h1 className="text-3xl font-black tracking-tighter text-slate-950 uppercase sm:text-4xl lg:text-5xl">
            MY <span className="text-main-purple">PAGE.</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <aside className="w-full shrink-0 lg:w-[282px]">
          <ProfileSection initialUser={initialUser} />
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
                      queryKey: QUERY_KEYS.favorites,
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
