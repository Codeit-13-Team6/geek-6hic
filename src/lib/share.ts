import { copyToClipboard } from "@/lib/utils";

export interface ShareLinkParams {
  title: string;
  url: string;
  text?: string;
}

export interface ShareLinkResult {
  result: "opened-share-sheet" | "copied-by-app" | "cancelled" | "failed";
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
      if (error instanceof DOMException && error.name === "AbortError") {
        return { result: "cancelled" };
      }
    }
  }

  // OS 공유 UI를 사용할 수 없으면 앱에서 직접 링크를 복사합니다.
  const isCopied = await copyToClipboard(url);

  return {
    result: isCopied ? "copied-by-app" : "failed",
  };
}
