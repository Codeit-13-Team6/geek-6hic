"use client";

import { useSearchFilter } from "@/hooks/useSearchHooks";
import { InputCommon } from "./InputCommon";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  placeholder?: string;
  className?: string;
}

export default function SearchBarCommon({
  placeholder = "검색어를 입력하세요",
  className = "",
}: Props) {
  const { keyword, setKeyword, handleSearch } = useSearchFilter("keyword");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(keyword);
  };

  const handleSearchClick = () => {
    handleSearch(keyword);
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
        className="ml-4 hover:text-main-purple flex shrink-0 items-center justify-center text-slate-400 transition-colors active:scale-90"
        aria-label="검색"
      >
        <Search size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}
