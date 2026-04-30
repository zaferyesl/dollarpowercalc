import sanitizeHtml from "sanitize-html";

/** Allow common blog HTML from TipTap / paste; strips scripts/iframes. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "h1",
      "h2",
      "h3",
      "h4",
      "img",
      "figure",
      "figcaption",
      "span",
      "u",
      "s",
      "del",
      "mark",
      "hr",
      "pre",
      "code",
      "kbd",
      "sup",
      "sub",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class"],
      img: ["src", "alt", "title", "width", "height"],
      a: ["href", "name", "target", "rel"],
      code: ["class"],
      pre: ["class"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href;
        const isExternal =
          typeof href === "string" && /^https?:\/\//i.test(href ?? "");
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal
              ? { rel: attribs.rel || "noopener noreferrer", target: "_blank" }
              : {}),
          },
        };
      },
    },
  });
}
