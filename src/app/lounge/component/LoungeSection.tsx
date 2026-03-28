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
      <section className="mt-8 flex flex-col sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-row items-center gap-3 sm:max-w-[500px]">
          <InputCommon
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
            placeholder="궁금한 내용을 검색해보세요."
            className="rounded-4xl !bg-white !pl-5 !text-sm sm:!h-[50px] sm:!text-base"
            inputSize="sm"
            onKeyDown={handleKeyDown}
          />
          <Search
            className="size-6 cursor-pointer text-gray-400 hover:text-gray-600 sm:size-7"
            onClick={triggerSearch}
          />
        </div>

        <div className="mt-4 flex w-full justify-end sm:mt-0 sm:w-auto">
          <Select
            value={sortValue}
            onValueChange={(value) => value && setSortValue(value)}
          >
            <SelectTrigger className="!h-[50px] w-[120px] !rounded-[12px] px-4 text-sm font-medium text-gray-800 sm:w-[140px]">
              <SelectValue>{currentSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[120px] sm:w-[140px]">
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

      <section className="mt-6 sm:mt-8">
        <PostList searchValue={searchKeyword} sortValue={sortValue} />
      </section>
    </>
  );
}
