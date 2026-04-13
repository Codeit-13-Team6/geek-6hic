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

export default function GradeCardSkeleton() {
  const [index, setIndex] = useState(0);
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowAnimated(true), 700);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showAnimated) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SPRINTER_CHARACTERS.length);
    }, 280);

    return () => clearInterval(timer);
  }, [showAnimated]);

  const currentCharacter = SPRINTER_CHARACTERS[index];
  const nextCharacter =
    SPRINTER_CHARACTERS[(index + 1) % SPRINTER_CHARACTERS.length];

  if (!showAnimated) {
    return (
      <div className="relative flex h-full min-h-105 w-full flex-col overflow-hidden rounded-4xl bg-[#FDFCFB] p-8 shadow-inner ring-1 ring-black/5">
        <div className="mt-2 space-y-3">
          <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200/70" />
          <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-200/60" />
        </div>

        <div className="my-8 flex flex-1 items-center justify-center">
          <div className="h-36 w-36 animate-pulse rounded-full bg-indigo-100/60" />
        </div>

        <div className="space-y-3">
          <div className="mb-1 h-9 w-40 animate-pulse rounded-full bg-indigo-100/70" />
          <div className="h-3 w-full animate-pulse rounded-md bg-slate-200/60" />
          <div className="h-3 w-5/6 animate-pulse rounded-md bg-slate-200/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-105 w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-[#FDFCFB] p-8 shadow-inner ring-1 ring-black/5">
      <div className="relative z-10 mb-8 text-center">
        <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase">
          당신은 어떤 <span className="text-indigo-600">스프린터</span>일까요?
        </h3>
        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Analyzing your garden...
        </p>
      </div>

      <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 z-0 animate-pulse opacity-20 blur-sm">
          <Image
            src={nextCharacter.imgUrl}
            alt="잔상"
            fill
            className="scale-125 object-contain"
          />
        </div>

        <div className="relative z-10 h-32 w-32 transition-transform duration-150">
          <Image
            src={currentCharacter.imgUrl}
            alt={currentCharacter.label}
            fill
            priority
            className="object-contain drop-shadow-md"
          />
        </div>

        <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-100 opacity-40" />
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-3 inline-block rounded-full bg-indigo-50 px-5 py-2 shadow-inner ring-1 ring-indigo-100/50">
          <span className="text-sm font-bold text-indigo-700">
            {currentCharacter.label}?
          </span>
        </div>
        <p className="text-sm leading-relaxed font-bold text-slate-600">
          소중한 기록과 모임들을 하나하나 살펴보고 있어요.
          <br />
          <span className="text-indigo-500">
            당신만의 특별한 성장 타입을 곧 찾아드릴게요!
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
