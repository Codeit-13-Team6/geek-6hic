"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import LoungePostListCommon from "@/components/common/LoungePostListCommon";
import { InputCommon } from "@/components/common/InputCommon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/common/SelectCommon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/PaginationCommon";
import { BtnCommon } from "@/components/common/BtnCommon";
import { HotListCardCommon } from "@/components/common/HotListCardCommon";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts";

export default function LoungePage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("latest");

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "oldest", label: "오래된순" },
  ];

  const { data: hotResponse } = useQuery({
    queryKey: ["posts", "best"],
    queryFn: () => getPosts({ type: "best", size: 5 }),
  });
  const hotList = hotResponse?.data || [];
  const handlePostCreate = () => {
    router.push("/lounge/create");
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
            이번주 HOT 게시물
          </h2>

          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 sm:gap-6">
            {hotList.map((post) => (
              <HotListCardCommon
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

        <section className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[400px]">
            <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-gray-400" />
            <InputCommon
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="궁금한 내용을 검색해보세요."
              className="!bg-white !pl-11"
              inputSize="lg"
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
                <SelectValue>
                  {sortOptions.find((item) => item.value === sortValue)?.label}
                </SelectValue>
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
          <LoungePostListCommon
            searchValue={searchValue}
            sortValue={sortValue}
          />
        </section>

        {/* 추후 로직 추가 */}
        <section className="mt-8 flex justify-center sm:mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" disabled={true} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
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
