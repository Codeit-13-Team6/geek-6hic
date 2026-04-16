"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";

const HIDE_FOOTER_PATHS = ["/login", "/signup", "/meetings", "/lounge"];

export function Footer() {
  const pathname = usePathname();

  // 현재 경로가 숨김 목록에 포함되어 있는지 확인
  const isHidden = HIDE_FOOTER_PATHS.includes(pathname);

  if (isHidden) {
    return null;
  }

  return (
    <footer
      id="global-footer"
      className="w-full border-t border-slate-200 bg-slate-50/50 py-10"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 sm:flex-row sm:items-end sm:justify-between 2xl:px-0">
        {/* 좌측: 로고 및 프로젝트 슬로건 */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="w-fit focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
          >
            <span className="text-2xl font-black tracking-tighter text-slate-400 transition-colors hover:text-slate-600 sm:text-3xl">
              co-git.
            </span>
          </Link>
          <p className="text-sm font-medium tracking-tight text-slate-500">
            스프린터들을 위한 오픈 생태계
          </p>
        </div>

        {/* 우측: 핵심 링크 및 카피라이트 */}
        <div className="flex flex-col items-start gap-5 sm:items-end 2xl:static 2xl:left-[unset] 2xl:translate-0">
          {/* 네비게이션 링크 */}
          <div className="flex items-center gap-6">
            <Link
              href="/about-team"
              className="text-sm font-bold tracking-tight text-slate-500 transition-colors hover:text-slate-900"
            >
              About Team
            </Link>
          </div>

          {/* 저작권 표시 */}
          <span className="text-[13px] font-medium tracking-tight text-slate-400">
            © {new Date().getFullYear()} co-git. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
