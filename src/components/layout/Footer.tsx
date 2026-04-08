"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      <footer className="h-16 w-full border-t border-slate-200">
        <div className="flex px-4 2xl:px-0 h-full mx-auto w-full max-w-[1280px] items-center justify-between">
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-purple"
          >
            <span className="text-main- text-2xl font-black tracking-tighter sm:text-3xl">
              co-git.
            </span>
          </Link>

          <span className="text-sm">© {new Date().getFullYear()} co-git. All rights reserved.</span>
        </div>
      </footer>
    </>
  )
}