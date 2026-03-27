import MeetingsClient from "./components/MeetingsClient";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";

const getNextPageParam = <
  T extends { hasMore: boolean; nextCursor: string | null },
>(
  lastPage: T,
) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined);

// 우리가 만든 프리미엄 Git 아이콘
const GitBranchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-violet-600"
  >
    <line x1="6" x2="6" y1="3" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

export default async function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F5F5F7] font-sans tracking-tight text-slate-950 selection:bg-violet-500/20">
      {/* 앰비언트 라이트: 보라색(Violet)과 차가운 얼음 빛(Ice Blue)으로 신비로운 분위기 연출 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] h-[60vw] w-[60vw] rounded-full bg-violet-200/40 blur-[130px]"></div>
        <div className="absolute -right-[15%] bottom-[0%] h-[55vw] w-[55vw] rounded-full bg-blue-100/40 blur-[140px]"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* 어제 우리가 확정했던 바로 그 프리미엄 헤더 디자인! */}
        <header className="mb-16 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:mb-20">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-lg">
                <GitBranchIcon />
              </div>
              <span className="text-sm font-semibold text-slate-500">
                우리가 코드로 연결되는 아지트
              </span>
            </div>
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tighter text-slate-950 sm:text-5xl lg:text-6xl">
              <span className="text-violet-600">co-git</span>에서
              <br />팀 메이트를 찾으세요.
            </h1>
          </div>
          <p className="max-w-[260px] text-sm font-medium text-slate-600 sm:self-end sm:text-right">
            사이드 프로젝트, 스터디, 취업 준비까지.
            <br /> 최적의 코지트 파트너가 기다립니다.
          </p>
        </header>

        {/* 팀원분의 무한스크롤 프리페치 로직 완벽 유지 */}
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
