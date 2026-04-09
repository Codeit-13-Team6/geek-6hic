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
  FavoritesPageResponse,
  MyMeetingsPageResponse,
  MyPostsPageResponse,
} from "@/types";
import {
  getFavorites,
  getMyMeetings,
  getMyPostsServer,
  getProfileStats,
  getPublicUserProfile,
  getUserMeetingsPageServer,
  getUserPostsPageServer,
} from "@/api/server";
import { UserTabSkeleton } from "@/components/skeleton/UserTabSkeleton";
import { QUERY_KEYS } from "@/constans/queryKey";
import StatGrid from "./_components/StatGrid";
import GradeCard from "./_components/GridCard";

const FAVORITES_PAGE_SIZE = 10;
const MY_MEETINGS_PAGE_SIZE = 10;
const MY_POSTS_PAGE_SIZE = 10;

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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const raw = cookieStore.get("user_display")?.value;
  const initialUser = raw ? JSON.parse(raw) : null;
  const isOwnProfile = initialUser?.id === Number(id);
  const profileUserId = Number(id);
  const profileUser = Number.isFinite(Number(id))
    ? await getPublicUserProfile({
        userId: profileUserId,
      })
    : initialUser;
  const stats = await getProfileStats({
    isOwnProfile,
    userId: profileUserId,
  });

  const tabs = isOwnProfile
    ? [
        { value: "liked", label: "찜한 모임" },
        { value: "created", label: "주최한 모임" },
        { value: "lounge", label: "작성한 게시물" },
      ]
    : [
        { value: "created", label: "주최한 모임" },
        { value: "lounge", label: "작성한 게시물" },
      ];

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

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <aside className="custom-scrollbar flex w-full shrink-0 snap-x snap-mandatory flex-row items-stretch gap-4 overflow-x-auto pb-4 lg:w-[310px] lg:flex-col lg:overflow-visible lg:pb-0">
          <div className="flex min-w-[180%] items-stretch gap-4 lg:w-full lg:min-w-full lg:flex-col">
            <div className="w-1/2 snap-center lg:w-full lg:min-w-full">
              {/* 남 프로필이랑 내 프로필 구분 */}
              <ProfileSection
                initialUser={profileUser}
                canEdit={isOwnProfile}
              />
            </div>
            <div className="w-1/2 snap-center lg:w-full">
              <GradeCard daysSinceJoin={42} />
            </div>
          </div>

          {/* 2. 게이미피케이션 스탯 그리드 구역 (옆으로 슬라이드) */}
          <div className="min-w-[90%] snap-center lg:min-w-full">
            <StatGrid
              postCount={stats.postCount}
              meetingCount={stats.meetingCount}
              favoriteCount={stats.favoriteCount}
              participantStats={stats.participantStats}
              // insight="오늘도 즐거운 코딩 되세요! 🚀"
            />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <Tab tabs={tabs} defaultValue={isOwnProfile ? "liked" : "created"}>
            {isOwnProfile && (
              <TabsContent value="liked" className="mt-8 md:mt-12">
                <Suspense fallback={<UserTabSkeleton variant="meeting" />}>
                  <PrefetchBoundary
                    prefetchFn={(qc) =>
                      qc.prefetchQuery<FavoritesPageResponse>({
                        queryKey: QUERY_KEYS.favorites.page(
                          1,
                          FAVORITES_PAGE_SIZE,
                        ),
                        queryFn: () =>
                          getFavorites({
                            offset: 0,
                            limit: FAVORITES_PAGE_SIZE,
                          }),
                      })
                    }
                  >
                    <FavoriteList />
                  </PrefetchBoundary>
                </Suspense>
              </TabsContent>
            )}

            <TabsContent value="created" className="mt-8 !border-none md:mt-12">
              <Suspense fallback={<UserTabSkeleton variant="meeting" />}>
                <PrefetchBoundary
                  prefetchFn={(qc) =>
                    qc.prefetchQuery<MyMeetingsPageResponse>({
                      queryKey: isOwnProfile
                        ? QUERY_KEYS.meetings.myPage(1, MY_MEETINGS_PAGE_SIZE)
                        : QUERY_KEYS.meetings.userPage(
                            profileUserId,
                            1,
                            MY_MEETINGS_PAGE_SIZE,
                          ),
                      queryFn: () =>
                        isOwnProfile
                          ? getMyMeetings({
                              offset: 0,
                              limit: MY_MEETINGS_PAGE_SIZE,
                            })
                          : getUserMeetingsPageServer({
                              userId: profileUserId,
                              offset: 0,
                              limit: MY_MEETINGS_PAGE_SIZE,
                            }),
                    })
                  }
                >
                  <MyMeetingList
                    isOwnProfile={isOwnProfile}
                    userId={profileUserId}
                  />
                </PrefetchBoundary>
              </Suspense>
            </TabsContent>

            <TabsContent value="lounge" className="mt-8 md:mt-12">
              <Suspense fallback={<UserTabSkeleton variant="post" />}>
                <PrefetchBoundary
                  prefetchFn={(qc) =>
                    qc.prefetchQuery<MyPostsPageResponse>({
                      queryKey: isOwnProfile
                        ? QUERY_KEYS.posts.myPage(1, MY_POSTS_PAGE_SIZE)
                        : QUERY_KEYS.posts.userPage(
                            profileUserId,
                            1,
                            MY_POSTS_PAGE_SIZE,
                          ),
                      queryFn: () =>
                        isOwnProfile
                          ? getMyPostsServer({
                              offset: 0,
                              limit: MY_POSTS_PAGE_SIZE,
                            })
                          : getUserPostsPageServer({
                              userId: profileUserId,
                              offset: 0,
                              limit: MY_POSTS_PAGE_SIZE,
                            }),
                    })
                  }
                >
                  <MyPostList
                    isOwnProfile={isOwnProfile}
                    userId={profileUserId}
                  />
                </PrefetchBoundary>
              </Suspense>
            </TabsContent>
          </Tab>
        </section>
      </div>
    </div>
  );
}
