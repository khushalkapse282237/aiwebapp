import { NextRequest, NextResponse } from "next/server";
import { generateContent, generateSection } from "@/lib/generate";
import { Tone, Audience, SectionKey } from "@/lib/types";

export const maxDuration = 30;

const VALID_TONES: Tone[] = ["formal", "casual", "bold"];
const VALID_AUDIENCES: Audience[] = ["b2b", "b2c", "general"];
const VALID_SECTIONS: SectionKey[] = [
  "linkedin.educational", "linkedin.controversial", "linkedin.personalStory",
  "twitter.curiosity", "twitter.contrarian", "twitter.dataLed",
  "meta.description", "youtube.title", "youtube.description",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, tone, audience, section } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Blog title and content are required for generation." },
        { status: 400 }
      );
    }

    const validTone: Tone = VALID_TONES.includes(tone) ? tone : "casual";
    const validAudience: Audience = VALID_AUDIENCES.includes(audience)
      ? audience
      : "general";

    // Per-section regeneration
    if (section && VALID_SECTIONS.includes(section)) {
      const result = await generateSection(
        title,
        content,
        excerpt || "",
        validTone,
        validAudience,
        section
      );
      return NextResponse.json({ section, result });
    }

    // Full generation
    const generated = await generateContent(
      title,
      content,
      excerpt || "",
      validTone,
      validAudience
    );

    return NextResponse.json(generated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    if (message.includes("429") || message.includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit hit. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (message.includes("API key") || message.includes("401") || message.includes("Invalid Groq")) {
      return NextResponse.json(
        { error: "Invalid Groq API key. Get a free key at console.groq.com/keys" },
        { status: 500 }
      );
    }

    if (message.includes("missing required fields") || message.includes("JSON")) {
      return NextResponse.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: message || "AI generation failed. Please try again." },
      { status: 502 }
    );
  }
}
