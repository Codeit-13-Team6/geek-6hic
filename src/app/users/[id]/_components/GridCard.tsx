import { cn } from "@/lib/utils";

interface GradeCardProps {
  level?: number;
}

// 레벨별 테마 설정 (배경색, 포인트컬러, 배경텍스트 모두 포함)
const TIER_CONFIG = [
  {
    max: 10,
    label: "씨앗 스프린터 🌰",
    bg: "bg-[#451a03]", // 조금 더 붉은기 없는 묵직한 딥 브라운 (Earth)
    color: "text-amber-400",
  },
  {
    max: 30,
    label: "새싹 스프린터 🌱",
    bg: "bg-[#854d0e]", // 촌스러운 노랑 대신, 씨앗과 연결되는 황금빛 올리브/머스터드
    color: "text-amber-200", // 글자 시인성 향상
  },
  {
    max: 60,
    label: "성장 스프린터 🌿",
    bg: "bg-[#064e3b]", // 아주 깊고 세련된 딥 에메랄드 (Forest Green)
    color: "text-emerald-300",
  },
  {
    max: 90,
    label: "나무 스프린터 🌳",
    bg: "bg-[#260656]", // 민주님의 시그니처 딥 퍼플 (Royal Purple)
    color: "text-fuchsia-300", // 화이트보다 살짝 연보라색이 섞여야 훨씬 세련돼 보여요
  },
  {
    max: Infinity,
    label: "숲 스프린터 🏕️",
    bg: "bg-[#020617]", // 완벽한 마무리를 위한 미드나잇 네이비 블랙
    color: "text-yellow-400",
  },
];

export default function GradeCard({ level = 80 }: GradeCardProps) {
  const tier = TIER_CONFIG.find((t) => level <= t.max) || TIER_CONFIG[0];

  return (
    <div
      className={cn(
        "duration-700lg:mt-4 relative h-full overflow-hidden rounded-[40px] p-10 text-white shadow-lg transition-all lg:p-7",
        tier.bg, // 레벨에 따라 배경색 변경
      )}
    >
      <div className="absolute -right-5 -bottom-4 text-9xl font-black italic opacity-10 select-none">
        CG
      </div>

      {/* 상단 텍스트 영역 */}
      <div className="relative z-10 mb-6 flex flex-col gap-1.5 lg:mb-7">
        <span className="text-[11px] font-bold tracking-[0.3em] text-white/40 uppercase">
          Sprint Grade
        </span>
        <h3 className="text-2xl font-black tracking-tighter sm:text-3xl lg:text-[34px]">
          {tier.label}
        </h3>
      </div>

      {/* 하단 정보 영역 */}
      <div className="relative z-10 mt-auto flex items-end justify-start">
        {/* 레벨 배지 (좌측 정렬) */}
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/45 uppercase">
            Current Level
          </span>
          <div
            className={cn(
              "py-2.5 text-4xl font-black tracking-[0.12em] italic transition-colors duration-500 md:text-5xl lg:text-2xl",
              // "rounded-2xl bg-white/10 px-4 py-2 text-[13px] font-black tracking-widest italic ring-1 ring-white/20 backdrop-blur-md transition-colors duration-500",

              tier.color, // 레벨 숫자의 색상도 변경
            )}
          >
            LV. {level}
          </div>
        </div>
      </div>

      {/* 카드 표면 질감: 배경색이 바뀔 때 이 그라데이션이 빛 반사 효과를 줘서 훨씬 고급스러워요 */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-50" />
    </div>
  );
}
