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
import {
  getFavorites,
  getMyMeetings,
  getLoungePosts,
} from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import { UserTabSkeleton } from "@/components/skeleton/UserTabSkeleton";

const defaultTabs = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];

export default async function Page() {
  return (
    <div className="flex-1 bg-gray-50 pt-6 pb-20 md:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:items-start lg:gap-[56px]">
          <section className="mt-0 w-full shrink-0 lg:mt-[22px] lg:w-[282px]">
            <h1 className="mb-4 ml-2 cursor-pointer text-xl font-bold text-gray-900 md:mb-8 md:text-2xl lg:mb-10 lg:text-[32px]">
              마이페이지
            </h1>
            <ProfileSection />
          </section>

          <section className="flex min-w-0 flex-1 flex-col scroll-auto">
            <Tab tabs={defaultTabs}>
              <TabsContent value="liked" className="mt-6 md:mt-[32px]">
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
                        queryKey: ["favorites"],
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
              <TabsContent value="created" className="mt-6 md:mt-[32px]">
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
                        queryKey: ["meetings", "my"],
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
              <TabsContent value="lounge" className="mt-6 md:mt-[32px]">
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
                        queryKey: ["posts", "list", "my", "latest", ""],
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
    </div>
  );
}
