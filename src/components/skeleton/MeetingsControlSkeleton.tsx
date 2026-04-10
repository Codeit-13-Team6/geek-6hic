export function MeetingsControlSkeleton() {
  return (
    // 부모(page.tsx)에 이미 레이아웃 래퍼가 있으므로, 여기선 내용물만 그립니다!
    // 전체에 깜빡임 효과(animate-pulse) 추가
    <div className="w-full animate-pulse" aria-hidden="true">
      {/* 1. 탭 목록 스켈레톤 (실제 UI처럼 밑줄이 있는 텍스트 형태로 변경) */}
      <div className="mb-6 flex flex-col md:mb-8">
        <div className="custom-scrollbar flex gap-6 overflow-x-auto border-b border-slate-100 pb-1">
          {/* 글자 길이를 대충 비슷하게 맞춘 뼈대 6개 생성 */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative shrink-0 pb-3">
              <div className="h-5 w-10 rounded bg-slate-200 sm:h-6 sm:w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. 검색바 & 정렬 드롭다운 스켈레톤 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* 검색바 */}
        <div className="flex w-full items-center sm:max-w-[480px]">
          <div className="h-12 flex-1 rounded-xl bg-slate-200 sm:h-14" />
          <div className="ml-4 h-6 w-6 shrink-0 rounded-full bg-slate-200" />
        </div>

        {/* 정렬 드롭다운 */}
        <div className="flex shrink-0 items-center justify-end">
          <div className="h-[44px] w-[110px] rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
