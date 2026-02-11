"use client";

import { useRepurposer } from "@/hooks/useRepurposer";
import UrlInput from "@/components/UrlInput";
import OptionsBar from "@/components/OptionsBar";
import LoadingState from "@/components/LoadingState";
import ErrorDisplay from "@/components/ErrorDisplay";
import ResultsContainer from "@/components/ResultsContainer";
import ExportButton from "@/components/ExportButton";
import HistoryDrawer from "@/components/HistoryDrawer";


export default function Home() {
  const {
    status,
    extractedContent,
    generated,
    error,
    regeneratingSection,
    tone,
    audience,
    setTone,
    setAudience,
    handleSubmit,
    handleRetry,
    handleRegenerateSection,
    loadFromHistory,
  } = useRepurposer();

  const isLoading = status === "extracting" || status === "generating";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Blog Repurposer
            </h1>
            <p className="text-sm text-gray-500">
              Turn blog posts into social media content with AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HistoryDrawer onSelect={loadFromHistory} />
          </div>
        </div>
      </header>

      {/* Input Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
          <div className="mt-4">
            <OptionsBar
              tone={tone}
              audience={audience}
              onToneChange={setTone}
              onAudienceChange={setAudience}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingState status={status as "extracting" | "generating"} />
      )}

      {/* Error State */}
      {status === "error" && error && (
        <ErrorDisplay message={error} onRetry={handleRetry} />
      )}

      {/* Results */}
      {status === "done" && generated && extractedContent && (
        <>
          <div className="mx-auto max-w-5xl px-4 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                {extractedContent.wordCount > 0 &&
                  `Extracted ${extractedContent.wordCount.toLocaleString()} words`}
              </p>
              <ExportButton
                data={generated}
                blogTitle={extractedContent.title}
              />
            </div>
          </div>
          <ResultsContainer
            data={generated}
            blogTitle={extractedContent.title}
            regeneratingSection={regeneratingSection}
            onRegenerate={handleRegenerateSection}
          />
        </>
      )}

      {/* Empty State */}
      {status === "idle" && (
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Paste a blog URL to get started
          </h2>
          <p className="mx-auto max-w-md text-gray-500">
            We&apos;ll extract the content and generate LinkedIn posts, Twitter
            hooks, meta descriptions, and YouTube content — all optimized for
            each platform.
          </p>
        </div>
      )}
    </main>
  );
}
