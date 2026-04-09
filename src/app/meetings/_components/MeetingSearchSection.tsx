"use client";

import { useUrlQuery } from "@/hooks/useUrlQuery";
import MeetingTypeTabs from "./MettingTypeTabs";
import SearchBarCommon from "@/components/ui/SearchBar";
import SelectFilter from "@/components/ui/SelectFilter";

const MEETING_SORT_OPTIONS = [
  { value: "createdAt_desc", label: "최신순" }, // value에 두 개의 값을 _로 묶어서 전달
  { value: "createdAt_asc", label: "오래된순" },
  { value: "participantCount_desc", label: "참여인원순" },
];

export default function MeetingSearchSection() {
  const { getParam, updateParams } = useUrlQuery();

  const currentKeyword = getParam("keyword");
  const currentTab = getParam("type");
  const currentSortBy = getParam("sortBy") || "createdAt";
  const currentSortOrder = getParam("sortOrder") || "desc";
  const currentSortValue = `${currentSortBy}_${currentSortOrder}`;

  const handleSortChange = (combinedValue: string | null) => {
    if (!combinedValue) return;

    const [sortBy, sortOrder] = combinedValue.split("_");
    updateParams({ sortBy, sortOrder });
  };

  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:gap-8 md:mb-10">
      <MeetingTypeTabs
        currentTab={currentTab}
        onTabChange={(type) => updateParams({ type })}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-6 md:flex-row">
        <SearchBarCommon
          placeholder="어떤 모임을 찾으시나요?"
          onSearch={(keyword) => updateParams({ keyword })}
        />

        <div className="flex shrink-0 items-center justify-end gap-3">
          <SelectFilter
            options={MEETING_SORT_OPTIONS}
            currentValue={currentSortValue}
            onValueChange={handleSortChange}
          />
        </div>
      </div>

      {currentKeyword && (
        <div className="text-sm text-slate-500">
          <span className="text-main-purple font-bold">{`"${currentKeyword}"`}</span>{" "}
          검색 결과입니다.
        </div>
      )}
    </div>
  );
}
