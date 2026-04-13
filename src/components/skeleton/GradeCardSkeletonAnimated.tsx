"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import lpaCharacterImg from "@/assets/icon/character/LPA.png";
import lpiCharacterImg from "@/assets/icon/character/LPI.png";
import lsaCharacterImg from "@/assets/icon/character/LSA.png";
import lsiCharacterImg from "@/assets/icon/character/LSI.png";
import wpaCharacterImg from "@/assets/icon/character/WPA.png";
import wpiCharacterImg from "@/assets/icon/character/WPI.png";
import wsaCharacterImg from "@/assets/icon/character/WSA.png";
import wsiCharacterImg from "@/assets/icon/character/WSI.png";

const SPRINTER_CHARACTERS: Array<{ label: string; imgUrl: StaticImageData }> = [
  { label: "열정적인 캡틴", imgUrl: lpiCharacterImg },
  { label: "고독한 설계자", imgUrl: lpaCharacterImg },
  { label: "커뮤니티 마스터", imgUrl: lsiCharacterImg },
  { label: "지식 큐레이터", imgUrl: lsaCharacterImg },
  { label: "영향력 있는 실무자", imgUrl: wpiCharacterImg },
  { label: "전문 기록가", imgUrl: wpaCharacterImg },
  { label: "공감형 러너", imgUrl: wsiCharacterImg },
  { label: "성실한 탐구자", imgUrl: wsaCharacterImg },
];

export default function GradeCardSkeletonAnimated() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SPRINTER_CHARACTERS.length);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const currentCharacter = SPRINTER_CHARACTERS[index];
  const nextCharacter =
    SPRINTER_CHARACTERS[(index + 1) % SPRINTER_CHARACTERS.length];

  return (
    <div className="relative flex h-full min-h-105 w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-[#FDFCFB] p-8 shadow-inner ring-1 ring-black/5">
      <div className="relative z-10 mb-5 text-center">
        <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase">
          당신은 어떤 <span className="text-indigo-600">스프린터</span>일까요?
        </h3>
      </div>

      <div className="relative mb-6 flex h-50 w-50 items-center justify-center">
        <div className="absolute inset-0 z-0 animate-pulse opacity-20 blur-md">
          <Image
            src={nextCharacter.imgUrl}
            alt="잔상"
            fill
            className="scale-90 object-contain"
          />
        </div>

        <div className="relative z-10 h-50 w-50 transition-transform duration-1000">
          <Image
            src={currentCharacter.imgUrl}
            alt={currentCharacter.label}
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-indigo-100 opacity-40" />
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-4 inline-block rounded-full bg-indigo-50 px-5 py-2 shadow-inner ring-1 ring-indigo-100/50">
          <span className="text-sm font-bold text-indigo-700">
            {currentCharacter.label}?
          </span>
        </div>
        <p className="text-sm leading-relaxed font-bold text-slate-600">
          첫 모임을 열거나 게시글을 남겨 보세요.
          <br />
          <span className="text-indigo-500">
            특별한 성장 타입을 찾아드릴게요!
          </span>
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-100 blur-3xl" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-100 blur-3xl" />
      </div>
    </div>
  );
}
