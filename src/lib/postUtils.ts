export interface LinkItem {
  id: string;
  url: string;
  title: string;
  image: string;
}

/**
 * [GET 전용] 서버에서 받은 혼합된 html을 콘텐츠와 링크로 분리하는 함수
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
 * [POST/PATCH 전용] 폼에서 작성한 콘텐츠와 링크 데이터를 하나로 합치는 함수
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
