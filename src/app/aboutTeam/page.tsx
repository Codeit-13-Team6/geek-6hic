"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import crew1 from "@/assets/img/crew/crew1.png";
import crew3 from "@/assets/img/crew/crew3.png";
import crew4 from "@/assets/img/crew/crew4.png";
import crew5 from "@/assets/img/crew/crew5.png";
import wsa from "@/assets/img/character/wsa.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GitMerge,
  Github,
  Heart,
  Mail,
  MessagesSquare,
  Palette,
  QuoteIcon,
  Server,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);


const GITHUB_HREF = "https://github.com/Codeit-13-Team6/geek-6hic";
const CONTACT_EMAIL = "contact@co-git.team";

const PALETTE_ITEMS = [
  { name: "Surface", hex: "#F8F9FA" },
  { name: "Primary", hex: "#260656" },
  { name: "Point", hex: "#8200DB" },
  { name: "Light", hex: "#C27AFF" },
  { name: "Text", hex: "#0F172A" },
];

const TOOL_ITEMS = ["React", "next.js", "zustand", "BFF", "prefetch"];

const STORY_PARAGRAPHS = [
  "\"우리 디자인은 누가 해?\" 프로젝트 첫 주, 피그마에 놓인 회색 박스들을 보며 다 같이 멈칫했습니다. 하지만 곧 화면 레퍼런스를 찾고, border-radius 1px 차이까지 이야기하는 팀이 되어갔습니다.",
  "물론 고요한 날만 있었던 건 아닙니다. 새벽 디스코드에서 401 에러와 씨름하던 날, 머지 충돌에 동시에 멘탈이 흔들리던 날, API가 없어서 서버에서 데이터를 다시 모아야 했던 날도 있었습니다.",
  "그 시간을 지나고 보니 남은 건 단순한 결과물이 아니라, 같이 부딪히며 기준을 세운 팀의 흔적이었습니다. co-git도 그런 흔적 위에 서 있습니다.",
];

