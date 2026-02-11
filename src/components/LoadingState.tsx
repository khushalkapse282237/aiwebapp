"use client";

export default function LoadingState({
  status,
}: {
  status: "extracting" | "generating";
}) {
  const message =
    status === "extracting"
      ? "Fetching and reading the blog post..."
      : "Generating social content with AI...";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
        <p className="text-lg font-medium text-gray-700">{message}</p>
        <p className="text-sm text-gray-500">This usually takes 10-20 seconds</p>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3" style={{ animationDelay: `${i * 150}ms` }}>
            <div className="h-5 w-40 rounded bg-gray-200 animate-shimmer" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-48 rounded-xl bg-gray-100 animate-shimmer"
                  style={{ animationDelay: `${(i * 3 + j) * 100}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
