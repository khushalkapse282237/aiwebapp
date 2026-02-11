import { GenerateResponse, HistoryEntry } from "./types";

export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function exportAsMarkdown(
  title: string,
  data: GenerateResponse
): string {
  return `# Repurposed Content: ${title}

## LinkedIn Posts

### Educational
${data.linkedin.educational}

### Controversial Take
${data.linkedin.controversial}

### Personal Story Hook
${data.linkedin.personalStory}

---

## Twitter/X Thread Hooks

### Curiosity Hook
${data.twitter.curiosity}

### Contrarian Hook
${data.twitter.contrarian}

### Data-Led Hook
${data.twitter.dataLed}

---

## Meta Description
${data.meta.description}

---

## YouTube

### Title
${data.youtube.title}

### Description
${data.youtube.description}
`;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const HISTORY_KEY = "repurposer-history";
const MAX_HISTORY = 20;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(
  url: string,
  title: string,
  generated: GenerateResponse
) {
  const history = getHistory();
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    url,
    title,
    generated,
    createdAt: new Date().toISOString(),
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
