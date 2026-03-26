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
