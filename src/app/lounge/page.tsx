import { Metadata } from "next";
import Link from "next/link";
import { BtnCommon } from "@/components/ui/BtnCommon";
import HotPostList from "@/app/lounge/_component/HotPostList";
import LoungeClient from "@/app/lounge/_component/LoungeClient";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import LoungeSkeleton from "@/components/skeleton/LoungeSkeleton";
import { getPosts } from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import { MessageSquareText } from "lucide-react";
import LoginGuard from "@/components/modal/LoginGuard";
import { QUERY_KEYS } from "@/constans/queryKey";

export const metadata: Metadata = {
  title: "스프린트 라운지",
  description: "스프린터 파트너들이 모여 정보를 공유하고 소통하는 공간입니다.",
  openGraph: {
    title: "스프린트 라운지 | co-Git",
    description:
      "스프린터 파트너들이 모여 정보를 공유하고 소통하는 공간입니다.",
    images: ["/img/logo/cogit.png"],
  },
};

type SortBy = "createdAt" | "likeCount" | "commentCount" | "viewCount";
type SortOrder = "desc" | "asc";

export default async function LoungePage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const keyword = params.keyword ?? "";
  const sortBy = params.sortBy ?? ("createdAt" as SortBy);
  const sortOrder = params.sortOrder ?? ("desc" as SortOrder);

  const currentParams = { keyword, sortBy, sortOrder };

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-20 2xl:px-0">
      <div className="animate-fade-up">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16">
                <MessageSquareText className="text-white" size={24} />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
                Community / Lounge
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl leading-none font-black tracking-tighter whitespace-nowrap text-slate-950 sm:text-5xl lg:text-6xl">
                SPRINT{" "}
                <span className="text-main-purple uppercase">Lounge.</span>
              </h1>
            </div>
          </div>

          <div className="hidden items-end self-end text-right sm:flex sm:flex-col">
            <div className="max-w-[420px]">
              <LoginGuard
                fallback={
                  <BtnCommon className="group bg-main-purple h-12 w-[90%] rounded-2xl border-none px-10 font-black text-white transition-all hover:bg-slate-950">
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase">
                      <span className="text-bases transition-transform duration-300 group-hover:rotate-180">
                        +
                      </span>
                      <span>Create Post</span>
                    </div>
                  </BtnCommon>
                }
              >
                <Link href="/lounge/create" className="hidden sm:block">
                  <BtnCommon className="group bg-main-purple h-12 w-[90%] rounded-2xl border-none px-10 font-black text-white transition-all hover:bg-slate-950">
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase">
                      <span className="text-base transition-transform duration-300 group-hover:rotate-180">
                        +
                      </span>
                      <span>Create Post</span>
                    </div>
                  </BtnCommon>
                </Link>
              </LoginGuard>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-20">
        <div className="animate-fade-up mt-10 mb-4 flex items-center gap-3">
          <div className="bg-main-purple h-[6px] w-8 rounded-full" />
          <span className="text-[11px] font-black tracking-[0.3em] text-slate-950 uppercase">
            Weekly HOT Posts
          </span>
        </div>
        <div className="animate-fade-up">
          <HotPostList />
        </div>
      </section>

      <Suspense
        key={`${keyword}-${sortBy}-${sortOrder}`}
        fallback={<LoungeSkeleton />}
      >
        <PrefetchBoundary
          prefetchFn={(qc) =>
            qc.prefetchInfiniteQuery({
              queryKey: QUERY_KEYS.posts.listParams(LOUNGE_DEFAULT_PARAMS),
              queryFn: ({ pageParam }) => getPosts(pageParam),
              initialPageParam: undefined as string | undefined,
              getNextPageParam,
              staleTime: 1000 * 60,
            })
          }
        >
          <LoungeClient />
        </PrefetchBoundary>
      </Suspense>

      <Link href="/lounge/create">
        <BtnCommon className="bg-main-purple fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-none text-white shadow-2xl transition-transform hover:scale-110 sm:hidden">
          <span className="pb-1 text-3xl font-light">+</span>
        </BtnCommon>
      </Link>
    </div>
  );
}
