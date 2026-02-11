"use client";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="animate-pop-in rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <svg
          className="mx-auto mb-4 h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-red-800">
          Something went wrong
        </h3>
        <p className="mb-4 text-sm text-red-700">{message}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
