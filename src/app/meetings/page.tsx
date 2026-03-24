"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from '@/lib/utils';

import bannerLg from "@/assets/img/banner/banner-lg.png";
import bannerSm from "@/assets/img/banner/banner-sm.png";
import arrowDrop from "@/assets/icon/arrow/arrow-drop.svg";
import filter from "@/assets/icon/filter/filter.svg";
import MeetingList from "./components/MeetingList";

export default function Page() {

  // 탭 로직
  const tabBtn = ["전체", "팀미팅", "스터디", "취준생", "위워크", "기타"]
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="w-full bg-gray-50 sm:pt-6 lg:pt-[48px]">
        <div className="relative overflow-hidden flex items-center pl-4 mx-auto w-full min-h-48 bg-[#9debcd] bg-[url('/img/banner/banner-lg-demo.jpg')] bg-cover bg-center bg-no-repeat sm:bg-none sm:max-w-[calc(100%-48px)] sm:rounded-3xl sm:min-h-61">
          <div>
            <h4 className="text-sm text-green-700">함께할 사람을 찾고 계신가요?</h4>
            <h3 className="mt-[10px] text-lg font-semibold">지금 모임에 참여해보세요</h3>
            <div className="absolute left-[323px] top-7 w-117 h-[273px] hidden sm:block">
              <Image src={bannerLg} fill alt=""/>
            </div>
            <div className="absolute w-134 h-[313px] hidden">
              <Image src={bannerSm} fill alt=""/>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col mt-6 mb-4">
            <ul className="flex gap-[10px] overflow-x-auto">
              {tabBtn.map((tab, index) => (
                <li
                  key={tab}
                  className={cn(
                    'shrink-0 rounded-[14px] transition-colors',
                    activeIndex === index
                      ? 'bg-gray-700 text-white font-bold'
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  <button
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => setActiveIndex(index)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex mt-2">
              <button className="py-1 px-2 flex items-center gap-0.5 text-base text-gray-600 font-bold">
                <span>날짜 전체</span>
                <div className="relative w-[17px] h-[17px]">
                  <Image src={arrowDrop} fill alt="날짜전체" />
                </div>
              </button>
              <button className="py-1 px-2 flex items-center gap-0.5 text-base text-gray-600 font-bold">
                <div className="relative w-[17px] h-[17px]">
                  <Image src={filter} fill alt="마감 임박" />
                </div>
                <span>마감 임박</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
            <MeetingList />
          </div>
        </div>
      </div>
    </>
  );
}
