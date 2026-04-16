"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { UserType } from "@/app/users/[id]/_lib/userType";
import {
  CHARACTER_MAP,
  DEFAULT_CHARACTER,
} from "@/app/users/[id]/_components/gradeCharacters";

interface GradeCardProps {
  userType?: UserType;
}

export default function GradeCard({ userType }: GradeCardProps) {
  const [isMobileFlipped, setIsMobileFlipped] = useState(false);
  const character = (userType && CHARACTER_MAP[userType]) || DEFAULT_CHARACTER;

  // sm이상으로 갈때 flip 정보 원복시키는 로직
  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
  
    const handleMediaChange = () => {
      if (media.matches) {
        setIsMobileFlipped(false);
      }
    };
  
    handleMediaChange();
  
    media.addEventListener("change", handleMediaChange);
    return () =>
      media.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-100 pt-6 text-indigo-950 shadow-sm transition-all duration-500",
        "h-[380px] sm:h-auto sm:min-h-[300px] lg:h-[420px]",
        character.bgClass,
      )}
    >
      {/* 배경 데코 */}
      <div
        className="absolute -top-4 -right-2 text-8xl font-black tracking-tighter italic opacity-[0.03] select-none"
        aria-hidden="true"
      >
        COGIT
      </div>

      {/* 모바일/데스크탑용 헤더 */}
      <div className="relative z-10 mb-4 flex flex-col gap-1 px-6 sm:hidden lg:flex">
        <span
          className={cn(
            "text-[10px] font-black tracking-[0.2em] uppercase opacity-60",
            character.accentColor,
          )}
        >
          Type
        </span>
        <div className="mt-2 flex items-baseline justify-between sm:hidden lg:flex">
          <h3 className="text-2xl font-black tracking-tight text-slate-950">
            {character.title}
          </h3>
          <button
            type="button"
            onClick={() => setIsMobileFlipped((prev) => !prev)}
            className="lg:hidden"
          >
            <span className="rounded-full bg-white/30 px-3 py-1 text-[9px] font-bold tracking-widest text-indigo-950/50 uppercase">
              해설보기
            </span>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-stretch sm:flex-row lg:flex-col lg:items-center lg:gap-0">
        {/* 이미지 영역 */}
        <div className="lg-border-none relative h-70 w-full shrink-0 overflow-hidden rounded-b-2xl sm:-mt-6 sm:h-auto sm:flex-1 sm:rounded-none sm:border-r-[0.2px] sm:border-slate-700/20 lg:mt-0 lg:h-50 lg:w-[90%] lg:flex-none lg:rounded-2xl">
          <div
            className={cn(
              "relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] sm:pointer-events-none",
              "lg:mx-auto lg:mt-3 lg:h-45 lg:w-full lg:flex-none lg:rounded-2xl",
              isMobileFlipped && "[transform:rotateY(180deg)]",
            )}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Image
                src={character.imgUrl}
                alt={character.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 500px"
                className="scale-110 object-cover"
              />
            </div>
            {/* 모바일 뒷면 */}
            <div className="absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center bg-white/20 p-6 text-center backdrop-blur-md [backface-visibility:hidden]">
              <p className="text-sm font-bold break-keep text-indigo-950/80">
                {character.description}
              </p>
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-[1.2] flex-col justify-start sm:gap-10 sm:p-6 sm:pl-10 lg:gap-3 lg:pl-6 lg:text-center">
          {/* 태블릿용 타이틀 */}
          <div className="mb-3 hidden flex-col gap-1 sm:
          lex lg:hidden">
            <span
              className={cn(
                "text-[9px] font-black tracking-[0.2em] uppercase opacity-60",
                character.accentColor,
              )}
            >
              Type
            </span>
            <h3 className="text-2xl leading-tight font-black tracking-tight text-slate-950">
              {character.title}
            </h3>
          </div>

          <p className="hidden leading-relaxed font-semibold break-keep text-slate-950/70 sm:block sm:text-sm lg:tracking-tight">
            {character.description}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${character.glowColor}15, transparent 80%)`,
        }}
      />
    </div>
  );
}
