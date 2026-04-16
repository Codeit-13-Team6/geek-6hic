import type { StaticImageData } from "next/image";
import type { UserType } from "@/app/users/[id]/_lib/userType";
import lpiCharacterImg from "@/assets/img/character/lpi.png";
import lpaCharacterImg from "@/assets/img/character/lpa.png";
import lsaCharacterImg from "@/assets/img/character/lsa.png";
import lsiCharacterImg from "@/assets/img/character/lsi.png";
import wpaCharacterImg from "@/assets/img/character/wpa.png";
import wpiCharacterImg from "@/assets/img/character/wpi.png";
import wsaCharacterImg from "@/assets/img/character/wsa.png";
import wsiCharacterImg from "@/assets/img/character/wsi.png";
import seedCharacterImg from "@/assets/img/character/seed.png";

export interface GradeCharacter {
  title: string;
  type: string;
  description: string;
  imgUrl: StaticImageData;
  bgClass: string;
  accentColor: string;
  glowColor: string;
}

export const gradeCharacters: GradeCharacter[] = [
  {
    title: "열정적인 캡틴",
    type: "LPI",
    description:
      "팀을 이끌고 새로운 도전을 즐기는 성향이 강합니다. 열정과 추진력으로 팀에 활력을 불어넣을 잠재력이 돋보이네요.",
    imgUrl: lpiCharacterImg,
    bgClass: "bg-[#dbe4ff]", // 채도를 높인 라벤더
    accentColor: "text-purple-700",
    glowColor: "rgba(139, 92, 246, 0.2)",
  },
  {
    title: "고독한 설계자",
    type: "LPA",
    description:
      "프로젝트의 기초를 닦고 완벽한 설계를 추구하는 타입입니다. 묵묵히 결과물로 증명해내는 능력을 가졌습니다.",
    imgUrl: lpaCharacterImg,
    bgClass: "bg-[#E0F2FE]", // 선명한 스카이
    accentColor: "text-sky-700",
    glowColor: "rgba(14, 165, 233, 0.2)",
  },
  {
    title: "커뮤니티 마스터",
    type: "LSI",
    description:
      "활발한 소통으로 사람들을 모으는 데 소질이 있습니다. 배움의 즐거움을 함께 나누는 분위기 메이커의 자질이 엿보입니다.",
    imgUrl: lsiCharacterImg,
    bgClass: "bg-[#FFE4E6]", // 선명한 로즈
    accentColor: "text-rose-700",
    glowColor: "rgba(244, 63, 94, 0.18)",
  },
  {
    title: "지식 큐레이터",
    type: "LSA",
    description:
      "방대한 정보를 체계적으로 정리하고 공유하는 데 탁월한 성향을 가졌습니다. 지식의 뼈대를 세우며 팀의 성장을 돕는 리더 타입입니다.",
    imgUrl: lsaCharacterImg,
    bgClass: "bg-[#c2edca]", // 선명한 에메랄드
    accentColor: "text-emerald-800",
    glowColor: "rgba(16, 185, 129, 0.18)",
  },
  {
    title: "영향력 있는 실무자",
    type: "WPI",
    description:
      "실전 경험을 생생한 기록으로 남기는 데 흥미를 느낍니다. 자신의 인사이트로 동료들에게 긍정적인 자극을 주는 영향력이 기대됩니다.",
    imgUrl: wpiCharacterImg,
    bgClass: "bg-[#fad9c5]", // 따뜻한 오렌지 틴트
    accentColor: "text-orange-700",
    glowColor: "rgba(249, 115, 22, 0.18)",
  },
  {
    title: "전문 기록가",
    type: "WPA",
    description:
      "프로젝트 과정을 세밀하게 기록하고 데이터를 모으는 데 특화된 성향입니다. 흩어진 정보를 가치 있는 자산으로 만드는 능력이 탁월합니다.",
    imgUrl: wpaCharacterImg,
    bgClass: "bg-[#f5d5ab]", // 🤎 요청하신 갈색(Muted Brown/Beige) 베이스
    accentColor: "text-amber-900",
    glowColor: "rgba(120, 66, 18, 0.15)",
  },
  {
    title: "공감형 러너",
    type: "WSI",
    description:
      "함께 배우는 과정에서 즐거움을 찾고 깊이 공감하는 타입입니다. 소소한 기록을 통해 따뜻한 유대를 형성하는 데 강점이 있습니다.",
    imgUrl: wsiCharacterImg,
    bgClass: "bg-[#FAE8FF]", // 선명한 푸시아
    accentColor: "text-fuchsia-700",
    glowColor: "rgba(217, 70, 239, 0.18)",
  },
  {
    title: "성실한 탐구자",
    type: "WSA",
    description:
      "매일 꾸준히 학습 데이터를 쌓으며 자신만의 내실을 다지는 데 집중하는 성향입니다. 조용하지만 가장 단단하게 성장할 잠재력을 품고 있습니다.",
    imgUrl: wsaCharacterImg,
    bgClass: "bg-[#FEF9C3]", // 선명한 옐로우
    accentColor: "text-yellow-700",
    glowColor: "rgba(234, 179, 8, 0.2)",
  },
  {
    title: "씨앗 스프린터",
    type: "SEED",
    description:
      "아직 정원이 비어있네요! 첫 게시글을 남기거나 모임을 열어 나만의 정원을 가꾸기 시작해 보세요. 당신은 어떤 성장의 꽃을 피우게 될까요?",
    imgUrl: seedCharacterImg, // 씨앗 전용 이미지 (없다면 가장 기본이 되는 캐릭터 이미지)
    bgClass: "bg-[#c7b4a3]", // 아주 연한 인디고 (시작의 순수함)
    accentColor: "text-indigo-1000",
    glowColor: "rgba(245, 230, 200, 90)",
  },
];

export const CHARACTER_MAP: Record<UserType, GradeCharacter> =
  gradeCharacters.reduce(
    (acc, char) => ({ ...acc, [char.type]: char }),
    {} as Record<UserType, GradeCharacter>,
  );

export const DEFAULT_CHARACTER = CHARACTER_MAP["SEED"];
