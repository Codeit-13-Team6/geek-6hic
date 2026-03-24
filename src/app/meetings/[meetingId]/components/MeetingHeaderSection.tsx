"use client";

import Image from "next/image";

import crownLgIcon from "@/assets/icon/crown/crown-lg.svg";
import heartsFalse from "@/assets/icon/hearts/hearts-false.svg";
import meatballsLgIcon from "@/assets/icon/meatballs/meatballs-lg.svg";
import { BtnCommon } from "@/components/ui/BtnCommon";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/ProgressCommon";
import { TagCommon } from "@/components/ui/TagCommon";
import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";

const formatMonthDay = (value: string) => {
  const date = new Date(value);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatHourMinute = (value: string) => {
  const date = new Date(value);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

interface MeetingHeaderSectionProps {
  data: MeetingDetailData;
  currentTimestamp: number;
}

export function MeetingHeaderSection({
  data,
  currentTimestamp,
}: MeetingHeaderSectionProps) {
  const progressValue = (data.participantCount / data.capacity) * 100;
  const isStarted = new Date(data.dateTime).getTime() <= currentTimestamp;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
      <div className="overflow-hidden rounded-[32px] bg-gray-100">
        <Image
          src={data.image}
          alt={data.name}
          width={760}
          height={520}
          className="h-full min-h-[280px] w-full object-cover"
        />
      </div>

      <div className="space-y-5">
        <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <TagCommon variant="blue">오늘 2시 마감</TagCommon>
                <TagCommon variant="white">
                  {formatMonthDay(data.dateTime)}
                </TagCommon>
                <TagCommon variant="white">
                  {formatHourMinute(data.dateTime)}
                </TagCommon>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="text-[34px] leading-[42px] font-semibold text-gray-900">
                  {data.name}
                </h1>
                {data.isHost ? (
                  <Image src={crownLgIcon} alt="" width={24} height={24} />
                ) : null}
              </div>
            </div>

            <button
              type="button"
              className="rounded-full border border-transparent p-1 transition hover:bg-gray-50"
            >
              <Image
                src={meatballsLgIcon}
                alt="메뉴 열기"
                width={32}
                height={32}
              />
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <BtnCommon
              type="button"
              variant="teritary"
              size="icon-md"
              className="size-16 shrink-0 rounded-full"
            >
              <Image src={heartsFalse} alt="찜하기" width={24} height={24} />
            </BtnCommon>

            <BtnCommon
              type="button"
              size="md"
              className="h-16 w-auto min-w-0 flex-1 rounded-[18px]"
            >
              {isStarted ? "출석하기" : "참여하기"}
            </BtnCommon>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#c7f5e8] bg-[#e6fbf5] p-8">
          <div className="mb-4 flex items-center gap-3">
            <p className="text-main-green-700 text-[28px] font-semibold">
              {data.participantCount}명 참여
            </p>
          </div>

          <Progress value={progressValue} className="gap-2">
            <ProgressLabel className="sr-only">참여 진행률</ProgressLabel>
            <ProgressValue className="sr-only">
              {(formattedValue) =>
                formattedValue ?? `${data.participantCount}/${data.capacity}`
              }
            </ProgressValue>
          </Progress>
          <div className="mt-2 flex justify-end text-sm text-gray-500">
            최대 {data.capacity}명
          </div>
        </div>
      </div>
    </section>
  );
}
