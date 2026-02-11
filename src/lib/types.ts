export type Tone = "formal" | "casual" | "bold";
export type Audience = "b2b" | "b2c" | "general";

export type SectionKey =
  | "linkedin.educational"
  | "linkedin.controversial"
  | "linkedin.personalStory"
  | "twitter.curiosity"
  | "twitter.contrarian"
  | "twitter.dataLed"
  | "meta.description"
  | "youtube.title"
  | "youtube.description";

export interface ExtractRequest {
  url: string;
}

export interface ExtractResponse {
  title: string;
  content: string;
  excerpt: string;
  siteName: string;
  byline: string | null;
  wordCount: number;
}

export interface GenerateRequest {
  title: string;
  content: string;
  excerpt: string;
  tone: Tone;
  audience: Audience;
  section?: SectionKey;
}

export interface GenerateResponse {
  linkedin: {
    educational: string;
    controversial: string;
    personalStory: string;
  };
  twitter: {
    curiosity: string;
    contrarian: string;
    dataLed: string;
  };
  meta: {
    description: string;
  };
  youtube: {
    title: string;
    description: string;
  };
}

export interface RepurposerState {
  status: "idle" | "extracting" | "generating" | "done" | "error";
  extractedContent: ExtractResponse | null;
  generated: GenerateResponse | null;
  error: string | null;
  regeneratingSection: SectionKey | null;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  generated: GenerateResponse;
  createdAt: string;
}
