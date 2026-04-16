"use client";

import { useUrlQuery } from "@/hooks/useUrlQuery";
import SearchBarCommon from "@/components/ui/SearchBar";
import SelectFilter from "@/components/ui/SelectFilter";

const LOUNGE_SORT_OPTIONS = [
  { value: "createdAt_desc", label: "최신순" },
  { value: "createdAt_asc", label: "오래된순" },
  { value: "likeCount_desc", label: "인기순" },
  { value: "commentCount_desc", label: "댓글순" },
];

export default function LoungeSearchSection() {
  const { getParam, updateParams } = useUrlQuery();

  const currentKeyword = getParam("keyword");
  const currentSortBy = getParam("sortBy") || "createdAt";
  const currentSortOrder = getParam("sortOrder") || "desc";
  const currentSortValue = `${currentSortBy}_${currentSortOrder}`;

  const handleSortChange = (combinedValue: string | null) => {
    if (!combinedValue) return;

    const [sortBy, sortOrder] = combinedValue.split("_");
    updateParams({ sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBarCommon
          placeholder="원하는 내용을 검색해보세요."
          onSearch={(keyword) => updateParams({ keyword })}
        />
        <div className="flex shrink-0 justify-end">
          <SelectFilter
            options={LOUNGE_SORT_OPTIONS}
            currentValue={currentSortValue}
            onValueChange={handleSortChange}
          />
        </div>
      </section>

      {currentKeyword && (
        <div className="text-sm text-slate-500">
          <span className="text-main-purple font-bold">{`"${currentKeyword}"`}</span>{" "}
          검색 결과입니다.
        </div>
      )}
    </div>
  );
}
