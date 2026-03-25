import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Tab } from "@/components/ui/Tab";
import { TabsContent } from "@/components/shadcnOrigin/tabs";
import PostList from "@/app/lounge/component/PostList";
import ProfileSection from "./components/ProfileSection";
import FavoriteList from "./components/FavoriteList";
import MyMeetingList from "./components/MyMeetingList";
import { serverFetch } from "@/lib/server-fetcher";

const defaultTabs = [
  { value: "liked", label: "찜한 모임" },
  { value: "created", label: "내가 만든 모임" },
  { value: "lounge", label: "라운지 게시물" },
];

export default async function Page() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["meetings", "my"],

      queryFn: async () => {
        const { data } = await serverFetch({
          method: "GET",
          url: "/meetings/my",
        });
        return data.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["favorites"],
      queryFn: async () => {
        const { data } = await serverFetch({
          method: "GET",
          url: "/favorites",
        });
        return data.data;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
                  <PostList filterType={"my"} refetchType={false} />
                </TabsContent>
              </Tab>
            </section>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
