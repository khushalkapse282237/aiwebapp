"use client";

import { GenerateResponse, SectionKey } from "@/lib/types";
import OutputSection from "./OutputSection";
import OutputCard from "./OutputCard";

interface ResultsContainerProps {
  data: GenerateResponse;
  blogTitle: string;
  regeneratingSection: SectionKey | null;
  onRegenerate: (key: SectionKey) => void;
}

export default function ResultsContainer({
  data,
  blogTitle,
  regeneratingSection,
  onRegenerate,
}: ResultsContainerProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Generated from:</p>
        <p className="font-semibold text-gray-900">{blogTitle}</p>
      </div>

      <OutputSection title="LinkedIn Posts" icon="in" columns={3} accentBorder="border-l-blue-500">
        <OutputCard
          label="Educational"
          content={data.linkedin.educational}
          accentColor="bg-blue-100 text-blue-800"
          sectionKey="linkedin.educational"
          isRegenerating={regeneratingSection === "linkedin.educational"}
          onRegenerate={onRegenerate}
        />
        <OutputCard
          label="Controversial Take"
          content={data.linkedin.controversial}
          accentColor="bg-blue-100 text-blue-800"
          sectionKey="linkedin.controversial"
          isRegenerating={regeneratingSection === "linkedin.controversial"}
          onRegenerate={onRegenerate}
        />
        <OutputCard
          label="Personal Story"
          content={data.linkedin.personalStory}
          accentColor="bg-blue-100 text-blue-800"
          sectionKey="linkedin.personalStory"
          isRegenerating={regeneratingSection === "linkedin.personalStory"}
          onRegenerate={onRegenerate}
        />
      </OutputSection>

      <OutputSection title="Twitter/X Thread Hooks" icon="X" columns={3} accentBorder="border-l-sky-500">
        <OutputCard
          label="Curiosity Hook"
          content={data.twitter.curiosity}
          accentColor="bg-sky-100 text-sky-800"
          sectionKey="twitter.curiosity"
          isRegenerating={regeneratingSection === "twitter.curiosity"}
          onRegenerate={onRegenerate}
        />
        <OutputCard
          label="Contrarian Hook"
          content={data.twitter.contrarian}
          accentColor="bg-sky-100 text-sky-800"
          sectionKey="twitter.contrarian"
          isRegenerating={regeneratingSection === "twitter.contrarian"}
          onRegenerate={onRegenerate}
        />
        <OutputCard
          label="Data-Led Hook"
          content={data.twitter.dataLed}
          accentColor="bg-sky-100 text-sky-800"
          sectionKey="twitter.dataLed"
          isRegenerating={regeneratingSection === "twitter.dataLed"}
          onRegenerate={onRegenerate}
        />
      </OutputSection>

      <OutputSection title="Meta Description" icon="SEO" columns={1} accentBorder="border-l-green-500">
        <OutputCard
          label={`${data.meta.description.length} / 160 chars`}
          content={data.meta.description}
          accentColor="bg-green-100 text-green-800"
          sectionKey="meta.description"
          isRegenerating={regeneratingSection === "meta.description"}
          onRegenerate={onRegenerate}
        />
      </OutputSection>

      <OutputSection title="YouTube" icon="YT" columns={1} accentBorder="border-l-red-500">
        <OutputCard
          label="Video Title"
          content={data.youtube.title}
          accentColor="bg-red-100 text-red-800"
          sectionKey="youtube.title"
          isRegenerating={regeneratingSection === "youtube.title"}
          onRegenerate={onRegenerate}
        />
        <OutputCard
          label="Video Description"
          content={data.youtube.description}
          accentColor="bg-red-100 text-red-800"
          sectionKey="youtube.description"
          isRegenerating={regeneratingSection === "youtube.description"}
          onRegenerate={onRegenerate}
        />
      </OutputSection>
    </div>
  );
}
