"use client";

import { useUrlQuery } from "@/hooks/useUrlQuery";

import SelectFilter from "@/components/ui/SelectFilter";
import { GitBranchIcon } from "lucide-react"; // 사용하시는 아이콘에 맞게 수정해주세요
import MeetingTypeTabs from "./MettingTypeTabs";
import SearchBar from "@/components/ui/SearchBar";

const MEETING_SORT_OPTIONS = [
  { value: "createdAt_desc", label: "최신순" },
  { value: "createdAt_asc", label: "오래된순" },
  { value: "participantCount_desc", label: "참여인원순" },
];

export default function MeetingsHeaderSection() {
  const { getParam, updateParams } = useUrlQuery();

  const currentTab = getParam("type");
  const currentKeyword = getParam("keyword") || "";
  const currentSortBy = getParam("sortBy") || "createdAt";
  const currentSortOrder = getParam("sortOrder") || "desc";
  const currentSortValue = `${currentSortBy}_${currentSortOrder}`;

  const handleSortChange = (combinedValue: string | null) => {
    if (!combinedValue) return;
    const [sortBy, sortOrder] = combinedValue.split("_");
    updateParams({ sortBy, sortOrder });
  };

  return (
    <div className="animate-fade-up mb-5 sm:mb-8 md:mb-10">
      <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div
              className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16"
              aria-hidden="true"
            >
              <GitBranchIcon className="text-white" />
            </div>
            <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
              Connection / Archive
            </span>
          </div>

          <h1 className="text-5xl leading-[1.1] font-black tracking-tighter text-slate-950 sm:text-7xl lg:text-8xl">
            CO-GIT
            <br />
            <span className="text-main-purple">CONNECTION.</span>
          </h1>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-4 text-left xl:items-end xl:text-right">
          <div className="w-full">
            <div className="bg-main-purple mb-4 hidden h-1.5 w-20 lg:block xl:ml-auto"></div>
            <p className="text-lg font-medium tracking-tight text-slate-900 sm:text-xl lg:mt-4 lg:text-2xl">
              스프린터 파트너들과 <br className="sm:block xl:hidden" />
              공유하고, 협업하고, 성장하는 공간
            </p>
            <p className="mt-2 text-sm font-light tracking-tight text-slate-400 sm:text-base">
              모임을 생성하여 아지트를 만들어보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="line-spread mt-8 mb-10 flex w-full justify-center sm:mt-10 sm:mb-15 lg:mt-15 lg:mb-24">
        <div className="h-[2px] w-full origin-center bg-gray-950" />
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* 탭 컴포넌트 */}
        <MeetingTypeTabs
          currentTab={currentTab}
          onTabChange={(type) => updateParams({ type })}
        />

        {/* 검색 및 정렬 필터 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <SearchBar
            initialValue={currentKeyword} // 새로고침 시 URL 검색어 유지
            placeholder="어떤 모임을 찾으시나요?"
            onSearch={(keyword) => updateParams({ keyword })}
          />

          <div className="flex shrink-0 items-center justify-end">
            <SelectFilter
              options={MEETING_SORT_OPTIONS}
              currentValue={currentSortValue}
              onValueChange={handleSortChange}
            />
          </div>
        </div>

        {currentKeyword && (
          <div className="text-sm font-medium text-slate-500">
            <span className="text-main-purple font-bold">{`"${currentKeyword}"`}</span>{" "}
            검색 결과입니다.
          </div>
        )}
      </div>
    </div>
  );
}
