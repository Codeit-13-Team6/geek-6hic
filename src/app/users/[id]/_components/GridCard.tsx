import { cn } from "@/lib/utils";
// 1. 이미지 실제 경로 import (보내주신 경로 구조 반영)
import lpiCharacterImg from "@/assets/img/character/LPI.png";

export default function GradeCard() {
  // 예시 데이터: LPI(열정적인 캡틴) - 마이페이지 어울리는 틴트 톤
  const character = {
    title: "열정적인 캡틴",
    type: "LPI",
    description:
      "항상 팀을 이끌며 새로운 도전을 즐기는 리더. 열정과 추진력으로 팀을 성공으로 이끈다.",
    imgUrl: lpiCharacterImg,
    // 🎨 마이페이지 화이트&퍼플 톤에 어울리는 연한 라벤더 그레이 베이스
    bgClass: "bg-slate-50",
  };

  return (
    <div
      className={cn(
        // 배경색을 Slate-50으로 변경, 글자색을 딥 퍼플(Indigo-950)로 변경
        "relative flex w-full max-w-sm flex-col overflow-hidden rounded-[32px] border border-slate-100 p-7 text-indigo-950 shadow-md transition-all duration-700",
        character.bgClass,
      )}
    >
      {/* 1. 배경 장식: COGIT (어두운 글씨 배경이므로 어두운 색으로 은은하게) */}
      <div className="absolute -top-9 -right-0.5 text-[7rem] font-black tracking-tighter text-indigo-950 italic opacity-[0.03] select-none">
        COGIT
      </div>

      {/* 2. 상단 헤더: 마이페이지 퍼플 포인트 컬러 적용 */}
      <div className="relative z-10 flex flex-col">
        <span className="text-xs font-bold tracking-[0.3em] text-purple-900 uppercase">
          Sprinter Garden
        </span>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black tracking-tight text-indigo-950">
            {character.title}
          </h3>
          <span className="text-xs font-bold text-indigo-950/40">
            {character.type}
          </span>
        </div>
      </div>

      {/* 3. 중앙 캐릭터 영역: 워터마크를 가리기 위한 핵심 수정 부분 */}
      <div className="relative z-10 my-5 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white/50 ring-1 ring-slate-100">
        {/* 캐릭터 발치 글로우 효과 */}
        <div className={cn("absolute h-32 w-32 rounded-full")} />

        {/* 💡 워터마크 가리기 포인트: scale로 키우고, translate-y로 하단을 밀어냄 */}
        <img
          src={character.imgUrl.src}
          alt={character.title}
          className="relative z-10 w-auto scale-120 object-cover"
        />
      </div>

      {/* 4. 하단 요약 정보: 설명 텍스트 가독성 확보 */}
      <div className="relative z-20 flex flex-col items-center border-t text-center">
        {/* 💡 마침표(.)를 기준으로 나누어 줄바꿈 처리 */}
        <p className="text-sm leading-relaxed font-bold text-indigo-950/80">
          {character.description.split(".").map((sentence, index, array) => (
            <span key={index}>
              {sentence.trim()}
              {/* 마지막 문장이 아닐 경우에만 마침표와 줄바꿈 추가 */}
              {index < array.length - 1 && (
                <>
                  .<br />
                </>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* 5. 카드 질감: 연한 배경에 입체감을 주는 퍼플 radial 그라데이션 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.08),transparent_70%)]" />
    </div>
  );
}
