"use client";

import { useState, useEffect } from "react";
import { HistoryEntry, GenerateResponse } from "@/lib/types";
import { getHistory, clearHistory } from "@/lib/utils";

interface HistoryDrawerProps {
  onSelect: (title: string, generated: GenerateResponse) => void;
}

export default function HistoryDrawer({ onSelect }: HistoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, [isOpen]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        History
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="animate-slide-in-right relative z-10 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900">History</h3>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No history yet. Repurpose a blog post to see it here.
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        onSelect(entry.title, entry.generated);
                        setIsOpen(false);
                      }}
                      className="w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:bg-gray-50 hover:shadow-sm"
                    >
                      <p className="line-clamp-2 text-sm font-medium text-gray-900">
                        {entry.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
