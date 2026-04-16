"use client";

import { useUrlQuery } from "@/hooks/useUrlQuery";
import SelectFilter from "@/components/ui/SelectFilter";
import { cn } from "@/lib";
import SearchBar from "@/components/ui/SearchBar";

interface SortOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  sortOptions: SortOption[];
  searchPlaceholder?: string;
  className?: string;
}

export default function SearchFilterBar({
  sortOptions,
  searchPlaceholder = "검색어를 입력하세요",
  className,
}: SearchFilterBarProps) {
  const { getParam, updateParams } = useUrlQuery();

  const currentKeyword = getParam("keyword") || "";
  const currentSortBy = getParam("sortBy") || "createdAt";
  const currentSortOrder = getParam("sortOrder") || "desc";
  const currentSortValue = `${currentSortBy}_${currentSortOrder}`;

  const handleSortChange = (combinedValue: string | null) => {
    if (!combinedValue) return;
    const [sortBy, sortOrder] = combinedValue.split("_");
    updateParams({ sortBy, sortOrder });
  };

  const handleSearch = (keyword: string) => {
    updateParams({ keyword });
  };

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:mb-8 sm:gap-6 md:gap-8",
        className,
      )}
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="w-full sm:max-w-[480px]">
          <SearchBar
            initialValue={currentKeyword}
            placeholder={searchPlaceholder}
            onSearch={handleSearch}
          />
        </div>

        <div className="flex shrink-0 items-center justify-end">
          <SelectFilter
            options={sortOptions}
            currentValue={currentSortValue}
            onValueChange={handleSortChange}
          />
        </div>
      </section>

      {currentKeyword && (
        <div className="text-sm font-medium text-slate-500">
          <span className="text-main-purple font-bold">{`"${currentKeyword}"`}</span>
          검색 결과입니다.
        </div>
      )}
    </div>
  );
}
