"use client";

import { ReactNode } from "react";

interface OutputSectionProps {
  title: string;
  icon: string;
  children: ReactNode;
  columns?: 1 | 3;
  accentBorder?: string;
}

export default function OutputSection({
  title,
  icon,
  children,
  columns = 3,
  accentBorder = "border-l-blue-500",
}: OutputSectionProps) {
  return (
    <section className="mb-8">
      <h2 className={`mb-4 flex items-center gap-2 rounded-lg border-l-4 ${accentBorder} bg-white py-2 pl-4 text-lg font-semibold text-gray-900 shadow-sm`}>
        <span className="text-base">{icon}</span>
        {title}
      </h2>
      <div
        className={`grid gap-4 ${
          columns === 3
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 max-w-2xl"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
