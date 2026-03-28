import { Link2 } from "lucide-react";
import { LinkItem } from "@/types";

export function CompactLinkList({
  links,
  isPreview = false,
}: {
  links: LinkItem[];
  isPreview?: boolean;
}) {
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-4">
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => {
          // 1. 도메인 추출
          const hostname = link.url
            ? new URL(link.url).hostname.replace("www.", "")
            : "";

          // 2. 파비콘 URL 생성
          const faviconUrl = hostname
            ? `https://favicon.im/${hostname}?larger=true&throw-error-on-404=true`
            : "";

          return (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-3 transition-all hover:border-emerald-200 ${isPreview ? "bg-green-50/80 hover:bg-green-100/50" : "bg-gray-50/50 hover:bg-emerald-50/50"}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-colors group-hover:border-emerald-200">
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="링크 미리보기"
                        className="size-5 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.setAttribute(
                            "style",
                            "display:block",
                          );
                        }}
                      />
                    ) : null}
                    <Link2 className="hidden size-4 text-gray-400" />
                  </div>

                  <span className="truncate text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                    {link.title}
                  </span>
                </div>

                {hostname && (
                  <span className="hidden shrink-0 text-xs text-gray-400 sm:block">
                    {hostname}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
