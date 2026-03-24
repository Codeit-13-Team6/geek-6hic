"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { cn } from '@/lib/utils';

import demoImage from "@/assets/img/mock/banner-lg-demo.jpg";
import bannerLg from "@/assets/img/banner/banner-lg.png";
import bannerSm from "@/assets/img/banner/banner-sm.png";
import alram from "@/assets/icon/alarm/alarm-blue.svg";
import heartOn from "@/assets/icon/hearts/hearts-true.svg";
import heartOff from "@/assets/icon/hearts/hearts-false.svg";
import person from "@/assets/icon/person/person.svg";
import arrowDrop from "@/assets/icon/arrow/arrow-drop.svg";
import filter from "@/assets/icon/filter/filter.svg";
import { Progress } from "@/components/ui/ProgressCommon";

export default function Page() {

  // 탭 로직
  const tabBtn = ["전체", "팀미팅", "스터디", "취준생", "위워크", "기타"]
  const [activeIndex, setActiveIndex] = useState(0);

  // 마감됐을 때 dimd 조건 1 마감시간 지났을 때, 조건 2 인원 다 찼을 때(임시로직)
  function isMeetingClosed(meeting: {
    dateTime: string;
    participantCount: number;
    capacity: number;
  }) {
    const now = new Date();
    const isExpired = new Date(meeting.dateTime) < now;
    const isFull = meeting.participantCount >= meeting.capacity;

    return isExpired || isFull;
  }

  const mockMeetingList = [
    {
      id: 1,
      title: '건대 러닝 모임',
      subTitle: '스터디',
      type: '달램핏',
      region: '건대입구',
      dateTime: '2026-03-25T10:00:00',
      participantCount: 20,
      capacity: 20,
      image: demoImage,
      tags: {
        date: '1월 7일',
        time: '17:30',
        deadline: '오늘 21시 마감',
      },
    },
    {
      id: 2,
      title: '강남 헬스 번개',
      subTitle: '스터디',
      type: '달램핏',
      region: '강남',
      dateTime: '2026-03-26T19:00:00',
      participantCount: 8,
      capacity: 10,
      image: demoImage,
      tags: {
        date: '1월 7일',
        time: '17:30',
        deadline: '오늘 21시 마감',
      }
    },
    {
      id: 3,
      title: '홍대 요가 클래스',
      subTitle: '스터디',
      type: '달램핏',
      region: '홍대',
      dateTime: '2026-03-27T09:00:00',
      participantCount: 3,
      capacity: 8,
      image: demoImage,
      tags: {
        date: '1월 7일',
        time: '17:30',
        deadline: '오늘 21시 마감',
      }
    },
    {
      id: 4,
      title: '잠실 클라이밍 모임',
      subTitle: '스터디',
      type: '달램핏',
      region: '잠실',
      dateTime: '2026-03-28T14:00:00',
      participantCount: 10,
      capacity: 10,
      image: demoImage,
      tags: {
        date: '1월 7일',
        time: '17:30',
        deadline: '오늘 21시 마감',
      }
    },
  ];

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
            {mockMeetingList.map((meeting) => {
              const isClosed = isMeetingClosed(meeting);

              return (
                <div key={meeting.id} className="relative overflow-hidden rounded-3xl sm:flex sm:items-center sm:gap-5 sm:p-6 sm:bg-white sm:rounded-[32px] ">
                  <button className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white">
                    <div className="relative h-6 w-6">
                      <Image src={heartOff} fill alt="찜" />
                      {/* <Image src={heartOn} fill alt="찜" /> */}
                    </div>
                  </button>

                  <div className="relative h-39 w-full sm:w-[170px] sm:h-[170px] sm:rounded-3xl overflow-hidden">
                    <Image
                      src={meeting.image}
                      fill
                      alt="게시물 이미지"
                    />

                    {isClosed && (
                      <div className="absolute w-full h-full flex items-center justify-center bg-black/70">
                        <span className="font-[Tenada] rounded-full text-2xl font-semibold text-white">
                          모집 마감
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col bg-white p-4 sm:p-0 flex-1">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold text-black">{meeting.title}</h3>
                      <h4 className="text-sm font-semibold text-gray-500">{meeting.subTitle}</h4>
                    </div>

                    <div className="flex gap-2 mt-[14px] sm:mt-10 flex-wrap">
                      <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-sm text-gray-600">
                        {meeting.tags.date}
                      </span>
                      <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-sm text-gray-600">
                        {meeting.tags.time}
                      </span>
                      <span className="flex items-center gap-1 rounded-lg bg-[rgba(24,220,255,0.2)] px-2 py-0.5">
                        <span className="relative h-6 w-6">
                          <Image src={alram} fill alt="알람 아이콘" />
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {meeting.tags.deadline}
                        </span>
                      </span>
                    </div>

                    <div className="mt-5 flex items-center w-full">
                      <div className="relative h-4 w-4 shrink-0">
                        <Image src={person} fill alt="인원" />
                      </div>
                      <Progress
                        className="ml-[5px] w-full"
                        value={(meeting.participantCount / meeting.capacity) * 100}
                      />
                      <p className="ml-[13px]">
                        <span className="text-sm font-semibold text-green-500">
                          {meeting.participantCount}
                        </span>
                        <span className="text-sm text-gray-600">/{meeting.capacity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
