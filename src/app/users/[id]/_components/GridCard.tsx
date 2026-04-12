"use client";

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

  const character = (userType && CHARACTER_MAP[userType]) || DEFAULT_CHARACTER;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-4xl border border-slate-100 p-5 text-indigo-950 shadow-md transition-all duration-700 sm:p-6 md:p-7 md:max-lg:min-h-90",
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

      <div className="relative z-10 mt-5 mb-2 flex flex-col items-center gap-3 md:my-5 md:mt-7 md:flex-1 md:flex-row md:items-center md:gap-5 lg:flex-col">
        {/* 3. 중앙 캐릭터 영역 (워터마크 마스킹) */}
        <div className="relative flex h-33 items-center justify-center overflow-hidden rounded-2xl md:h-48 md:w-1/2 md:shrink-0 lg:w-full">
          <img
            src={character.imgUrl.src}
            alt={character.title}
            className="relative z-10 w-auto scale-110 object-cover drop-shadow-lg md:scale-120"
          />
        </div>

        {/* 4. 하단 요약 정보 (문장 줄바꿈 로직) */}
        <div className="relative z-20 flex w-full flex-1 flex-col items-center justify-center border-t border-indigo-950/5 pt-3 text-center md:h-full md:items-start md:border-t-0 md:border-l md:pt-0 md:pl-5 md:text-left lg:items-center lg:border-t lg:border-l-0 lg:pt-4 lg:pl-0 lg:text-center">
          <p className="line-clamp-2 text-sm leading-relaxed font-bold text-indigo-950/80 md:line-clamp-none">
            {character.description}
          </p>
        </div>
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
