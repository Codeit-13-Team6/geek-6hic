import { Tab } from "@/components/ui/Tab";
import { TabsContent } from "@/components/shadcnOrigin/tabs";
import ProfileSection from "./components/ProfileSection";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import MyMeetingList from "./components/MyMeetingList";
import MyPostList from "./components/MyPostList";
import { Suspense } from "react";
import FavoriteList from "@/app/users/[id]/components/FavoriteList";
import type {
  FavoritesResponse,
  MyMeetingsResponse,
  GetPostsResponse,
} from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getFavorites, getMyMeetings, getLoungePosts } from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import { UserTabSkeleton } from "@/components/skeleton/UserTabSkeleton";

const defaultTabs = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];

export default async function Page() {
  return (
    <div className="w-full">
      <header className="mb-10 border-b-2 border-slate-950 pb-6 sm:mb-16 sm:pb-10">
        <div className="flex items-center gap-3">
          <div className="bg-main-purple h-[6px] w-10 rounded-full" />
          <h1 className="text-3xl font-black tracking-tighter text-slate-950 uppercase sm:text-4xl lg:text-5xl">
            User <span className="text-main-purple">Archive.</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <aside className="w-full shrink-0 lg:w-[282px]">
          <ProfileSection />
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
  );
}
