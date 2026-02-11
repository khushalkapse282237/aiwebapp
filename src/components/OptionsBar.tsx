"use client";

import { Tone, Audience } from "@/lib/types";

interface OptionsBarProps {
  tone: Tone;
  audience: Audience;
  onToneChange: (tone: Tone) => void;
  onAudienceChange: (audience: Audience) => void;
}

export default function OptionsBar({
  tone,
  audience,
  onToneChange,
  onAudienceChange,
}: OptionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">Tone:</label>
        <select
          value={tone}
          onChange={(e) => onToneChange(e.target.value as Tone)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
        >
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="bold">Bold</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">Audience:</label>
        <select
          value={audience}
          onChange={(e) => onAudienceChange(e.target.value as Audience)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
        >
          <option value="general">General</option>
          <option value="b2b">B2B</option>
          <option value="b2c">B2C</option>
        </select>
      </div>
    </div>
  );
}
