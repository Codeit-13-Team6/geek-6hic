"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import crew1 from "@/assets/img/crew/crew1.png";
import crew2 from "@/assets/img/crew/crew2.png";
import crew3 from "@/assets/img/crew/crew3.png";
import crew4 from "@/assets/img/crew/crew4.png";
import crew5 from "@/assets/img/crew/crew5.png";

import lpiCharacterImg from "@/assets/img/character/lpi.png";
import lsaCharacterImg from "@/assets/img/character/lsa.png";

import wpiCharacterImg from "@/assets/img/character/wpi.png";
import wsaCharacterImg from "@/assets/img/character/wsa.png";
import wsiCharacterImg from "@/assets/img/character/wsi.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GitMerge,
  Github,
  Mail,
  MessagesSquare,
  Palette,
  Server,
  Zap,
} from "lucide-react";

import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiReact,
  SiReactquery,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_HREF = "https://github.com/Codeit-13-Team6/geek-6hic";
const CONTACT_EMAIL = "cogit.kr@gmail.com";

const PALETTE_ITEMS = [
  { name: "Surface", hex: "#F8F9FA" },
  { name: "Primary", hex: "#260656" },
  { name: "Point", hex: "#8200DB" },
  { name: "Light", hex: "#C27AFF" },
  { name: "Text", hex: "#0F172A" },
];

interface ToolItem {
  label: string;
  bgColor: string;
  textColor?: string;
  icon?: IconType;
  iconClassName?: string;
}

const TOOL_ITEMS: ToolItem[] = [
  {
    label: "React",
    bgColor: "#61DAFB",
    textColor: "#0F172A",
    icon: SiReact,
  },
  {
    label: "next.js",
    bgColor: "#111111",
    textColor: "#FFFFFF",
    icon: SiNextdotjs,
  },
  {
    label: "tailwind",
    bgColor: "#38BDF8",
    textColor: "#082F49",
    icon: SiTailwindcss,
  },
  {
    label: "TypeScript",
    bgColor: "#3178C6",
    textColor: "#FFFFFF",
    icon: SiTypescript,
  },
  {
    label: "TanStack Query",
    bgColor: "#FF4154",
    textColor: "#FFFFFF",
    icon: SiReactquery,
  },
  {
    label: "zustand",
    bgColor: "#8B5A36",
    textColor: "#FFFFFF",
  },
  {
    label: "BFF",
    bgColor: "#5B21B6",
    textColor: "#FFFFFF",
  },
  {
    label: "prefetch",
    bgColor: "#0F766E",
    textColor: "#FFFFFF",
  },

  {
    label: "Route Handler",
    bgColor: "#1D4ED8",
    textColor: "#FFFFFF",
  },

  {
    label: "Web Accessibility",
    bgColor: "#65A30D",
    textColor: "#FFFFFF",
  },
  {
    label: "Semantic Markup",
    bgColor: "#EA580C",
    textColor: "#FFFFFF",
  },
];

const SURVIVORS = [
  {
    head: "열정적인 캡틴",
    name: "유진",
    emoji: crew1,
    profile: lpiCharacterImg,
    review:
      "팀 전체 방향을 잡고, 구조와 일정이 흔들리지 않도록 끝까지 조율했습니다.",
  },
  {
    head: "지식 큐레이터",
    name: "제현",
    emoji: crew2,
    profile: lsaCharacterImg,
    review:
      "프론트엔드 전반의 코드 구조를 총괄하며, 일관성과 확장성을 기준으로 코드를 정리했습니다.",
  },
  {
    head: "공감형 러너",
    name: "상현",
    emoji: crew3,
    profile: wsiCharacterImg,
    review:
      "UI와 인터랙션을 담당하며, 화면 흐름이 자연스럽게 이어지도록 사용자 경험을 다듬었습니다.",
  },
  {
    head: "영향력있는 실무자",
    name: "민주",
    profile: wpiCharacterImg,
    emoji: crew4,
    review:
      "팀 내 소통을 중심에서 조율하며, 진행 상황을 공유하고 협업 흐름이 원활하게 이어지도록 지원했습니다.",
  },
  {
    head: "성실한 탐구자",
    name: "병택",
    profile: wsaCharacterImg,
    emoji: crew5,
    review:
      "모임 상세 페이지를 담당하며, 데이터 흐름과 사용자 경험이 자연스럽게 연결되도록 구현했습니다.",
  },
];

