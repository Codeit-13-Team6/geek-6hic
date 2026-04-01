import Link from "next/link";
import { BtnCommon } from "@/components/ui/BtnCommon";
import HotPostList from "@/app/lounge/_component/HotPostList";
import LoungeContent from "@/app/lounge/_component/LoungeSection";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import { GetPostsResponse } from "@/types";
import { InfiniteData } from "@tanstack/react-query";
import LoungeSkeleton from "@/components/skeleton/LoungeSkeleton";
import { getPosts } from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import LoginModal from "@/components/modal/LoginModal";
import { MessageSquareText } from "lucide-react";

export default async function LoungePage() {
  return (
    <div className="relative w-full">
      <header className="mb-10 border-b-2 border-slate-950 pb-8 sm:mb-20 sm:pb-12 lg:pb-12">
        <div className="grid grid-cols-2 items-center gap-5 sm:gap-8">
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
              <LoginModal
                fallback={
                  <BtnCommon className="bg-main-purple h-12 w-[90%] rounded-2xl border-none px-10 font-black text-white transition-all hover:bg-slate-950">
                    <span className="text-xs tracking-widest uppercase">
                      + Create Post
                    </span>
                  </BtnCommon>
                }
              >
                <Link href="/lounge/create" className="hidden sm:block">
                  <BtnCommon className="bg-main-purple h-12 w-[90%] rounded-2xl border-none px-10 font-black text-white transition-all hover:bg-slate-950">
                    <span className="text-xs tracking-widest uppercase">
                      + Create Post
                    </span>
                  </BtnCommon>
                </Link>
              </LoginModal>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-20">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-main-purple h-[6px] w-8 rounded-full" />
          <span className="text-[11px] font-black tracking-[0.3em] text-slate-950 uppercase">
            Weekly HOT Posts
          </span>
        </div>
        <HotPostList />
      </section>

      <Suspense fallback={<LoungeSkeleton />}>
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
              queryFn: ({ pageParam }) => getPosts(pageParam),
              initialPageParam: undefined,
              getNextPageParam,
            })
          }
        >
          <LoungeContent />
        </PrefetchBoundary>
      </Suspense>

      <Link href="/lounge/create">
        <BtnCommon className="bg-main-purple fixed right-6 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border-none text-white shadow-2xl transition-transform hover:scale-110 sm:hidden">
          <span className="pb-1 text-3xl font-light">+</span>
        </BtnCommon>
      </Link>
    </div>
  );
}
