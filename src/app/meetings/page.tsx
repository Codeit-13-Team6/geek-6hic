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
    strokeLinecap="square" // 매거진 스타일을 위한 각진 마감
    className="text-white" // 아이콘 색상 변경
  >
    <line x1="6" x2="6" y1="3" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

export default async function Page() {
  return (
    // 전체 배경: 아이보리 톤의 연한 그레이, 노이즈 패턴 추가로 종이 질감 구현
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF9F6] font-sans tracking-tight text-slate-950 selection:bg-indigo-100/60">
      {/* 종이 질감 미세 노이즈 패턴 */}
      <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-[0.02]"></div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
        {/* 어제 우리가 확정했던 바로 그 프리미엄 헤더 디자인! */}
        {/* 매거진 아키텍처: 직선적인 레이아웃, 굵은 하단 보더, 대담한 타이포그래피 */}
        <header className="mb-20 flex flex-col gap-10 border-b-2 border-slate-950 pb-16 sm:flex-row sm:items-end sm:justify-between lg:mb-24">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5">
              {/* 포인트 컬러: 딥 퍼플(#260656), 각진 박스 디자인 */}
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden bg-[#260656] shadow-[6px_6px_0_rgba(38,6,86,0.15)]">
                <GitBranchIcon />
              </div>
              {/* 텍스트 포인트 컬러: 딥 퍼플(#260656) */}
              <span className="text-sm font-black tracking-[0.3em] text-[#260656] uppercase">
                Connection / Archive
              </span>
            </div>
            {/* 텍스트: text-8xl까지 키우고 아주 굵게 설정하여 매거진 표지 같은 느낌 연출 */}
            <h1 className="text-6xl leading-[0.9] font-black tracking-tighter text-slate-950 sm:text-7xl lg:text-8xl">
              CO-GIT
              <br />
              {/* 메인 타이틀 포인트: 딥 퍼플(#260656) */}
              <span className="text-[#260656]">CONNECTION.</span>
            </h1>
          </div>

          <div className="max-w-[320px] space-y-5 sm:text-right">
            <p className="text-xl leading-tight font-bold text-slate-600">
              우리는 코드로 연결되고
              <br />
              무게감 있는 영감으로 완성됩니다.
            </p>
            <p className="max-w-[320px] text-sm leading-relaxed font-medium text-slate-400 sm:self-end sm:text-right">
              사이드 프로젝트, 스터디, 취업 준비까지.
              <br />
              최적의 코지트 파트너가 기다립니다.
            </p>
            {/* 딥 퍼플 포인트 바 */}
            <div className="mt-2 hidden h-1.5 w-20 bg-[#260656] sm:ml-auto sm:block"></div>
          </div>
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
