import { LinkItem } from "@/types";
/**
 * 서버에서 받은 혼합된 html을 콘텐츠와 링크로 분리하는 함수
 */
export const parsePostData = (rawContent: string) => {
  if (!rawContent) return { content: "", links: [] };

  // 1. <p><a href= 기준으로 본문과 링크 영역 분리
  const parts = rawContent.split("<p><a href=");
  const mainContent = parts[0];
  const links: LinkItem[] = [];


  // 2. 잘려나간 링크 영역 파싱
  if (parts.length > 1) {
    parts.slice(1).forEach((str, index) => {
      // 잘려나간 앞부분을 임시로 복원
      const restoredString = "<a href=" + str;

      const urlMatch = restoredString.match(/href="([^"]+)"/);
      const titleMatch = restoredString.match(/>\s*(.*?)\s*<\/a>/);


      if (urlMatch) {
        links.push({
          id: `link-${Date.now()}-${index}`, // 드래그 앤 드롭을 위한 고유 ID
          url: urlMatch[1],
          title: titleMatch ? titleMatch[1].trim() : "참고 링크",
          image: "", // 수정 시 썸네일은 빈 값 처리
        });
      }
    });
  }

  return { content: mainContent, links };
};

/**
 * 폼에서 작성한 콘텐츠와 링크 데이터를 하나로 합치는 함수
 */
export const stitchPostData = (content: string, linkList: LinkItem[]) => {
  if (linkList.length === 0) return content;

  // 링크들을 HTML p 태그로 변환
  const linksHtml = linkList
    .map(
      (link) =>
        `<p><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a></p>`,
    )
    .join("");

  return `${content}${linksHtml}`;
};

/**
 * 태그 제거 로직 - 순수한 콘텐츠만 남김
 */
export const getPlainText = (html: string) => {
  if (!html) return "";

  const splitContent = html.split(/<p><a|<a/i);
  let text = splitContent[0];

  // 2. 블록 태그들을 공백으로 치환 (텍스트가 붙는 것 방지)
  // p, li, div, h1~6 뿐만 아니라 blockquote, ul, ol 등을 추가
  text = text.replace(/<(p|br|li|div|h[1-6]|blockquote|ul|ol)[^>]*>/gi, " ");
  text = text.replace(/<\/(p|li|div|h[1-6]|blockquote|ul|ol)>/gi, " ");

  // 3. 남은 모든 HTML 태그 제거
  text = text.replace(/<[^>]*>?/gm, "");

  // 4. HTML 엔티티 디코딩 (&gt; -> >, &nbsp; -> 공백 등)
  const entities: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };

  text = text.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match);

  // 5. 연속된 공백 하나로 합치고 앞뒤 트림
  return text.replace(/\s\s+/g, " ").trim();
};

/**
 * 댓글 텍스트에서 링크 추출
 */
export const extractUrlsFromText = (text: string) => {
  if (!text) return [];

  const urlRegex = /(?:https?:\/\/|www\.)[^\s]+/g;
  const urls = text.match(urlRegex) || [];

  return Array.from(new Set(urls)).map((url, index) => {
    const validUrl = url.startsWith("www.") ? `http://${url}` : url;

    return {
      id: `link-${Date.now()}-${index}`,
      url: validUrl,
      title: new URL(validUrl).hostname.replace("www.", ""),
    };
  });
};
