"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/SelectCommon";
import PostList from "@/components/features/list/PostList";
import SearchBarCommon from "@/components/ui/SearchBarCommon";
import { useSearchParams } from "next/navigation";

export default function LoungeClient() {
  const [sortValue, setSortValue] = useState("latest");
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("keyword") || "";

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "comment", label: "댓글순" },
    { value: "oldest", label: "오래된순" },
  ];

  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortValue,
  )?.label;

  return (
    <>
      <section className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBarCommon placeholder="원하는 내용을 검색해보세요" />
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
