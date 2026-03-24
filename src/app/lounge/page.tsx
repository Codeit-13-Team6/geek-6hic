"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import PostList from "@/components/features/list/PostList";
import { InputCommon } from "@/components/ui/InputCommon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/SelectCommon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/PaginationCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { HotListCard } from "@/components/features/card/HotListCard";
import { useRouter } from "next/navigation";
import { useGetHotPosts } from "@/hooks/queries/usePosts";

export default function LoungePage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortValue, setSortValue] = useState("latest");

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "oldest", label: "오래된순" },
  ];

  const { data: hotResponse } = useGetHotPosts();
  const hotList = hotResponse || [];

  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortValue,
  )?.label;

  const handlePostCreate = () => {
    router.push("/lounge/create");
  };

  const triggerSearch = () => {
    setSearchKeyword(searchValue);
    // 여기에 추가로 '페이지를 1페이지로 리셋'하는 로직을 넣을 수 있음
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") triggerSearch();
  };

  return (
    <div className="w-full bg-gray-50 pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full sm:mr-2 sm:size-[54px]">
              <span className="text-3xl sm:text-5xl">💬</span>
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 sm:text-[24px] lg:text-[32px]">
                스프린트 라운지
              </h1>
              <p className="mt-1 text-base font-medium text-gray-500 sm:text-lg lg:text-xl">
                코드잇 스프린터의 정보 공유 라운지
              </p>
            </div>
          </div>

          <BtnCommon
            onClick={handlePostCreate}
            size="fixedSize"
            className="hidden w-auto px-6 sm:flex"
          >
            + 게시물 등록하기
          </BtnCommon>
        </div>

        <section className="mt-8 sm:mt-12">
          <h2 className="mb-4 text-[18px] font-bold text-gray-900 sm:mb-6 sm:text-[20px]">
            | 이번주 HOT 게시물
          </h2>

          <div className="scrollbar-hide flex gap-4 overflow-x-auto p-0.5 pt-1 pb-4 sm:gap-6">
            {hotList.map((post) => (
              <HotListCard
                key={post.id}
                title={post.title}
                date={post.createdAt}
                imageSrc={post.image}
                thumbsUp={post.likeCount}
                comment={post._count.comments}
                onDetailClick={() => router.push(`/lounge/${post.id}`)}
              />
            ))}
          </div>
        </section>

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
              onClick={() => setSearchKeyword(searchValue)}
            />
          </div>

          <div className="flex w-full justify-end sm:w-auto">
            <Select
              value={sortValue}
              onValueChange={(value) => {
                if (value) {
                  setSortValue(value);
                }
              }}
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

        {/* 추후 로직 추가 */}
        <section className="mt-8 flex justify-center sm:mt-12"></section>
      </div>

      <BtnCommon
        onClick={handlePostCreate}
        size="icon-md"
        className="fixed right-4 bottom-6 z-50 size-14 pb-1 text-3xl leading-none shadow-lg transition-transform hover:scale-105 sm:hidden"
      >
        +
      </BtnCommon>
    </div>
  );
}
