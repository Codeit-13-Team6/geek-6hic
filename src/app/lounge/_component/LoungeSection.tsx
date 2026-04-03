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
      <section className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-0 sm:max-w-[480px]">
          <div className="flex-1">
            <InputCommon
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="검색어를 입력하세요."
              className="!bg-white focus:!border-main-purple h-12 w-full !rounded-xl !border-slate-200  !pl-5 transition-all focus:!bg-white sm:h-14"
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
            <SelectTrigger>
              <SelectValue>{currentSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              sideOffset={2}
              align="end"
            >
              <SelectGroup>
                {sortOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
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
