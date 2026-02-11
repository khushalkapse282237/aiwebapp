import { Tone, Audience, SectionKey } from "./types";

export const SYSTEM_PROMPT = `You are an expert social media content strategist who repurposes long-form blog content into platform-specific social media posts. You write like a human — no corporate jargon, no filler, no hashtag spam. Your outputs are punchy, specific, and tailored to each platform's culture.

Platform rules:
- LinkedIn: Write like a real person sharing insights, not a brand. Use line breaks for readability. No hashtags unless absolutely natural. Start with a hook that stops the scroll. Use short paragraphs (1-2 sentences each).
- Twitter/X: First tweet of a thread only. Must create tension, curiosity, or challenge a common belief. Under 280 characters. No threads that start with "Thread:" or use emojis as bullet points.
- Meta descriptions: SEO-optimized, under 160 characters, includes a natural keyword and a reason to click.
- YouTube: Title uses curiosity gap or specific numbers. Description is 2-3 sentences with keywords.

You MUST respond in valid JSON matching the exact schema provided. No markdown fences, no commentary outside the JSON.`;

const toneInstruction: Record<Tone, string> = {
  formal:
    "Use a professional, authoritative tone. Suitable for senior executives and decision-makers.",
  casual:
    "Use a conversational, relatable tone. Write like you're talking to a smart friend over coffee.",
  bold: "Use a provocative, opinionated tone. Challenge conventional wisdom. Be edgy but credible.",
};

const audienceInstruction: Record<Audience, string> = {
  b2b: "Target audience: B2B professionals, founders, marketers, and business leaders.",
  b2c: "Target audience: General consumers and end-users interested in the topic.",
  general:
    "Target audience: A broad professional audience interested in this topic.",
};

export function buildUserPrompt(
  title: string,
  content: string,
  tone: Tone,
  audience: Audience
): string {
  return `Repurpose the following blog post into social media content.

BLOG TITLE: ${title}

BLOG CONTENT:
${content}

TONE: ${toneInstruction[tone]}
AUDIENCE: ${audienceInstruction[audience]}

Generate the following outputs as a JSON object with this exact structure:

{
  "linkedin": {
    "educational": "A LinkedIn post (150-300 words) that teaches the reader one key insight from the blog. Start with a bold, attention-grabbing opening line. Use short paragraphs separated by line breaks. End with a thought-provoking question.",
    "controversial": "A LinkedIn post (150-250 words) that takes a strong, slightly controversial stance based on the blog's content. Challenge a common practice or belief in the industry. Be opinionated but back it up with reasoning from the article.",
    "personalStory": "A LinkedIn post (150-300 words) that starts with a relatable personal scenario or 'I used to think...' framing, then pivots to the blog's key lesson. Make it feel like a real person sharing a genuine experience."
  },
  "twitter": {
    "curiosity": "A single tweet (under 280 chars) that creates a curiosity gap. Use a surprising stat, counterintuitive claim, or unanswered question from the blog.",
    "contrarian": "A single tweet (under 280 chars) that challenges a widely-held belief related to the blog topic. Start with 'Unpopular opinion:' or 'Hot take:' or similar.",
    "dataLed": "A single tweet (under 280 chars) that leads with a specific number, stat, or concrete claim from the blog. Make it feel like insider knowledge."
  },
  "meta": {
    "description": "An SEO meta description under 160 characters. Include the primary keyword naturally. Give a clear reason to click."
  },
  "youtube": {
    "title": "A YouTube video title under 70 characters. Use a curiosity gap, specific number, or 'How to' framing.",
    "description": "A YouTube video description of 2-3 sentences. Include relevant keywords naturally. Summarize what the viewer will learn."
  }
}

CRITICAL RULES:
- meta.description MUST be under 160 characters total
- Each twitter entry MUST be under 280 characters total
- youtube.title MUST be under 70 characters
- LinkedIn posts MUST use newline characters (\\n) for paragraph breaks — do NOT write them as a single block
- Do NOT use generic phrases like "In this post", "Check out", "In today's rapidly evolving landscape"
- Do NOT start LinkedIn posts with "I'm excited to share", "I'm thrilled", or similar cliches
- Pull SPECIFIC insights, stats, questions, or frameworks from the actual blog content — not generic advice
- Each LinkedIn variation must have a genuinely different angle and opening hook
- Each Twitter hook must use a different framing technique
- Respond ONLY with the JSON object — no markdown code fences, no extra text`;
}

const SECTION_DESCRIPTIONS: Record<SectionKey, string> = {
  "linkedin.educational":
    "A LinkedIn post (150-300 words) that teaches the reader one key insight. Start with a bold hook. Use short paragraphs with line breaks. End with a thought-provoking question.",
  "linkedin.controversial":
    "A LinkedIn post (150-250 words) that takes a strong, slightly controversial stance. Challenge a common belief. Be opinionated but credible.",
  "linkedin.personalStory":
    "A LinkedIn post (150-300 words) starting with 'I used to think...' or a relatable scenario, then pivoting to the blog's lesson. Make it genuine.",
  "twitter.curiosity":
    "A single tweet under 280 characters that creates a curiosity gap. Use a surprising stat or counterintuitive claim from the blog.",
  "twitter.contrarian":
    "A single tweet under 280 characters that challenges a widely-held belief. Start with 'Unpopular opinion:' or 'Hot take:'.",
  "twitter.dataLed":
    "A single tweet under 280 characters leading with a specific number or stat from the blog. Make it feel like insider knowledge.",
  "meta.description":
    "An SEO meta description UNDER 160 characters. Include the primary keyword naturally. Give a reason to click.",
  "youtube.title":
    "A YouTube video title UNDER 70 characters. Use curiosity gap, numbers, or 'How to' framing.",
  "youtube.description":
    "A YouTube video description of 2-3 sentences. Include relevant keywords. Summarize what the viewer will learn.",
};

export function buildSectionPrompt(
  title: string,
  content: string,
  tone: Tone,
  audience: Audience,
  sectionKey: SectionKey
): string {
  const description = SECTION_DESCRIPTIONS[sectionKey];

  return `Regenerate a SINGLE piece of content from this blog post. Write something COMPLETELY DIFFERENT from what you might have written before — use a fresh angle, different opening, new structure.

BLOG TITLE: ${title}

BLOG CONTENT:
${content}

TONE: ${toneInstruction[tone]}
AUDIENCE: ${audienceInstruction[audience]}

SECTION TO REGENERATE: ${sectionKey}
REQUIREMENTS: ${description}

CRITICAL RULES:
- Pull SPECIFIC insights from the actual blog content
- Do NOT use generic phrases like "In today's rapidly evolving landscape"
- Do NOT start with "I'm excited to share" or similar cliches
- Make this genuinely DIFFERENT from a previous version — new angle, new hook, new structure
- Respond with ONLY a JSON object: { "result": "your content here" }`;
}
