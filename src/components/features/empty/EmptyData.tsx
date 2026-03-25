"use client";

import Image from "next/image";
import emptyImage from "@/assets/img/empty/img-empty.jpg";

type EmptyStateVariant =
  | "meeting"
  | "lank"
  | "lounge"
  | "myMeeting"
  | "myCreatMeeting";

type EmptyStateProps = {
  variant?: EmptyStateVariant;
};

const emptyText = {
  meeting: "아직 모임이 없어요 \n 지금 바로 모임을 만들어보세요!",
  lank: "아직 랭킹이 없어요",
  lounge: "아직 게시물이 없어요",
  myMeeting: "아직 신청한 모임이 없어요",
  myCreatMeeting: "아직 내가만든 모임이 없어요",
} as const;

function EmptyData({ variant = "meeting" }: EmptyStateProps) {
  const text = emptyText[variant];

  return (
    <div className="flex flex-col items-center">
      <div className="img-box">
        <Image
          width={121}
          height={72}
          src={emptyImage}
          alt="데이터가 없습니다."
          className="mix-blend-multiply"
        />
      </div>

      <p className="font-regular mt-6 text-center text-sm whitespace-pre-line text-gray-500 md:text-base">
        {text}
      </p>
    </div>
  );
}

export { EmptyData };
