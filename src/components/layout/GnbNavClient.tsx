"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";

const NAV_LINKS = [
  { name: "모임 찾기", href: "/meetings", exact: true },
  { name: "나의 모임", href: "/my-meetings" },
  { name: "랭킹 보드", href: "/ranking" },
  { name: "스프린트 라운지", href: "/lounge", exact: true },
];

const isNavActive = (pathname: string, href: string, exact?: boolean) => {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
};

export default function GnbNavClient() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center md:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "relative px-4 py-2 text-sm font-bold tracking-tight transition-all focus-visible:ring-2 focus-visible:ring-black",
            isNavActive(pathname, link.href, link.exact)
              ? "text-main-purple after:bg-main-purple after:absolute after:-bottom-1 after:left-1/2 after:h-[3px] after:w-5 after:-translate-x-1/2 after:rounded-full"
              : "text-slate-400 hover:text-slate-900",
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