const SURVIVORS = [
  {
    name: "유진",
    emoji: crew1,
    profile: wsa,
    review: "팀 전체 방향을 잡고, 구조와 일정이 흔들리지 않도록 끝까지 조율했습니다. 나는 카리나 ㅋ 로켓펀쳐~",
  },
  {
    name: "제현",
    emoji: crew1,
    profile: wsa,
    review: "프론트엔드 전반의 코드 구조를 총괄하며, 일관성과 확장성을 기준으로 코드를 정리했습니다.",
  },
  {
    name: "상현",
    emoji: crew3,
    profile: wsa,
    review: "UI와 인터랙션을 담당하며, 화면 흐름이 자연스럽게 이어지도록 사용자 경험을 다듬었습니다.",
  },
  {
    name: "민주",
    profile: wsa,
    emoji: crew4,
    review: "드디어 끝났다 개꿀 ㅋ 담배가져와 ㅋ 드디어 끝났다 개꿀 ㅋ 담배가져와 ㅋ",
  },
  {
    name: "병택",
    profile: wsa,
    emoji: crew5,
    review: "모임 상세 페이지를 담당하며, 데이터 흐름과 사용자 경험이 자연스럽게 연결되도록 구현했습니다.",
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
  "우리가 만든 구조와 기록이 여기서 닫히지 않고, 이후의 스프린터도 이어서 참여할 수 있기를 바랐습니다.\n더 나은 기능이 떠올랐거나, 고치고 싶은 지점이 있다면 이 저장소 위에 당신의 방식도 남겨 주세요.";

function StackChips({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-current/10 bg-white/70 px-3 py-1 text-xs font-bold"
        >
          {item}
        </span>
      ))}
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
              className={`text-[10px] font-black tracking-[0.2em] uppercase ${dark ? "text-slate-400" : "text-slate-500"
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
          <div className="relative w-full aspect-video">
            <Image src={member.profile} alt="" fill />
          </div>
          {/* <p className="text-3xl">{member.emoji}</p> */}
          <div className="py-10">
            <div className="flex items-center gap-1 justify-center">
              <Image src={member.emoji} alt="" width={36} height={36} />
              <h3 className={titleClassName}><span className="text-main-purple">커뮤니티 마스터</span> {member.name}</h3>
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
      <h2 className={titleClassName}>
        5명의 프론트엔더 이야기
      </h2>
      <div className={bodyClassName}>
        <p>"우리 디자인은 누가 해?" 프로젝트 첫 주, 피그마에 놓인 박스들을 보며 다 같이 멈칫했습니다. 하지만 곧 화면 레퍼런스를 찾고, border-radius 1px 차이까지 이야기하는 팀이 되어갔습니다.
          물론 고요한 날만 있었던 건 아닙니다. 새벽 디스코드에서 401 에러와 씨름하던 날, 머지 충돌에 동시에 멘탈이 흔들리던 날, API가 없어서 서버에서 데이터를 다시 모아야 했던 날도 있었습니다.
          그 시간을 지나고 보니 남은 건 단순한 결과물이 아니라, 같이 부딪히며 기준을 세운 팀의 흔적이었습니다. co-git도 그런 흔적 위에 서 있습니다.</p>
      </div>
      <div className="mt-8">
        <p className="mb-3 text-xs font-black tracking-[0.3em] uppercase text-slate-400">
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
      <h2 className={titleClassName}>co-git는 다음 기수에게도 열려 있습니다</h2>
      <p className={bodyClassName}>{CONTRIBUTE_BODY}</p>
      <Link
        href={GITHUB_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName}
      >
        <Github className="size-5" />
        <span>같이 놀기</span>
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
        co-git에 대해 궁금한 점이 있거나, 전하고 싶은 이야기가 있다면 아래 메일로
        편하게 연락 주세요.
      </p>
      <a href={`mailto:${CONTACT_EMAIL}`} className={emailClassName}>{CONTACT_EMAIL}</a>
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

  // 모션 start
  // 우리가 만든 방식
  // useEffect(() => {
  //   const sectionEl = sectionRef3.current;

  //   if (!sectionEl) return;
  //   const vh = window.innerHeight;
  //   const articles = sectionEl.querySelector(".calc-area");
  //   const fadeUp = sectionEl.querySelector(".fade-up-gsap");
  //   const articlesH = (articles as HTMLElement).offsetHeight;
  //   const offset = (vh - articlesH) / 2;

  //   const mm = gsap.matchMedia();

  //   mm.add("(min-width: 1280px)", () => {
  //     const articleList = sectionEl.querySelectorAll("article");
  //     if (!articleList.length) return;

  //     gsap.set(articleList, {
  //       opacity: 0,
  //       y: 60,
  //     });

  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: sectionEl,
  //         start: `top +=${offset}`,
  //         end: "bottom top",
  //         pin: true,
  //         scrub: 1,
  //         // markers: true,
  //       },
  //     });

  //     ScrollTrigger.refresh();

  //     // 타임라인 시작
  //     tl.to(fadeUp, {
  //       opacity: 1,
  //       y: 0,
  //       duration: 0.8,
  //       ease: "power3.out",
  //     })

  //     articleList.forEach((article, index) => {
  //       tl.to(
  //         article,
  //         {
  //           opacity: 1,
  //           y: 0,
  //           duration: 1,
  //         },
  //         index
  //       );
  //     });

  //     return () => {
  //       tl.scrollTrigger?.kill();
  //       tl.kill();
  //     };
  //   });

  //   return () => {
  //     mm.revert();
  //   };
  // }, []);

  return (
    <div className="relative bg-[linear-gradient(180deg,#fdfbff_0%,#faf7ff_16%,#ffffff_42%,#fcf9ff_74%,#ffffff_100%)] pb-28 text-slate-900 break-keep">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 2xl:px-0">
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
              <span className="block motion-txt">스프린트가 끝나면,</span>
              <span className="block motion-txt text-main-purple">
                우리의 치열했던 기록들은
              </span>
              <span className="block motion-txt text-main-purple">
                어디로 갈까요?
              </span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed font-medium tracking-tight text-slate-500 md:text-xl">
              슬랙 메시지는 휘발되고, 정성껏 쓴 노션 페이지는 기수가 끝나면
              닫힙니다.
              <br className="hidden md:block" />
              우리는 밤새워 고민했던 코드와 꿀팁들이 허공으로 사라지는 것이
              아쉬웠습니다.
            </p>
          </div>
        </section>

        <section
          ref={sectionRef2}
          data-fade-up
          className="w-full"
        >
          <div className="rounded-[2.5rem] bg-white/92 px-6 py-10 sm:p-10 shadow-[0_30px_80px_rgba(38,6,86,0.08)] mb-20">
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

        <section ref={sectionRef3} data-fade-up className="w-full mb-20">
          <div className="calc-area rounded-[2.8rem] bg-[linear-gradient(135deg,#2b154d,#111827)] px-6 py-10 sm:p-10 text-white shadow-2xl md:p-14">
            <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
              우리가 만든 방식
            </h2>
            <p className="mt-5 text-lg leading-8 font-bold text-slate-200">
              구조와 톤, 그리고 기다리는 순간까지 함께 설계했습니다.
            </p>
            <div className="mt-10 flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory sm:flex-col sm:overflow-visible 2xl:grid 2xl:grid-cols-3">
              <article className="w-full shrink-0 max-h-[400px] overflow-y-auto sm:overflow-visible sm:max-h-[unset] snap-start rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-100 sm:min-w-0">
                <Server className="mb-6 size-8 text-blue-300" />
                <h3 className="text-2xl font-black">구조를 세운 방식</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300 break-keep">
                  인증과 데이터 흐름을 브라우저가 아니라 서버 중심으로 다시 정리했습니다.
                  <br />
                  Next.js App Router 안에서 BFF 레이어를 두고, 클라이언트가 직접 토큰과 인증 흐름을 복잡하게 다루지 않도록 만들었습니다.
                  <br />
                  첫 진입에 필요한 데이터는 서버에서 먼저 가져와 페이지가 바로 그려질 수 있게 구성했습니다.
                  <br />
                  기존 API만으로 부족한 데이터는 서버에서 다시 조합해 화면에 맞는 형태로 넘겨주도록 처리했습니다.
                  <br />
                  복잡한 문제를 화면단에서 임시로 막기보다, 구조 자체를 바꿔 안정적으로 굴러가게 만드는 쪽을 택했습니다.
                </p>
              </article>

              <article className="w-full shrink-0 max-h-[400px] overflow-y-auto sm:overflow-visible sm:max-h-[unset] snap-start rounded-[2rem] border border-[#c27aff]/20 bg-[linear-gradient(180deg,rgba(194,122,255,0.14),rgba(255,255,255,0.04))] p-8 text-slate-100 shadow-[0_0_0_1px_rgba(194,122,255,0.05)] sm:min-w-0">
                <Palette className="mb-6 size-8 text-main-purple-light" />
                <h3 className="text-2xl font-black">톤을 맞춘 방식</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300 break-keep">
                  co-git다운 화면이 남도록 컬러와 간격의 결을 맞췄습니다.
                  <br />
                  컴포넌트를 늘리기보다, 같은 인상을 남기는 데 집중했습니다.
                </p>
                <div className="mt-8">
                  <PaletteStrip dark />
                </div>
              </article>

              <article className="w-full shrink-0 max-h-[400px] overflow-y-auto sm:overflow-visible sm:max-h-[unset] snap-start rounded-[2rem] border border-yellow-200/10 bg-[linear-gradient(180deg,rgba(250,204,21,0.1),rgba(255,255,255,0.04))] p-8 text-slate-100 sm:min-w-0">
                <Zap className="mb-6 size-8 text-yellow-300" />
                <h3 className="text-2xl font-black">기다림을 줄인 방식</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300 break-keep">
                  인증과 데이터 요청 흐름을 App Router와 BFF 구조 안에서 다시 세웠습니다.
                  <br />
                  브라우저가 직접 토큰을 들고 여러 요청을 처리하기보다, 서버가 중간에서 인증과 데이터 연결을 맡도록 정리했습니다.
                  <br />
                  server-side prefetch와 HydrationBoundary를 이용해 첫 진입 데이터를 서버에서 먼저 준비했습니다.
                  <br />
                  화면에 필요한 정보가 API 하나로 오지 않는 경우엔, 서버에서 여러 응답을 다시 조합해 내려주도록 만들었습니다.
                  <br />
                  결국 이 섹션에서 말하고 싶은 건, 기능을 더하기 전에 흐름이 덜 흔들리도록 구조부터 바꿨다는 점입니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          data-fade-up
        >
          <StoryBody
            wrapperClassName="rounded-[2.5rem] bg-white/92 px-6 py-10 sm:p-10 shadow-[0_30px_80px_rgba(38,6,86,0.07)] md:p-14"
            titleClassName="text-3xl font-black tracking-tighter text-slate-950 md:text-4xl"
            bodyClassName="mt-8 text-[15px] leading-8 font-medium text-slate-600"
          />
        </section>

        <section
          className="rounded-[2.5rem] bg-white/92 px-6 py-10 sm:p-10 shadow-[0_30px_80px_rgba(38,6,86,0.07)] md:p-14 mt-20"
          data-fade-up
        >
          <h2 className="mt-6 text-3xl font-black tracking-tighter text-slate-950 md:text-4xl">이 모든 걸 버텨낸 팀원들</h2>
          <div className="mt-10">
            <SurvivorGrid
              cardClassName="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm"
              titleClassName="text-xl font-black text-slate-950"
              bodyClassName="px-8 mt-3 text-sm leading-7 text-slate-600"
            />
          </div>
        </section>

        <section
          data-fade-up
        >
          <ContributeBlock
            wrapperClassName="flex flex-col items-center rounded-[2.8rem] bg-[linear-gradient(135deg,#31175a,#111827)] px-6 py-10 sm:p-10 text-center text-white shadow-2xl md:p-14 mt-20"
            titleClassName="max-w-3xl text-3xl leading-tight font-black tracking-tighter text-white md:text-5xl"
            bodyClassName="mt-6 max-w-2xl whitespace-pre-line text-[15px] leading-8 font-medium text-slate-300"
            buttonClassName="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 transition-transform hover:-translate-y-0.5"
          />
        </section>

        <section
          data-fade-up
        >
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
