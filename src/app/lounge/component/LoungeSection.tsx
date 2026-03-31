"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { InputCommon } from "@/components/ui/InputCommon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/SelectCommon";
import PostList from "@/components/features/list/PostList";

export default function LoungeContent() {
  const [searchValue, setSearchValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortValue, setSortValue] = useState("latest");

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "comment", label: "댓글순" },
    { value: "oldest", label: "오래된순" },
  ];

  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortValue,
  )?.label;

  const triggerSearch = () => setSearchKeyword(searchValue);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") triggerSearch();
  };

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-0 sm:max-w-[480px]">
          <div className="flex-1">
            <InputCommon
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="검색어를 입력하세요."
              className="focus:!border-main-purple h-12 w-full !rounded-xl !border-slate-200 !bg-slate-50 !pl-5 transition-all focus:!bg-white sm:h-14"
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={triggerSearch}
            className="hover:text-main-purple flex h-12 w-12 shrink-0 items-center justify-center text-slate-400 transition-colors active:scale-90 sm:h-14 sm:w-14"
          >
            <Search size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex justify-end">
          <Select
            value={sortValue}
            onValueChange={(value) => value && setSortValue(value)}
          >
            <SelectTrigger className="h-12 w-[120px] !rounded-xl border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-900 sm:h-14 sm:w-[140px]">
              <SelectValue>{currentSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              sideOffset={2}
              align="end"
              className="z-50 min-w-[140px] overflow-hidden rounded-xl border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 outline-none"
            >
              <SelectGroup>
                {sortOptions.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="focus:text-main-purple cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-slate-50"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <PostList searchValue={searchKeyword} sortValue={sortValue} />
      </section>
    </>
  );
}
