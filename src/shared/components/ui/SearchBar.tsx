"use client";

import { InputCommon } from "./InputCommon";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  initialValue?: string;
  placeholder?: string;
  queryKey?: string;
  className?: string;
  onSearch: (keyword: string) => void;
}

export default function SearchBar({
  initialValue = "",
  placeholder = "검색어를 입력하세요",
  className,
  onSearch,
}: Props) {
  const [keyword, setKeyword] = useState(initialValue);

  useEffect(() => {
    setKeyword(initialValue);
  }, [initialValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(keyword);
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
        onClick={() => onSearch(keyword)}
        className="hover:text-main-purple ml-4 flex shrink-0 items-center justify-center text-slate-400 transition-colors active:scale-90"
        aria-label="검색"
      >
        <Search size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}
