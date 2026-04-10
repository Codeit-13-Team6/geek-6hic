"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  CHARACTER_MAP,
  DEFAULT_CHARACTER,
  type UserType,
} from "@/app/users/[id]/_components/gradeCharacters";

interface GradeCardProps {
  userType?: UserType;
}

export default function GradeCard({ userType }: GradeCardProps) {
  const character = useMemo(
    () => (userType && CHARACTER_MAP[userType]) || DEFAULT_CHARACTER,
    [userType],
  );

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm flex-col overflow-hidden rounded-[32px] border border-slate-100 p-7 text-indigo-950 shadow-md transition-all duration-700",
        character.bgClass,
      )}
    >
      {/* 1. 배경 장식: COGIT */}
      <div className="absolute -top-9 -right-0.5 text-[7rem] font-black tracking-tighter text-indigo-950 italic opacity-[0.03] select-none">
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
          Sprinter Garden
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

      {/* 3. 중앙 캐릭터 영역 (워터마크 마스킹) */}
      <div className="relative z-10 my-5 mt-7 flex h-48 items-center justify-center overflow-hidden rounded-2xl">
        <img
          src={character.imgUrl.src}
          alt={character.title}
          className="relative z-10 w-auto scale-120 object-cover drop-shadow-lg"
        />
      </div>

      {/* 4. 하단 요약 정보 (문장 줄바꿈 로직) */}
      <div className="relative z-20 flex flex-col items-center border-t border-indigo-950/5 pt-4 text-center">
        <p className="text-sm leading-relaxed font-bold text-indigo-950/80">
          {character.description}
        </p>
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
