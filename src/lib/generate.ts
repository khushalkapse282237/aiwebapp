import { SYSTEM_PROMPT, buildUserPrompt, buildSectionPrompt } from "./prompts";
import { Tone, Audience, GenerateResponse, SectionKey } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGroq(prompt: string, maxTokens: number = 3000): Promise<string> {
  const maxAttempts = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errBody}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;

      if (!raw) {
        throw new Error("AI returned an empty response.");
      }

      return raw;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message.toLowerCase();

      if (msg.includes("invalid api key") || msg.includes("401")) {
        throw new Error("Invalid Groq API key. Get a free key at console.groq.com/keys");
      }

      if (msg.includes("429") || msg.includes("rate limit")) {
        if (attempt < maxAttempts) {
          await sleep(attempt * 2000);
          continue;
        }
      }

      if (attempt === maxAttempts) throw lastError;
      await sleep(1000);
    }
  }

  throw lastError || new Error("AI generation failed after retries.");
}

export async function generateContent(
  title: string,
  content: string,
  _excerpt: string,
  tone: Tone,
  audience: Audience
): Promise<GenerateResponse> {
  const userPrompt = buildUserPrompt(title, content, tone, audience);
  const raw = await callGroq(userPrompt);
  const result = JSON.parse(raw) as GenerateResponse;

  if (
    !result.linkedin?.educational ||
    !result.linkedin?.controversial ||
    !result.linkedin?.personalStory ||
    !result.twitter?.curiosity ||
    !result.twitter?.contrarian ||
    !result.twitter?.dataLed ||
    !result.meta?.description ||
    !result.youtube?.title ||
    !result.youtube?.description
  ) {
    throw new Error("AI response is missing required fields.");
  }

  if (result.meta.description.length > 160) {
    result.meta.description = result.meta.description.slice(0, 157) + "...";
  }
  if (result.youtube.title.length > 70) {
    result.youtube.title = result.youtube.title.slice(0, 67) + "...";
  }

  return result;
}

export async function generateSection(
  title: string,
  content: string,
  _excerpt: string,
  tone: Tone,
  audience: Audience,
  sectionKey: SectionKey
): Promise<string> {
  const prompt = buildSectionPrompt(title, content, tone, audience, sectionKey);
  const raw = await callGroq(prompt, 1500);
  const parsed = JSON.parse(raw) as { result: string };

  if (!parsed.result) {
    throw new Error("AI returned an invalid section response.");
  }

  if (sectionKey === "meta.description" && parsed.result.length > 160) {
    return parsed.result.slice(0, 157) + "...";
  }
  if (sectionKey === "youtube.title" && parsed.result.length > 70) {
    return parsed.result.slice(0, 67) + "...";
  }

  return parsed.result;
}
