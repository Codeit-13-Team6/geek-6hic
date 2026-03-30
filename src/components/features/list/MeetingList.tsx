"use client";

import Image from "next/image";
import demoImage from "@/assets/img/mock/banner-lg-demo.jpg";
import alram from "@/assets/icon/alarm/alarm-blue.svg";
import heartOff from "@/assets/icon/hearts/hearts-false.svg";
import heartOn from "@/assets/icon/hearts/hearts-true.svg";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";
import { JoinedMeeting, MeetingListProps } from "@/types";


export default function MeetingList({
  meetingList,
  onItemClick,
  sortValue,
  onHeartClick,
}: MeetingListProps) {
  // 마감날짜 계산기
  function getDeadlineLabel(registrationEnd: string) {
    const endDate = new Date(registrationEnd);
    const now = new Date();

    const isSameYear = endDate.getFullYear() === now.getFullYear();
    const isSameMonth = endDate.getMonth() === now.getMonth();
    const isSameDate = endDate.getDate() === now.getDate();

    const isToday = isSameYear && isSameMonth && isSameDate;

    if (!isToday) return null;

    const hours = String(endDate.getHours()).padStart(2, "0");

    return `오늘 ${hours}시 마감`;
  }

  // 날짜
  function formatDate(dateTime: string) {
    const date = new Date(dateTime);

    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  // 시간
  function formatTime(dateTime: string) {
    const date = new Date(dateTime);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function isMeetingClosed(item: JoinedMeeting) {
    const now = new Date();
    const isRegistrationClosed = new Date(item.registrationEnd) < now;
    const isFull = item.participantCount >= item.capacity;

    return isRegistrationClosed || isFull;
  }

  const visibleMeetingList =
    sortValue === "deadline"
      ? meetingList.filter((item) => !isMeetingClosed(item))
      : meetingList;

  return (
    <>

      {visibleMeetingList.map((item) => {
        const isClosed = isMeetingClosed(item);
        const deadLine = getDeadlineLabel(item.registrationEnd);

        const overlayLabel = item.isJoined
          ? "참여 완료"
          : isClosed
            ? "모집 마감"
            : null;
        return (

          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className="relative cursor-pointer overflow-hidden rounded-3xl sm:flex sm:items-center sm:gap-5 sm:rounded-[32px] sm:bg-white sm:p-6"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHeartClick(item);
              }}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white"
            >
              <div className="relative h-6 w-6">
                <Image
                  src={item.isFavorited ? heartOn : heartOff}
                  fill
                  alt="찜"
                />
              </div>
            </button>

            <div className="relative h-39 w-full overflow-hidden sm:h-[170px] sm:w-[170px] sm:rounded-3xl">
              <Image
                src={item.image || demoImage}
                fill
                alt="게시물 이미지"
                unoptimized
              />

              {overlayLabel && (
                <div className="absolute flex h-full w-full items-center justify-center bg-black/70">
                  <span className="rounded-full font-[Tenada] text-2xl font-semibold text-white">
                    {overlayLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col bg-white p-4 sm:p-0">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-black">
                  {item.name}
                </h3>
                <h4 className="text-sm font-semibold text-gray-500">
                  {item.type}
                </h4>
              </div>

              <div className="mt-[14px] flex flex-wrap gap-2 sm:mt-10">
                <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-sm text-gray-600">
                  {formatDate(item.dateTime)}
                </span>
                <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-sm text-gray-600">
                  {formatTime(item.dateTime)}
                </span>
                {deadLine ? (
                  <span className="flex items-center gap-1 rounded-lg bg-[rgba(24,220,255,0.2)] px-2 py-0.5">
                    <span className="relative h-6 w-6">
                      <Image src={alram} fill alt="알람 아이콘" />
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {deadLine}
                    </span>
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex w-full items-center">
                <div className="relative h-4 w-4 shrink-0">
                  <Image src={person} fill alt="인원" />
                </div>
                <Progress
                  className="ml-[5px] w-full"
                  value={(item.participantCount / item.capacity) * 100}
                />
                <p className="ml-[13px]">
                  <span className="text-sm font-semibold text-green-500">
                    {item.participantCount}
                  </span>
                  <span className="text-sm text-gray-600">
                    /{item.capacity}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
