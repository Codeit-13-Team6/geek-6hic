"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { Tab } from "@/components/features/tab/Tab";
import { TabsContent } from "@/components/shadcnOrigin/tabs";
import PostList from "@/components/features/list/PostList";
import ProfileSection from "./components/ProfileSection";
import FavoriteList from "./components/FavoriteList";
import MyMeetingList from "./components/MyMeetingList";
import { getPosts } from "@/api/posts";
import { getMeeting } from "@/api/meeting";

const defaultTabs = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["meetings", "my"],
      queryFn: getMeeting,
    });
    queryClient.prefetchQuery({
      queryKey: ["posts", "", "latest"],
      queryFn: () =>
        getPosts({
          keyword: "",
          sortBy: "createdAt",
          sortOrder: "desc",
          size: 10,
        }),
    });
  }, []);

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
                <FavoriteList />
              </TabsContent>
              <TabsContent value="created" className="mt-6 md:mt-[32px]">
                <MyMeetingList />
              </TabsContent>
              <TabsContent value="lounge" className="md:mt-[32px]">
                <PostList
                  filterFn={(post) => post.author.id === user?.id}
                  refetchType={false}
                />
              </TabsContent>
            </Tab>
          </section>
        </div>
      </div>
    </div>
  );
}
