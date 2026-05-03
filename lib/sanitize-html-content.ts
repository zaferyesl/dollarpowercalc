import sanitizeHtml from "sanitize-html";

/** Inline `style` values: allow typical layout/typography from admin HTML; block `url(` (e.g. `javascript:` in CSS). */
const SAFE_INLINE_STYLE = /^(?!.*url\s*\()[\s\S]{1,5000}$/i;

const BLOG_INLINE_STYLE_PROPS = [
  "font-family",
  "line-height",
  "color",
  "background-color",
  "max-width",
  "min-width",
  "width",
  "height",
  "margin",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "padding",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "font-weight",
  "font-size",
  "font-style",
  "text-align",
  "border",
  "border-radius",
  "list-style-type",
  "display",
  "gap",
  "overflow",
  "vertical-align",
] as const;

const blogAllowedStyles: Record<string, RegExp[]> = Object.fromEntries(
  BLOG_INLINE_STYLE_PROPS.map((prop) => [prop, [SAFE_INLINE_STYLE]]),
);

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
      "*": ["class", "style"],
      img: ["src", "alt", "title", "width", "height"],
      a: ["href", "name", "target", "rel"],
      code: ["class"],
      pre: ["class"],
    },
    allowedStyles: {
      "*": blogAllowedStyles,
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