const NAME_ITEMS = [
  {
    key: "Co-",
    title: "함께 만들고, 함께 남기는 공간",
    description:
      "기수와 팀의 경계를 넘어 스프린터들이 모일 수 있는 라운지를 뜻합니다.",
  },
  {
    key: "git.",
    title: "기록하고, 이어가고, 기여하는 방식",
    description:
      "흩어지기 쉬운 정보와 시도를 남기고, 다음 사람이 다시 이어갈 수 있도록 담았습니다.",
  },
] as const;

const CONTRIBUTE_BODY =
  "우리가 만든 구조와 기록이 여기서 닫히지 않고, 이후의 스프린터도 이어서 참여할 수 있기를 바랐습니다.\n더 나은 기능이 떠올랐거나, 고치고 싶은 지점이 있다면 본 레포지토리에 이슈로 당신의 아이디어를 남겨 주세요.";

function StackChips({
  items,
  className = "",
}: {
  items: ToolItem[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <span
            key={item.label}
            className="inline-flex h-8 items-center gap-0.5 rounded-xl px-2 py-3 text-xs leading-none font-extrabold whitespace-nowrap shadow-[0_4px_14px_rgba(15,23,42,0.14)]"
            style={{
              backgroundColor: item.bgColor,
              color: item.textColor ?? "#FFFFFF",
            }}
          >
            {Icon ? (
              <Icon
                className={`size-3 shrink-0 ${item.iconClassName ?? ""}`}
                aria-hidden="true"
              />
            ) : null}
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}

function PaletteStrip({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {PALETTE_ITEMS.map((item) => (
        <div key={item.name} className="flex flex-col items-center gap-2">
          <div
            className="size-12 rounded-full border border-black/5 shadow-sm md:size-16"
            style={{ backgroundColor: item.hex }}
          />
          <div className="text-center">
            <p
              className={`text-[10px] font-black tracking-[0.2em] uppercase ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {item.name}
            </p>
            <p className="text-[11px] font-medium text-slate-500">{item.hex}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function NameCards({
  cardClassName,
  keyClassName,
  titleClassName,
  descriptionClassName,
}: {
  cardClassName: string;
  keyClassName: string;
  titleClassName: string;
  descriptionClassName: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {NAME_ITEMS.map((item) => (
        <div key={item.key} className={cardClassName}>
          <span className={keyClassName}>{item.key}</span>
          <h3 className={titleClassName}>{item.title}</h3>
          <p className={descriptionClassName}>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function SurvivorGrid({
  cardClassName,
  titleClassName,
  bodyClassName,
}: {
  cardClassName: string;
  titleClassName: string;
  bodyClassName: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {SURVIVORS.map((member) => (
        <article key={member.name} className={cardClassName}>
          <div className="relative aspect-video w-full">
            <Image src={member.profile} alt="" fill />
          </div>
          {/* <p className="text-3xl">{member.emoji}</p> */}
          <div className="py-10">
            <div className="flex items-center justify-center gap-1">
              <div className="-translate-y-1">
                <Image src={member.emoji} alt="" width={36} height={36} />
              </div>
              <h3 className={titleClassName}>
                <span className="text-main-purple">{member.head}</span>{" "}
                {member.name}
              </h3>
            </div>
            <p className={bodyClassName}>{member.review}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function StoryBody({
  wrapperClassName,
  titleClassName,
  bodyClassName,
}: {
  wrapperClassName: string;
  titleClassName: string;
  bodyClassName: string;
}) {
  return (
    <section className={wrapperClassName}>
      {/* <Heart className="text-main-purple mb-6 size-10" /> */}
      <h2 className={titleClassName}>5명의 프론트엔더 이야기</h2>
      <div className={bodyClassName}>
        <p>
          디자인도, 백엔드도 없는 상태에서 프론트엔드 5명의 이야기가
          시작됐습니다.
          <br />
          피그마 다룰 줄 아시는 분? 이라는 질문에서 출발해, 각자 참고할
          레퍼런스를 찾고 화면을 하나씩 맞춰가며 프로젝트를 구성해 나갔습니다.
          <br />
          기획서와 간단한 구조만 있는 상황에서, 직접 화면을 구성하고 데이터
          흐름을 맞추며 서비스를 만들어야 했습니다.
          <br />
          온라인으로 협업을 이어가며 10시간 이상을 소통하다보니 자연스럽게 팀원
          간의 유대감도 형성되었고, 기술적인 논의뿐 아니라 서로의 취향이나
          일상까지 공유하게 되었습니다.
          <br />
          존박, 윈터, 카리나 등 닮은 연예인을 이야기하며 분위기가 풀리기도 했고,
          그만큼 편하게 의견을 주고받을 수 있는 환경이 만들어졌습니다.
          <br />
          <br />
          랭킹보드와 코지드 가든 같은 부분을 구현해내기 위해 제공된 API를 그대로
          사용하는 것이 아니라, 제공되었던 리뷰 API 데이터를 <br />
          직접 조합하거나 우회적으로 끌어내며 아이디어를 실현해냈습니다. 그
          과정에서 다양한 시행착오를반복하며 데이터 흐름을 천천히, 하나씩 맞춰
          나갔습니다.
          <br />
          일부 데이터 구조를 프론트에서 보완하며 기능을 구현하면서 제공된 API와
          맞지 않는 부분은 기획을 다시 조정하는 과정을 무한반복했습니다.
          <br />
          그 과정에서 “이게 맞나?”라는 질문이 자연스럽게 나오기도 했지만, 답을
          찾는 방식도 점점 팀의 방식으로 정리되어 갔습니다.
          <br />
          <br />
          개발 과정은 쉽기만하기보다는, 문제를 정의하고 해결 방식을 계속 수정해
          나가는 반복에 가까웠습니다.
          <br />
          머지 충돌과 구현 방식에 대한 의견 차이는 있었지만, 초기 단계에서
          컨벤션을 정리하고 공유하며 코드 스타일과 작업 방식은 일관성을 유지한
          채 서로 격려하며 즐겁게 협업을 이어갔습니다.
          <br />
          결과적으로 저희에게 co-git는 단순한 결과물을 넘어, 팀의 기준을 함께
          만들어간 과정이자 스프린터들을 위한 오픈된 생태계로 이어지는
          프로젝트가 되었습니다. <br />
          앞으로도 co-git가 스프린터들에게 유용한 공간이 될 수 있도록 계속
          발전시켜 나가겠습니다. 즐거운 프로젝트였습니다!
        </p>
      </div>
      <div className="mt-8">
        <p className="mb-3 text-xs font-black tracking-[0.3em] text-slate-400 uppercase">
          Skills
        </p>
        <StackChips items={TOOL_ITEMS} className="text-slate-700" />
      </div>
    </section>
  );
}

function ContributeBlock({
  wrapperClassName,
  titleClassName,
  bodyClassName,
  buttonClassName,
}: {
  wrapperClassName: string;
  titleClassName: string;
  bodyClassName: string;
  buttonClassName: string;
}) {
  return (
    <section className={wrapperClassName}>
      <MessagesSquare className="text-main-purple mb-6 size-10" />
      <h2 className={titleClassName}>co-git는 모든기수에 열려 있습니다.</h2>
      <p className={bodyClassName}>{CONTRIBUTE_BODY}</p>
      <Link
        href={GITHUB_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName}
      >
        <Github className="size-5" />
        <span>이슈 남기러 가기</span>
      </Link>
    </section>
  );
}

function ContactBlock({
  wrapperClassName,
  titleClassName,
  bodyClassName,
  emailClassName,
}: {
  wrapperClassName: string;
  titleClassName: string;
  bodyClassName: string;
  emailClassName: string;
}) {
  return (
    <section className={wrapperClassName}>
      <Mail className="text-main-purple mb-5 size-9" />
      <h2 className={titleClassName}>co-git가 궁금하신가요?</h2>
      <p className={bodyClassName}>
        co-git에 대해 궁금한 점이 있거나, 전하고 싶은 이야기가 있다면 아래
        메일로 편하게 연락 주세요.
      </p>
      <a href={`mailto:${CONTACT_EMAIL}`} className={emailClassName}>
        {CONTACT_EMAIL}
      </a>
    </section>
  );
}

function useFadeUpGsap() {
  useEffect(() => {
    const targets = gsap.utils.toArray<HTMLElement>("[data-fade-up]");
    if (!targets.length) return;

    const tweenList: gsap.core.Tween[] = [];

    targets.forEach((el) => {
      gsap.set(el, {
        opacity: 0,
        y: 40,
      });

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tweenList.push(tween);
    });

    return () => {
      tweenList.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);
}

export default function AboutTeamPage() {
  useFadeUpGsap();
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const sectionRef1 = useRef<HTMLHeadingElement | null>(null);
  const sectionRef2 = useRef<HTMLHeadingElement | null>(null);
  const sectionRef3 = useRef<HTMLHeadingElement | null>(null);

  return (
    <div className="relative bg-[linear-gradient(180deg,#fdfbff_0%,#faf7ff_16%,#ffffff_42%,#fcf9ff_74%,#ffffff_100%)] pb-28 break-keep text-slate-900">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 2xl:px-0">
        <section
          ref={sectionRef1}
          id="section1"
          className="animate-fade-up relative flex h-[calc(100dvh-72px)] flex-col items-center justify-center overflow-hidden text-center"
        >
          <div className="flex max-w-[800px] flex-col items-center">
            <h1
              ref={titleRef}
              className="text-4xl leading-tight font-black tracking-tighter text-slate-900 md:text-6xl lg:text-7xl"
            >
              <span className="motion-txt block">스프린트가 끝나면,</span>
              <span className="motion-txt text-main-purple block">
                우리의 치열했던 기록들은
              </span>
              <span className="motion-txt text-main-purple block">
                어디로 갈까요?
              </span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed font-medium tracking-tight text-slate-500 md:text-xl">
              정성껏 쓴 노션 페이지는 기수가 끝나면 닫히고, <br /> 열심히 올려둔
              디스코드 메시지는 스크롤 속으로 사라집니다.
              <br />
              우리는 밤새워 고민했던 코드와 꿀팁들이 허공으로 사라지는 것이
              아쉬웠습니다.
            </p>
          </div>
        </section>

        <section ref={sectionRef2} data-fade-up className="w-full">
          <div className="mb-20 rounded-[2.5rem] bg-white/92 px-6 py-10 shadow-[0_30px_80px_rgba(38,6,86,0.08)] sm:p-10">
            <div className="flex justify-center">
              <GitMerge className="text-main-purple size-8" strokeWidth={2} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-black tracking-tighter text-slate-950 md:text-5xl">
              그 기록들이 흩어지지 않도록,
              <br className="hidden sm:block" />
              우리는 공유하는 저장소를 만들기로 했습니다.
            </h2>
            <div className="mt-10">
              <NameCards
                cardClassName="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm"
                keyClassName="text-main-purple text-5xl font-black"
                titleClassName="mt-4 text-2xl font-black text-slate-950"
                descriptionClassName="mt-4 text-[15px] leading-7 font-medium text-slate-600"
              />
            </div>
          </div>
        </section>

        <section ref={sectionRef3} data-fade-up className="mb-20 w-full">
          <div className="calc-area rounded-[2.8rem] bg-[linear-gradient(135deg,#2b154d,#111827)] px-6 py-10 text-white shadow-2xl sm:p-10 md:p-14">
            <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
              우리가 만든 방식
            </h2>
            <p className="mt-5 text-lg leading-8 font-bold text-slate-200">
              기다림을 줄이고, 결을 맞추고, 흐름을 이었습니다.
            </p>
            <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:flex-col sm:overflow-visible md:grid md:grid-cols-3">
              <article className="max-h-[400px] w-full shrink-0 snap-start overflow-y-auto rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-100 sm:max-h-[unset] sm:min-w-0 sm:overflow-visible">
                <Server className="mb-6 size-8 text-blue-300" />
                <h3 className="text-2xl font-black">
                  기다립니다. <br /> 기다림을 줄이기 위해.
                </h3>
                <p className="mt-4 text-sm leading-7 break-keep text-slate-300">
                  디자인이 아무리 시선을 끌어도,
                  <br />
                  기다리는 시간은 언제나 길게 느껴지니까요.
                  <br />
                  <br />
                  Server-side Prefetch와 HydrationBoundary로 <br />
                  첫 화면에 필요한 데이터를 먼저 준비했습니다.
                  <br />
                  <br />
                  이 선택은 BFF 설계로 이어졌습니다.
                  <br />
                  화면에 필요한 정보를 더 빠르게 보여줄 수 없을까,
                  <br />
                  그 고민이 저희를 Next 서버 중심 구조로 이끌었습니다.
                  <br />
                  <br />
                  서버 중심의 인증과 데이터 흐름,
                  <br />
                  브라우저가 토큰을 직접 다루며 겪던 불안정함의 완화,
                  <br />
                  프론트엔드에 더 적합한 데이터 형태를 제공합니다.
                  <br />
                  <br />
                  이제 기다리는 일은, 저희가 하겠습니다.
                </p>
              </article>

              <article className="max-h-[400px] w-full shrink-0 snap-start overflow-y-auto rounded-[2rem] border border-[#c27aff]/20 bg-[linear-gradient(180deg,rgba(194,122,255,0.14),rgba(255,255,255,0.04))] p-8 text-slate-100 shadow-[0_0_0_1px_rgba(194,122,255,0.05)] sm:max-h-[unset] sm:min-w-0 sm:overflow-visible">
                <Palette className="text-main-purple-light mb-6 size-8" />
                <h3 className="text-2xl font-black">
                  맞춰갑니다. <br />
                  오래 남는 인상을 위해.
                </h3>
                <p className="mt-4 text-sm leading-7 break-keep text-slate-300">
                  강한 대비와 선명한 포인트 컬러,
                  <br />
                  굵은 타이포와 리듬감 있는 여백으로 먼저 시선을 끌었습니다.
                  <br />
                  <br />
                  하지만 겉모습의 화려함에만 머물진 않았습니다.
                  <br />
                  <br />
                  신중하게 쌓은 컴포넌트 규칙과
                  <br />
                  Surface, Primary, Point, Light, Text
                  <br />
                  다섯 가지 기준으로 화면의 결을 정리했습니다.
                  <br />
                  <br />
                  보이는 아름다움과 쓰이는 아름다움이 함께 가도록,
                  <br />
                  같은 감각이 반복되는 경험을 만들었습니다.
                  <br />
                  <br />
                  저희의 첫 인상이 마지막 사용 순간까지 이어지도록!
                </p>
                <div className="mt-8">
                  <PaletteStrip dark />
                </div>
              </article>

              <article className="max-h-[400px] w-full shrink-0 snap-start overflow-y-auto rounded-[2rem] border border-yellow-200/10 bg-[linear-gradient(180deg,rgba(250,204,21,0.1),rgba(255,255,255,0.04))] p-8 text-slate-100 sm:max-h-[unset] sm:min-w-0 sm:overflow-visible">
                <Zap className="mb-6 size-8 text-yellow-300" />
                <h3 className="text-2xl font-black">
                  흘러갑니다. <br />
                  머무는 모든 순간이 끊기지 않도록.
                </h3>
                <p className="mt-4 text-sm leading-7 break-keep text-slate-300">
                  최선을 다해 고민해낸 기획들은 <br />
                  제공된 API 만으론 온전히 담아낼 수 없었습니다. <br /> <br />
                  우린 프론트엔드에 머물지 않고, <br />
                  우리만의 방식으로 엮어낸 설계를 지향합니다.
                  <br /> <br />
                  하나밖에 남길 수 없던 모임 댓글은 <br />
                  마음껏 대화를 이어갈 수 있는 공간이 되었고, <br />
                  누구나 들어올 수 있던 모임은 <br />
                  우리만의 비밀 이야기로 가득 찰 수 있게 되었습니다. <br />{" "}
                  <br />
                  비밀 모임, 랭킹, Hot 게시물, 모임 스레드, 활동 차트, <br />
                  이 모든것은 저희가 끝까지 고민한 흔적입니다. <br /> <br />
                  사용자가 부족함을 느끼지 않도록, <br />
                  부족한 API 스펙이 서비스의 모자람으로 포장되지 않도록. <br />{" "}
                  <br />
                  이렇게 설계한 흐름은 머무는 이유가 되고, <br />
                  다시 돌아올 이유가 될 것 입니다. <br /> <br />
                  다음 행동이 자연스럽게 이어지도록 흐름을 우선했기에 <br />
                  기능이 동작하는 수준 이상의 자연스러운 경험을 만들어냅니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section data-fade-up>
          <StoryBody
            wrapperClassName="rounded-[2.5rem] bg-white/92 px-6 py-10 sm:p-10 shadow-[0_30px_80px_rgba(38,6,86,0.07)] md:p-14"
            titleClassName="text-3xl font-black tracking-tighter text-slate-950 md:text-4xl"
            bodyClassName="mt-8 text-[15px] leading-8 font-medium text-slate-600"
          />
        </section>

        <section
          className="mt-20 rounded-[2.5rem] bg-white/92 px-6 py-10 shadow-[0_30px_80px_rgba(38,6,86,0.07)] sm:p-10 md:p-14"
          data-fade-up
        >
          <h2 className="mt-6 text-3xl font-black tracking-tighter text-slate-950 md:text-4xl">
            이 모든 걸 함께한 팀원들
          </h2>
          <div className="mt-10">
            <SurvivorGrid
              cardClassName="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm"
              titleClassName="text-xl font-black text-slate-950"
              bodyClassName="px-8 mt-3 text-sm leading-7 text-slate-600"
            />
          </div>
        </section>

        <section data-fade-up>
          <ContributeBlock
            wrapperClassName="flex flex-col items-center rounded-[2.8rem] bg-[linear-gradient(135deg,#31175a,#111827)] px-6 py-10 sm:p-10 text-center text-white shadow-2xl md:p-14 mt-20"
            titleClassName="max-w-3xl text-3xl leading-tight font-black tracking-tighter text-white md:text-5xl"
            bodyClassName="mt-6 max-w-2xl whitespace-pre-line text-[15px] leading-8 font-medium text-slate-300"
            buttonClassName="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 transition-transform hover:-translate-y-0.5"
          />
        </section>

        <section data-fade-up>
          <ContactBlock
            wrapperClassName="flex flex-col items-center rounded-[2.5rem] border border-white/10 bg-white/95 px-6 py-10 sm:p-10 text-center shadow-sm md:p-14 mt-20"
            titleClassName="text-3xl font-black tracking-tighter text-slate-950"
            bodyClassName="mt-4 max-w-2xl text-[15px] leading-8 font-medium text-slate-600"
            emailClassName="text-main-purple mt-7 text-xl font-black tracking-tight md:text-3xl"
          />
        </section>
      </div>
    </div>
  );
}
