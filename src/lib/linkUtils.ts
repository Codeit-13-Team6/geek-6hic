export const extractUrlsFromText = (text: string) => {
  if (!text) return [];
  // http나 https로 시작하는 URL을 찾는 정규식
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];

  // 중복 제거 후 객체 형태로 반환
  return Array.from(new Set(urls)).map((url, index) => ({
    id: `link-${Date.now()}-${index}`,
    url,
    title: new URL(url).hostname.replace("www.", ""),
  }));
};
