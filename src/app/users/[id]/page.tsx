import { Tab } from "@/components/ui/Tab";
import { TabsContent } from "@/components/shadcnOrigin/tabs";
import ProfileSection from "./components/ProfileSection";
import PrefetchBoundary from "./components/PrefetchBoundary";
import MyMeetingList from "./components/MyMeetingList";
import MyPostList from "./components/MyPostList";
import { Suspense } from "react";
import { EmptyData } from "@/components/features/empty/EmptyData";
import { serverFetch } from "@/lib/server-fetcher";
import FavoriteList from "@/app/users/[id]/components/FavoriteList";
import type {
  FavoritesResponse,
  MyMeetingsResponse,
  GetPostsResponse,
} from "@/types";
import type { InfiniteData } from "@tanstack/react-query";

const getNextPageParam = <
  T extends { hasMore: boolean; nextCursor: string | null },
>(
  lastPage: T,
) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined);

const defaultTabs = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];

<<<<<<< Updated upstream
const fetchFavorites = async () => {
  const { data } = await serverFetch({ method: "GET", url: "/favorites" });
  return data.data;
};

const fetchMyMeetings = async () => {
  const { data } = await serverFetch({ method: "GET", url: "/meetings/my" });
  return data.data;
};

=======
const fetchFavorites = async (cursor?: string): Promise<FavoritesResponse> => {
  const { data } = await serverFetch({
    method: "GET",
    url: "/favorites",
    params: cursor ? { cursor, size: 10 } : { size: 10 },
  });
  return data;
};

const fetchMyMeetings = async (
  cursor?: string,
): Promise<MyMeetingsResponse> => {
  const { data } = await serverFetch({
    method: "GET",
    url: "/meetings/my",
    params: cursor ? { cursor, size: 10 } : { size: 10 },
  });
  return data;
};

const fetchLoungePosts = async (cursor?: string): Promise<GetPostsResponse> => {
  const { data } = await serverFetch({
    method: "GET",
    url: "/posts",
    params: {
      keyword: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      size: 20,
      ...(cursor ? { cursor } : {}),
    },
  });
  return data;
};


>>>>>>> Stashed changes
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
                <Suspense fallback={<EmptyData />}>
                  <PrefetchBoundary
<<<<<<< Updated upstream
                    queryKey={["favorites"]}
                    queryFn={fetchFavorites}
=======
                    prefetchFn={(qc) =>
                      qc.prefetchInfiniteQuery<
                        FavoritesResponse,
                        Error,
                        InfiniteData<FavoritesResponse>,
                        readonly string[],
                        string | undefined
                      >({
                        queryKey: ["favorites"],
                        queryFn: ({ pageParam }) => fetchFavorites(pageParam),
                        initialPageParam: undefined,
                        getNextPageParam,
                      })
                    }
>>>>>>> Stashed changes
                  >
                    <FavoriteList />
                  </PrefetchBoundary>
                </Suspense>
              </TabsContent>
              <TabsContent value="created" className="mt-6 md:mt-[32px]">
                <Suspense fallback={<EmptyData />}>
                  <PrefetchBoundary
<<<<<<< Updated upstream
                    queryKey={["meetings", "my"]}
                    queryFn={fetchMyMeetings}
=======
                    prefetchFn={(qc) =>
                      qc.prefetchInfiniteQuery<
                        MyMeetingsResponse,
                        Error,
                        InfiniteData<MyMeetingsResponse>,
                        readonly string[],
                        string | undefined
                      >({
                        queryKey: ["meetings", "my"],
                        queryFn: ({ pageParam }) => fetchMyMeetings(pageParam),
                        initialPageParam: undefined,
                        getNextPageParam,
                      })
                    }
>>>>>>> Stashed changes
                  >
                    <MyMeetingList />
                  </PrefetchBoundary>
                </Suspense>
              </TabsContent>
<<<<<<< Updated upstream
              <TabsContent value="lounge" className="md:mt-[32px]">
                  {/* 서버로 뺄려다가 생각해보니까 순수 be api  가지고는 구현하는데 문제가있어서 route handler 로
                    옮기는게 나을것같음 internal 파는것도 괜찮을것같고 일단  생각좀 해보는걸로 ,,,
                  */}
                  <PostList filterType={"my"} refetchType={false} />
=======
              <TabsContent value="lounge" className="mt-6 md:mt-[32px]">
                <Suspense fallback={<EmptyData />}>
                  <PrefetchBoundary
                    prefetchFn={(qc) =>
                      qc.prefetchInfiniteQuery<
                        GetPostsResponse,
                        Error,
                        InfiniteData<GetPostsResponse>,
                        readonly string[],
                        string | undefined
                      >({
                        queryKey: ["posts", "list", "latest", ""],
                        queryFn: ({ pageParam }) => fetchLoungePosts(pageParam),
                        initialPageParam: undefined,
                        getNextPageParam,
                      })
                    }
                  >
                    <MyPostList />
                  </PrefetchBoundary>
                </Suspense>
>>>>>>> Stashed changes
              </TabsContent>
            </Tab>
          </section>
        </div>
      </div>
    </div>
  );
}
