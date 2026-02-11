"use client";

import { useState, useCallback } from "react";
import {
  Tone,
  Audience,
  ExtractResponse,
  GenerateResponse,
  RepurposerState,
  SectionKey,
} from "@/lib/types";
import { saveToHistory } from "@/lib/utils";

export function useRepurposer() {
  const [state, setState] = useState<RepurposerState>({
    status: "idle",
    extractedContent: null,
    generated: null,
    error: null,
    regeneratingSection: null,
  });
  const [tone, setTone] = useState<Tone>("casual");
  const [audience, setAudience] = useState<Audience>("general");
  const [lastUrl, setLastUrl] = useState("");

  const handleSubmit = useCallback(
    async (url: string) => {
      setLastUrl(url);
      setState({
        status: "extracting",
        extractedContent: null,
        generated: null,
        error: null,
        regeneratingSection: null,
      });

      try {
        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!extractRes.ok) {
          const err = await extractRes.json();
          throw new Error(err.error || "Failed to extract blog content.");
        }

        const extracted: ExtractResponse = await extractRes.json();

        setState((prev) => ({
          ...prev,
          status: "generating",
          extractedContent: extracted,
        }));

        const genRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: extracted.title,
            content: extracted.content,
            excerpt: extracted.excerpt,
            tone,
            audience,
          }),
        });

        if (!genRes.ok) {
          const err = await genRes.json();
          throw new Error(err.error || "Failed to generate content.");
        }

        const generated: GenerateResponse = await genRes.json();

        saveToHistory(url, extracted.title, generated);

        setState((prev) => ({
          ...prev,
          status: "done",
          generated,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            err instanceof Error ? err.message : "Something went wrong.",
        }));
      }
    },
    [tone, audience]
  );

  const handleRetry = useCallback(() => {
    if (lastUrl) {
      handleSubmit(lastUrl);
    }
  }, [lastUrl, handleSubmit]);

  const handleRegenerateSection = useCallback(
    async (sectionKey: SectionKey) => {
      if (!state.extractedContent || !state.generated) return;

      setState((prev) => ({ ...prev, regeneratingSection: sectionKey }));

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: state.extractedContent.title,
            content: state.extractedContent.content,
            excerpt: state.extractedContent.excerpt,
            tone,
            audience,
            section: sectionKey,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to regenerate section.");
        }

        const { result } = await res.json();

        setState((prev) => {
          if (!prev.generated) return prev;

          const updated = { ...prev.generated };
          const [group, field] = sectionKey.split(".") as [string, string];

          if (group === "linkedin") {
            updated.linkedin = { ...updated.linkedin, [field]: result };
          } else if (group === "twitter") {
            updated.twitter = { ...updated.twitter, [field]: result };
          } else if (group === "meta") {
            updated.meta = { ...updated.meta, [field]: result };
          } else if (group === "youtube") {
            updated.youtube = { ...updated.youtube, [field]: result };
          }

          return { ...prev, generated: updated, regeneratingSection: null };
        });
      } catch {
        setState((prev) => ({ ...prev, regeneratingSection: null }));
      }
    },
    [state.extractedContent, state.generated, tone, audience]
  );

  const loadFromHistory = useCallback(
    (title: string, generated: GenerateResponse) => {
      setState({
        status: "done",
        extractedContent: { title, content: "", excerpt: "", siteName: "", byline: null, wordCount: 0 },
        generated,
        error: null,
        regeneratingSection: null,
      });
    },
    []
  );

  return {
    ...state,
    tone,
    audience,
    setTone,
    setAudience,
    handleSubmit,
    handleRetry,
    handleRegenerateSection,
    loadFromHistory,
  };
}
