"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { cn } from '@/lib/utils';

import demoImage from "@/assets/img/mock/banner-lg-demo.jpg";
import alram from "@/assets/icon/alarm/alarm-blue.svg";
import heartOn from "@/assets/icon/hearts/hearts-true.svg";
import heartOff from "@/assets/icon/hearts/hearts-false.svg";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";

export default function Page() {

  // 탭 로직
  const tabBtn = ["전체", "팀미팅", "스터디", "취준생", "위워크", "기타"]
  const [activeIndex, setActiveIndex] = useState(0);

  // 마감됐을 때 dimd 조건 1 마감시간 지났을 때, 조건 2 인원 다 찼을 때
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
      participantCount: 4,
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
      <div className="w-full bg-gray-50 sm:pt-10 lg:pt-[48px]">
        <div className="flex items-center pl-4 mx-auto w-full h-48 max-w-[1280px] bg-[#9debcd] bg-[url('/img/banner/banner-lg-demo.jpg')] bg-cover bg-center bg-no-repeat">
          <div>
            <h4 className="text-sm text-green-700">함께할 사람을 찾고 계신가요?</h4>
            <h3 className="mt-[10px] text-lg font-semibold">지금 모임에 참여해보세요</h3>
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
              <button>날짜 전체</button>
              <button>마감 임박</button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {mockMeetingList.map((meeting) => (
              <div key={meeting.id} className="relative rounded-3xl overflow-hidden">
                <button className="z-1 absolute top-4 right-4 rounded-full border border-gray-200 bg-white w-10 h-10 flex items-center justify-center cursor-pointer">
                  <div className="relative w-6 h-6">
                    <Image src={heartOff} fill alt="찜하기" />
                    {/* <Image src={heartOn} fill alt="찜하기" /> */}
                  </div>
                </button>
                <div className="relative w-full h-39">
                  <Image src={meeting.image} fill alt="게시물 이미지" />
                </div>
                <div className="flex flex-col p-4 bg-white">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-black">{meeting.title}</h3>
                    <h4 className="text-sm font-semibold text-gray-500">{meeting.subTitle}</h4>
                  </div>
                  <div className="flex gap-2 pt-[14px]">
                    <span className="px-2 py-0.5 rounded-lg text-gray-600 text-sm border border-gray-200">{meeting.tags.date}</span>
                    <span className="px-2 py-0.5 rounded-lg text-gray-600 text-sm border border-gray-200">{meeting.tags.time}</span>
                    <span className="px-2 py-0.5 rounded-lg flex items-center gap-1 bg-[rgba(24,220,255,0.2)]">
                      <span className="relative w-6 h-6"><Image src={alram} fill alt="알람 아이콘" /></span>
                      <span className="text-blue-600 font-semibold text-sm">{meeting.tags.deadline}</span>
                    </span>
                  </div>
                  <div className="flex items-center mt-5">
                    <div className="relative w-4 h-4 shrink-0">
                      <Image src={person} fill alt="인원" />
                    </div>
                    <Progress className="ml-[5px] w-full" value={(meeting.participantCount / meeting.capacity) * 100} />
                    <p className="ml-[13px]">
                      <span className="color-green-500 text-sm font-semibold">{meeting.participantCount}</span>
                      <span className="color-gray-600 text-sm">/{meeting.capacity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
