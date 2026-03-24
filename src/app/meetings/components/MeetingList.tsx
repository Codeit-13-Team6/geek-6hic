"use client";

import Image from "next/image";
import demoImage from "@/assets/img/mock/banner-lg-demo.jpg";
import alram from "@/assets/icon/alarm/alarm-blue.svg";
import heartOn from "@/assets/icon/hearts/hearts-true.svg";
import heartOff from "@/assets/icon/hearts/hearts-false.svg";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";

export default function MeetingList() {

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
    </>
  );
}