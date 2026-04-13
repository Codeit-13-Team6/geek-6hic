import { cookies } from "next/headers";
import { Metadata } from "next";
import { Tab } from "@/components/ui/Tab";
import { TabsContent } from "@/components/shadcnOrigin/tabs";
import ProfileSectionContainer from "@/app/users/[id]/_components/ProfileSectionContainer";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import MyMeetingList from "@/app/users/[id]/_components/MyMeetingList";
import MyPostList from "@/app/users/[id]/_components/MyPostList";
import { Suspense } from "react";
import FavoriteList from "@/app/users/[id]/_components/FavoriteList";
import type { FavoritesPageResponse } from "@/types";
import {
  getFavorites,
  getBasicProfileStats,
  getCreatedMeetingsByUser,
  getDetailedParticipantStats,
  getPublicUserProfile,
} from "@/api/server";
import { UserTabSkeleton } from "@/components/skeleton/UserTabSkeleton";
import ProfileSectionSkeleton from "@/components/skeleton/ProfileSectionSkeleton";
import GradeCardSkeleton from "@/components/skeleton/GradeCardSkeleton";
import { QUERY_KEYS } from "@/constans/queryKey";
import StatGrid from "./_components/StatGrid";
import StatGridContainer from "./_components/StatGridContainer";
import GradeCardContainer from "./_components/GradeCardContainer";

const FAVORITES_PAGE_SIZE = 10;

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

  const basicStatsPromise = getBasicProfileStats({
    isOwnProfile,
    userId: profileUserId,
  });
  const participantStatsPromise = getDetailedParticipantStats({
    isOwnProfile,
    userId: profileUserId,
  });
  const createdMeetingsPromise = getCreatedMeetingsByUser({
    isOwnProfile,
    userId: profileUserId,
  });
  const profileUserPromise = Number.isFinite(profileUserId)
    ? getPublicUserProfile({
        userId: profileUserId,
      })
    : Promise.resolve(initialUser);

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
          <h1 className="text-xl font-black tracking-tighter text-slate-950 uppercase sm:text-4xl lg:text-4xl">
            <span className="text-main-purple">PROFILE.</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <aside className="custom-scrollbar flex w-full shrink-0 snap-x snap-mandatory flex-row items-stretch gap-4 overflow-x-auto pb-4 lg:w-[310px] lg:flex-col lg:overflow-visible lg:pb-0">
          <div className="flex min-h-80 min-w-[180%] items-stretch gap-4 md:max-lg:min-h-90 lg:w-full lg:min-w-full lg:flex-col">
            <div className="h-full w-1/2 snap-center lg:w-full lg:min-w-full">
              {/* 남 프로필이랑 내 프로필 구분 */}
              <Suspense fallback={<ProfileSectionSkeleton />}>
                <ProfileSectionContainer
                  profileUserPromise={profileUserPromise}
                  canEdit={isOwnProfile}
                />
              </Suspense>
            </div>
            <div className="w-1/2 snap-center self-start md:h-full md:self-auto lg:w-full">
              <Suspense fallback={<GradeCardSkeleton />}>
                <GradeCardContainer
                  basicStatsPromise={basicStatsPromise}
                  createdMeetingsPromise={createdMeetingsPromise}
                />
              </Suspense>
            </div>
          </div>

          {/* 2. 게이미피케이션 스탯 그리드 구역 (옆으로 슬라이드) */}
          <div className="min-h-80 min-w-[90%] snap-center md:max-lg:min-h-90 lg:min-w-full">
            <Suspense
              fallback={
                <StatGrid
                  postCount={0}
                  meetingCount={0}
                  favoriteCount={0}
                  participantStats={{
                    team: 0,
                    study: 0,
                    project: 0,
                    jobPrep: 0,
                    etc: 0,
                  }}
                />
              }
            >
              <StatGridContainer
                basicStatsPromise={basicStatsPromise}
                participantStatsPromise={participantStatsPromise}
              />
            </Suspense>
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
              <MyMeetingList
                isOwnProfile={isOwnProfile}
                userId={profileUserId}
              />
            </TabsContent>

            <TabsContent value="lounge" className="mt-8 md:mt-12">
              <MyPostList isOwnProfile={isOwnProfile} userId={profileUserId} />
            </TabsContent>
          </Tab>
        </section>
      </div>
    </div>
  );
}
