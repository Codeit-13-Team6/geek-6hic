"use client";

import { useUrlSearch } from "@/hooks/useUrlSearch";
import { InputCommon } from "./InputCommon";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  placeholder?: string;
  queryKey?: string;
  className?: string;
  onSearch?: (keyword: string) => void; // 필요한가?
}

export default function SearchBarCommon({
  placeholder = "검색어를 입력하세요",
  queryKey = "keyword",
  className,
  onSearch,
}: Props) {
  const { keyword, setKeyword, handleSearch } = useUrlSearch(queryKey);

  const executeSearch = () => {
    if (onSearch) {
      onSearch(keyword);
    } else {
      handleSearch(keyword);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executeSearch();
  };

  const handleSearchClick = () => {
    executeSearch();
  };

  return (
    <div
      role="search"
      className={cn(
        "flex w-full items-center gap-0 sm:max-w-[480px]",
        className,
      )}
    >
      <div className="flex-1">
        <InputCommon
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword("")}
          placeholder={placeholder}
          className="focus:border-main-purple h-12 w-full rounded-xl border-slate-200 !bg-white pl-5 transition-all focus:bg-white sm:h-14"
          onKeyDown={handleKeyDown}
          aria-label="검색어 입력"
        />
      </div>

      <button
        onClick={handleSearchClick}
        className="hover:text-main-purple ml-4 flex shrink-0 items-center justify-center text-slate-400 transition-colors active:scale-90"
        aria-label="검색"
      >
        <Search size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}
