const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
};

export function decodeHtmlEntities(text: string): string {
  return text.replace(/&[a-z0-9#]+;/gi, (match) => HTML_ENTITIES[match] || match);
}
