"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserType } from "@/lib/userType";
import {
  CHARACTER_MAP,
  DEFAULT_CHARACTER,
} from "@/app/users/[id]/_components/gradeCharacters";

interface GradeCardProps {
  userType?: UserType;
}

export default function GradeCard({ userType }: GradeCardProps) {
  "use memo";

  const [isMobileFlipped, setIsMobileFlipped] = useState(false);
  const character = (userType && CHARACTER_MAP[userType]) || DEFAULT_CHARACTER;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-4xl border border-slate-100 p-5 text-indigo-950 shadow-md transition-all duration-700 sm:p-5 md:max-lg:min-h-22.5",
        character.bgClass,
      )}
    >
      {/* 1. 배경 장식: COGIT */}
      <div
        className="absolute -top-9 -right-0.5 text-[7rem] font-black tracking-tighter text-indigo-950 italic opacity-[0.03] select-none"
        aria-hidden="true"
      >
        COGIT
      </div>

      {/* 2. 상단 헤더 */}
      <div className="relative z-10 mt-3 flex flex-col">
        <span
          className={cn(
            "text-xs font-bold tracking-[0.25em] uppercase",
            character.accentColor,
          )}
        >
          Cogit Garden
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <h3 className="text-2xl font-black tracking-tight text-indigo-950">
            {character.title}
          </h3>
          {/* <span className="text-xs font-bold text-indigo-950/40">
            {character.type}
          </span> */}
        </div>
      </div>

      <div className="relative z-10 mt-5 mb-2 flex flex-col items-center gap-3 md:my-5 md:mt-7 md:flex-1 md:flex-row md:items-center md:gap-5 lg:flex-col">
        {/* 모바일: 탭하면 이미지 ↔ 설명 플립 */}

        <button
          type="button"
          onClick={() => setIsMobileFlipped((prev) => !prev)}
          aria-label={
            isMobileFlipped ? "캐릭터 이미지 보기" : "캐릭터 설명 보기"
          }
          aria-pressed={isMobileFlipped}
          className={cn(
            "relative h-43 w-full text-left transition-transform duration-500 transform-3d md:hidden",
            isMobileFlipped && "transform-[rotateY(180deg)]",
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl backface-hidden">
            <Image
              src={character.imgUrl}
              alt={character.title}
              fill
              sizes="(max-width: 767px) 100vw, 0px"
              className="relative z-10 scale-120 object-contain drop-shadow-lg"
            />
          </div>

          <div className="absolute inset-0 flex transform-[rotateY(180deg)] items-center justify-center rounded-2xl border border-indigo-950/10 bg-white/60 p-4 text-center backface-hidden">
            <p className="text-sm leading-relaxed font-bold break-keep text-indigo-950/80">
              {character.description}
            </p>
          </div>
        </button>
        <span className="block text-center text-[11px] font-bold tracking-wide text-indigo-950/50 md:hidden">
          이미지를 클릭해보세요!
        </span>

        {/* 태블릿/데스크탑: 기존 레이아웃 */}
        <>
          {/* 3. 중앙 캐릭터 영역 (워터마크 마스킹) */}
          <div className="relative hidden h-48 items-center justify-center overflow-hidden rounded-2xl md:flex md:w-1/2 md:shrink-0 lg:w-full">
            <Image
              src={character.imgUrl}
              alt={character.title}
              fill
              sizes="(max-width: 1023px) 50vw, 310px"
              className="relative z-10 scale-120 object-contain drop-shadow-lg"
            />
          </div>

          {/* 4. 하단 요약 정보 (문장 줄바꿈 로직) */}
          <div className="relative z-20 hidden w-full flex-1 flex-col items-center justify-center border-t border-indigo-950/5 pt-3 text-center md:flex md:h-full md:items-start md:border-t-0 md:border-l md:pt-0 md:pl-5 md:text-left lg:items-center lg:border-t lg:border-l-0 lg:pt-4 lg:pl-0 lg:text-center">
            <p className="line-clamp-2 text-sm leading-relaxed font-bold break-keep text-indigo-950/80 md:line-clamp-none">
              {character.description}
            </p>
          </div>
        </>
      </div>

      {/* 5. 타입별 동적 그라데이션 질감 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${character.glowColor}, transparent 70%)`,
        }}
      />
    </div>
  );
}
