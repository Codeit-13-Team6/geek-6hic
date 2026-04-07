import React from "react";

interface GradeCardProps {
  daysSinceJoin?: number;
  level?: number;
  tierLabel?: string;
}

export default function GradeCard({
  daysSinceJoin = 1,
  level = 5,
  tierLabel = "새싹 스프린터 🌱",
}: GradeCardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-[#260656] p-8 text-white shadow-lg lg:p-10">
      {/* 배경 장식 (데코레이션) */}
      <div className="absolute -right-6 -bottom-6 text-9xl font-black italic opacity-10 select-none">
        CG
      </div>

      {/* 상단 텍스트 영역 */}
      <div className="relative z-10 mb-10 flex flex-col gap-1.5">
        <span className="text-[11px] font-bold tracking-[0.3em] text-white/40 uppercase">
          Sprint Grade
        </span>
        <h3 className="text-3xl font-black tracking-tighter sm:text-4xl">
          {tierLabel}
        </h3>
      </div>

      {/* 하단 정보 영역 (함께한 날짜 & 레벨) */}
      <div className="relative z-10 mt-auto flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium tracking-wider text-white/50 uppercase">
            Stayed with us
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black">
              {daysSinceJoin}
            </span>
            <span className="text-sm font-bold text-white/40 uppercase italic">
              Days
            </span>
          </div>
        </div>

        {/* 레벨 배지 */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl bg-white/10 px-4 py-2 text-[13px] font-black tracking-widest italic ring-1 ring-white/20 backdrop-blur-md">
            LV.{level}
          </div>
        </div>
      </div>

      {/* 카드 뒷면임을 암시하는 모바일용 그라데이션 효과 (선택사항) */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/5 to-transparent" />
    </div>
  );
}
