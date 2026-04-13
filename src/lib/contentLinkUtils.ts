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

  // 1. 유저가 입력할 리 없는 고유한 시스템 내부 키 설정
  const SYSTEM_KEY = "___SYS_CODE_BLOCK_8f9a2___";
  const DISPLAY_TEXT = "[ 💻 코드 첨부 ]";

  // 2. 코드가 있는 자리를 시스템 키로 치환
  const processedHtml = html
    .replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, ` ${SYSTEM_KEY} `)
    .replace(
      /<div[^>]*class=["'][^"']*ql-code-block-container[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      ` ${SYSTEM_KEY} `,
    );

  const splitContent = processedHtml.split(/<p><a|<a/i);
  let text = splitContent[0];

  // 3. 블록 태그들을 공백으로 치환
  text = text.replace(/<(p|br|li|div|h[1-6]|blockquote|ul|ol)[^>]*>/gi, " ");
  text = text.replace(/<\/(p|li|div|h[1-6]|blockquote|ul|ol)>/gi, " ");

  // 4. 남은 모든 HTML 태그 제거
  text = text.replace(/<[^>]*>?/gm, "");

  // 5. HTML 엔티티 디코딩
  const entities: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  text = text.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match);

  // 6. 모든 줄바꿈과 연속된 공백 압축
  text = text.replace(/\s\s+/g, " ").trim();

  // 7. 시스템 키를 기준으로만 중복 제거
  const systemKeyRegex = new RegExp(`(${SYSTEM_KEY}\\s*)+`, "g");
  text = text.replace(systemKeyRegex, `${SYSTEM_KEY} `);

  text = text.replace(new RegExp(SYSTEM_KEY, "g"), DISPLAY_TEXT);

  return text.trim();
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
