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
import PostList from "../../../components/features/list/PostList";

export default function LoungeContent() {
  const [searchValue, setSearchValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortValue, setSortValue] = useState("latest");

  const sortOptions = [
    { value: "latest", label: "LATEST" },
    { value: "popular", label: "POPULAR" },
    { value: "comment", label: "COMMENTS" },
    { value: "oldest", label: "OLDEST" },
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
      <section className="mt-16 flex flex-col gap-6 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-row items-center gap-4 sm:max-w-[480px]">
          <div className="relative flex-1">
            <InputCommon
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="궁금한 아카이브를 검색하세요."
              className="rounded-xl border-slate-200 !bg-white !pr-12 !pl-5 text-sm font-medium transition-all focus:border-[#260656]/50 sm:!h-[54px]"
              inputSize="sm"
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={triggerSearch}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#260656]"
            >
              <Search className="size-5 sm:size-6" />
            </button>
          </div>
        </div>

        <div className="flex justify-end sm:w-auto">
          <Select
            value={sortValue}
            onValueChange={(value) => value && setSortValue(value)}
          >
            <SelectTrigger className="!h-[54px] w-[130px] !rounded-xl border-slate-200 !bg-white px-5 text-[10px] font-black tracking-widest text-slate-900 uppercase focus:ring-0 sm:w-[150px]">
              <SelectValue>{currentSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-slate-950 bg-white shadow-xl">
              <SelectGroup>
                {sortOptions.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer font-bold focus:bg-[#260656] focus:text-white"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="mt-10 sm:mt-14">
        <PostList searchValue={searchKeyword} sortValue={sortValue} />
      </section>
    </>
  );
}
