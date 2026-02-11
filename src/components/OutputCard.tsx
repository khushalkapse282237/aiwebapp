"use client";

import CopyButton from "./CopyButton";
import { SectionKey } from "@/lib/types";

interface OutputCardProps {
  label: string;
  content: string;
  accentColor?: string;
  sectionKey?: SectionKey;
  isRegenerating?: boolean;
  onRegenerate?: (key: SectionKey) => void;
}

export default function OutputCard({
  label,
  content,
  accentColor = "bg-gray-100 text-gray-700",
  sectionKey,
  isRegenerating,
  onRegenerate,
}: OutputCardProps) {
  return (
    <div className="animate-fade-in-up group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      {isRegenerating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            <span className="text-xs font-medium text-gray-500">Regenerating...</span>
          </div>
        </div>
      )}
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${accentColor}`}>
          {label}
        </span>
        {sectionKey && onRegenerate && (
          <button
            onClick={() => onRegenerate(sectionKey)}
            disabled={isRegenerating}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 disabled:opacity-50"
            title="Regenerate this section"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
        {content}
      </p>
      <div className="mt-4 flex justify-end">
        <CopyButton text={content} />
      </div>
    </div>
  );
}
