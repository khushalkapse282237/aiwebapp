"use client";

import { GenerateResponse } from "@/lib/types";
import { exportAsMarkdown, downloadMarkdown } from "@/lib/utils";

interface ExportButtonProps {
  data: GenerateResponse;
  blogTitle: string;
}

export default function ExportButton({ data, blogTitle }: ExportButtonProps) {
  const handleExport = () => {
    const markdown = exportAsMarkdown(blogTitle, data);
    const slug = blogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50);
    downloadMarkdown(markdown, `repurposed-${slug}.md`);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export as Markdown
    </button>
  );
}
