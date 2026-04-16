"use client";

import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Sun, Moon, Check, Copy } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ToastCommon } from "@/shared/components/ui/ToastCommon";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [isDark, setIsDark] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
      ToastCommon({ message: "복사에 실패했습니다.", type: "error" });
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all">
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-2 transition-colors",
          isDark
            ? "border-white/10 bg-[#c1c5d477]"
            : "border-slate-200 bg-slate-50",
        )}
      >
        <span
          className={cn(
            "font-mono text-[10px] font-black tracking-[0.15em] uppercase",
            isDark ? "text-slate-600" : "text-slate-500",
          )}
        >
          {language}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsDark(!isDark)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold transition-all",
              isDark
                ? "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
            )}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
            {isDark ? "LIGHT" : "DARK"}
          </button>

          <button
            onClick={handleCopy}
            disabled={isCopied}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold transition-all",
              isDark
                ? "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
              isCopied && "text-emerald-600",
            )}
          >
            {isCopied ? (
              <Check size={12} strokeWidth={3} />
            ) : (
              <Copy size={12} />
            )}
          </button>
        </div>
      </div>

      {/* 코드 본문 */}
      <SyntaxHighlighter
        language={language}
        style={isDark ? atomOneDark : atomOneLight}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "14px",
          fontWeight: "500",
          lineHeight: "1.7",
          borderRadius: "2px",
          background: isDark ? "#1e1e1e" : "#ffffff",
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
