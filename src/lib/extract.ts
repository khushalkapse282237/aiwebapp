import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { ExtractResponse } from "./types";

const MAX_CONTENT_LENGTH = 12000;

export async function extractBlogContent(
  url: string
): Promise<ExtractResponse> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL (status ${response.status}). The site may be down or blocking requests.`
    );
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent) {
    throw new Error(
      "Could not extract article content. This URL may not contain a readable blog post."
    );
  }

  const cleanText = article.textContent.replace(/\s+/g, " ").trim();

  if (cleanText.length < 100) {
    throw new Error(
      "The extracted content is too short to repurpose. Please try a longer blog post."
    );
  }

  const content =
    cleanText.length > MAX_CONTENT_LENGTH
      ? cleanText.slice(0, MAX_CONTENT_LENGTH)
      : cleanText;

  const wordCount = cleanText.split(/\s+/).length;

  return {
    title: article.title || "Untitled",
    content,
    excerpt: article.excerpt || cleanText.slice(0, 200),
    siteName: article.siteName || new URL(url).hostname,
    byline: article.byline || null,
    wordCount,
  };
}
