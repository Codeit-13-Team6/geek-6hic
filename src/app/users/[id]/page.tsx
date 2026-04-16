import { cookies } from "next/headers";
import { Metadata } from "next";
import { Tab } from "@/shared/components/ui/Tab";
import { TabsContent } from "@/shared/components/shadcn/tabs";
import ProfileSectionContainer from "@/app/users/[id]/_components/ProfileSectionContainer";
import PrefetchBoundary from "@/shared/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import type { FavoritesPageResponse } from "@/shared/types";
import { getFavorites, getPublicUserProfile } from "@/shared/api/server";
import {
  getBasicProfileStats,
  getCreatedMeetingsByUser,
  getDetailedParticipantStats,
  getMeetingTypeStats,
} from "@/app/users/[id]/_lib/stats";
import { UserTabSkeleton } from "@/shared/components/skeleton/UserTabSkeleton";
import ProfileSectionSkeleton from "@/shared/components/skeleton/ProfileSectionSkeleton";
import GradeCardSkeleton from "@/shared/components/skeleton/GradeCardSkeleton";
import { QUERY_KEYS } from "@/shared/constants/queryKey";
import StatGrid from "./_components/StatGrid";
import StatGridContainer from "./_components/StatGridContainer";
import GradeCardContainer from "./_components/GradeCardContainer";
import UserTabsPrefetcher from "./_components/UserTabsPrefetcher";
import UserLikeList from "@/app/users/[id]/_components/UserLikeList";
import UserMeetingList from "@/app/users/[id]/_components/UserMeetingList";
import UserPostList from "@/app/users/[id]/_components/UserPostList";
import UserTabController from "./_components/UserTabController";

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

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
  const meetingTypeStatsPromise = getMeetingTypeStats({
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

  const defaultTab = isOwnProfile ? "liked" : "created";
  const currentTab = tab || defaultTab;

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-20 2xl:px-0">
      <div className="mb-10 border-b-2 border-slate-950 pb-6 sm:mb-16 sm:pb-10">
        <div className="flex items-center gap-3">
          <div className="h-[6px] w-10 rounded-full bg-slate-950" />
          <h1 className="text-xl font-black tracking-tighter text-slate-950 uppercase sm:text-4xl lg:text-4xl">
            <span className="from-main-purple bg-gradient-to-t to-violet-800 bg-clip-text text-transparent">
              PROFILE.
            </span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <aside className="custom-scrollbar mr-10 flex w-full shrink-0 snap-x snap-mandatory flex-row items-stretch gap-4 overflow-x-auto pb-4 pl-1 lg:w-[310px] lg:flex-col lg:overflow-visible lg:pb-0">
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
          <div className="flex shrink-0 snap-x snap-mandatory flex-row gap-4 lg:contents">
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
                  meetingTypeStats={{
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
                meetingTypeStatsPromise={meetingTypeStatsPromise}
              />
            </Suspense>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <UserTabsPrefetcher
            isOwnProfile={isOwnProfile}
            userId={profileUserId}
          />

          <div id="pagination-top" className="scroll-mt-20 sm:scroll-mt-22" />

          <UserTabController tabs={tabs} currentTab={currentTab}>
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
                    <UserLikeList />
                  </PrefetchBoundary>
                </Suspense>
              </TabsContent>
            )}

            <TabsContent value="created" className="mt-8 !border-none md:mt-12">
              <UserMeetingList
                isOwnProfile={isOwnProfile}
                userId={profileUserId}
              />
            </TabsContent>

            <TabsContent value="lounge" className="mt-8 md:mt-12">
              <UserPostList
                isOwnProfile={isOwnProfile}
                userId={profileUserId}
              />
            </TabsContent>
          </UserTabController>
        </section>
      </div>
    </div>
  );
}
