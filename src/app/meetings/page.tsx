import MeetingsClient from "./components/MeetingsClient";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { GitBranch } from "lucide-react";

const getNextPageParam = <
  T extends { hasMore: boolean; nextCursor: string | null },
>(
  lastPage: T,
) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined);
function GitBranchIcon() {
  return <GitBranch className="h-7 w-7 text-rose-500" />;
}

export default async function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50 font-sans tracking-tight text-slate-900 selection:bg-rose-100">
      {/* 백그라운드 패턴: 밝고 활기찬 도트 패턴 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(251_191_36_/_0.15)_1px,transparent_0)] bg-[size:24px_24px]"></div>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-gradient-to-br from-rose-200/40 to-orange-200/30 blur-[120px]"></div>
        <div className="absolute top-[10%] -right-[10%] h-[40vw] w-[40vw] rounded-full bg-gradient-to-br from-sky-200/40 to-cyan-200/30 blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[30%] h-[35vw] w-[35vw] rounded-full bg-gradient-to-br from-amber-200/30 to-yellow-200/20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <header className="relative mb-16 flex flex-col gap-6 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-8 shadow-[0_8px_40px_rgba(251,113,133,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-12 lg:mb-20">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-rose-200/50 to-orange-200/40 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-sky-200/50 to-cyan-200/40 blur-3xl"></div>
          <div className="relative flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 shadow-lg shadow-rose-500/10">
                <GitBranchIcon />
              </div>
              <span className="text-base font-bold text-rose-500">
                우리가 코드로 연결되는 아지트
              </span>
            </div>
            <h1 className="text-4xl leading-[1.2] font-extrabold tracking-tighter text-slate-900 sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                co-git
              </span>
              에서
              <br />팀 메이트를 찾으세요.
            </h1>
          </div>
          <div className="relative flex flex-col justify-end gap-3 sm:text-right">
            <p className="text-base leading-relaxed font-semibold text-slate-500">
              사이드 프로젝트, 스터디, 취업 준비까지.
              <br />
              최적의 코지트 파트너가 기다립니다.
            </p>
            <div className="mt-2 hidden h-1.5 w-12 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 sm:ml-auto sm:block"></div>
          </div>
        </header>

        <PrefetchBoundary
          prefetchFn={(qc) =>
            qc.prefetchInfiniteQuery<
              JoinedMeetingsResponse,
              Error,
              InfiniteData<JoinedMeetingsResponse>,
              readonly [string, string, null],
              string | undefined
            >({
              queryKey: ["meetings", "all", null],
              queryFn: ({ pageParam }) => {
                const cursor =
                  typeof pageParam === "string" ? pageParam : undefined;
                return getMeetingList({
                  size: 10,
                  ...(cursor ? { cursor } : {}),
                });
              },
              initialPageParam: undefined,
              getNextPageParam,
            })
          }
        >
          <MeetingsClient />
        </PrefetchBoundary>
      </div>
    </div>
  );
}
