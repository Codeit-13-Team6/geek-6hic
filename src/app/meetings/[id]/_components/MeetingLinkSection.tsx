import { MeetingLinkSectionProps } from "@/types";
import { Link2, LockKeyhole, ExternalLink } from "lucide-react";
import { cn } from "@/lib";

export function MeetingLinkSection({
  link,
  canViewLink,
  isLoggedIn,
}: MeetingLinkSectionProps) {
  const guideText = isLoggedIn
    ? "모임에 참여하면 링크를 확인할 수 있어요."
    : "로그인 후 모임에 참여하면 링크를 확인할 수 있어요.";

  // 파비콘 URL 추출 로직
  const getFaviconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname.replace("www.", "");
      return `https://favicon.im/${hostname}?larger=true&throw-error-on-404=true`;
    } catch {
      return null; // 잘못된 URL일 경우 null 반환
    }
  };

  const faviconUrl = canViewLink ? getFaviconUrl(link) : null;

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-1 px-2">
        <div className="text-main-purple flex items-center gap-2">
          <Link2 size={18} strokeWidth={3} />
          <h2 className="text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
            모임 링크
          </h2>
        </div>
        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
          Private Access Link
        </p>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-[32px] border p-8 shadow-sm transition-all sm:p-10 xl:rounded-[40px]",
          canViewLink
            ? "border-main-purple/20 bg-white"
            : "border-slate-100 bg-slate-50/50",
        )}
      >
        {canViewLink ? (
          <div className="flex flex-col gap-4">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="group text-main-purple flex items-center gap-3 text-[15px] font-black tracking-tight sm:text-[17px]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100 transition-transform group-hover:scale-110">
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
                ) : (
                  <Link2 className="size-4 text-gray-400" />
                )}
                <Link2 className="hidden size-4 text-gray-400" />
              </div>

              <span className="break-all underline-offset-4 group-hover:underline">
                {link}
              </span>
              <ExternalLink
                size={16}
                className="shrink-0 opacity-40 group-hover:opacity-100"
              />
            </a>

            <p className="ml-[52px] text-xs font-bold text-slate-400">
              클릭하면 외부 모임 링크로 이동합니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <LockKeyhole size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[15px] font-black tracking-tight text-slate-950 opacity-20 blur-[4px] select-none">
                https://link.archive.private/secret-path
              </p>
              <p className="text-sm leading-relaxed font-bold text-slate-500">
                {guideText}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
