import { copyToClipboard } from "@/lib";

export interface ShareLinkParams {
  title: string;
  url: string;
  text?: string;
}

export interface ShareLinkResult {
  result: "opened-share-sheet" | "copied-by-app" | "cancelled" | "failed";
}
// 공유 시트 닫기처럼 사용자 취소는 isShareCancelError 구분합니다.
// 일부 환경에서는 DOMException이 아닐 수 있어 name 값으로 판별합니다.
function isShareCancelError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export async function shareLink({
  title,
  url,
  text,
}: ShareLinkParams): Promise<ShareLinkResult> {
  // 브라우저가 OS 기본 공유 UI를 지원하면 우선 공유창을 엽니다.
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });

      return { result: "opened-share-sheet" };
    } catch (error) {
      // 사용자가 공유창만 닫은 경우는 실패가 아니라 취소로 처리합니다.
      if (isShareCancelError(error)) {
        return { result: "cancelled" };
      }

      // AbortError 이외의 공유 실패는 원인 파악을 위해 로그를 남깁니다.
      console.error("navigator.share failed", error);
    }
  }

  // OS 공유 UI를 사용할 수 없으면 앱에서 직접 링크를 복사합니다.
  const isCopied = await copyToClipboard(url);

  return {
    result: isCopied ? "copied-by-app" : "failed",
  };
}
