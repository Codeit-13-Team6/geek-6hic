"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcnOrigin/sheet";

interface SideBarProps {
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
  handleLogin: () => Promise<void>;
  onClose: () => void;
}

const MOBILE_NAV_LINKS = [
  { id: "01", name: "EXPLORE", href: "/meetings" },
  { id: "02", name: "MY MEETINGS", href: "/my-meetings" },
  { id: "03", name: "RANKING", href: "/ranking" },
  { id: "04", name: "LOUNGE", href: "/lounge" },
];

export default function SideBar({
  isLoggedIn,
  handleLogout,
  handleLogin,
  onClose,
}: SideBarProps) {
  const pathname = usePathname();

  return (
    <SheetContent
      side="right"
      className="w-[300px] border-l-2 border-slate-950 bg-[#FAF9F6] p-0 shadow-[-10px_0_30px_rgba(38,6,86,0.1)] transition-all duration-300 sm:w-[350px]"
    >
      <div className="flex h-full flex-col px-8 py-12">
        <SheetHeader className="mb-12 text-left">
          <SheetTitle className="text-2xl font-black tracking-tighter text-[#260656]">
            MENU.
          </SheetTitle>
          <div className="h-1.5 w-12 bg-[#260656]" />
        </SheetHeader>

        {/* 모바일 내비게이션 리스트 */}
        <nav className="flex flex-col gap-2">
          <p className="mb-4 text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">
            Category Index
          </p>
          {MOBILE_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center justify-between border-2 border-transparent px-5 py-4 transition-all",
                  isActive
                    ? "bg-[#260656] text-white shadow-[4px_4px_0_rgba(38,6,86,0.2)]"
                    : "text-slate-400 hover:border-slate-950 hover:text-slate-950",
                )}
              >
                <span className="text-[10px] font-black">{link.id}</span>
                <span className="text-sm font-black tracking-widest">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* 하단 액션 영역 */}
        <div className="mt-auto space-y-4 border-t-2 border-slate-950 pt-10">
          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="w-full bg-slate-950 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95"
              >
                LOGOUT
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400">
                Logged in to Co-git Archive
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                handleLogin();
                onClose();
              }}
              className="w-full bg-[#260656] py-4 text-xs font-black tracking-widest text-white shadow-[4px_4px_0_rgba(38,6,86,0.2)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:scale-95"
            >
              LOGIN / JOIN
            </button>
          )}
        </div>
      </div>
    </SheetContent>
  );
}
