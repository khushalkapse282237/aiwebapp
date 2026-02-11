import { NextRequest, NextResponse } from "next/server";
import { extractBlogContent } from "@/lib/extract";
import { isValidUrl } from "@/lib/utils";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !isValidUrl(url)) {
      return NextResponse.json(
        {
          error:
            "Invalid URL. Please enter a valid blog URL starting with http:// or https://",
        },
        { status: 400 }
      );
    }

    const extracted = await extractBlogContent(url);
    return NextResponse.json(extracted);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    if (message.includes("Could not extract") || message.includes("too short")) {
      return NextResponse.json({ error: message }, { status: 422 });
    }

    if (message.includes("Failed to fetch") || message.includes("timeout") || message.includes("AbortError")) {
      return NextResponse.json(
        {
          error:
            "Could not fetch the URL. The site may be down or blocking requests.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during extraction." },
      { status: 500 }
    );
  }
}
