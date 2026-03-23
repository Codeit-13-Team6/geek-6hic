export const parsePostContent = (content: string) => {
  const parts = content.split("<p><a href=");
  const mainContent = parts[0];
  const linkObjects = parts
    .slice(1)
    .map((str, index) => {
      const restoredString = "<a href=" + str;
      const urlMatch = restoredString.match(/href="([^"]+)"/);
      const titleMatch = restoredString.match(/>🔗\s*(.*?)</);
      return {
        id: `link-${index}`,
        url: urlMatch ? urlMatch[1] : "",
        title: titleMatch ? titleMatch[1].trim() : "참고 링크",
        image: "",
      };
    })
    .filter((link) => link.url);

  return { mainContent, linkObjects };
};
