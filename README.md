# Blog Repurposer

An AI-powered web app that transforms long-form blog posts into platform-optimized social media content (LinkedIn, Twitter/X, YouTube, and SEO meta descriptions) in a single click.

**Live Deploy:** [https://blog-repurposer.vercel.app](https://aiwebapp-private.vercel.app/)

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- A free Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/khushalkapse282237/aiwebapp.git
cd blog-repurposer

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Then add your Groq API key:
# GROQ_API_KEY=your_key_here

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack & Reasoning

| Technology | Why |
|---|---|
| **Next.js 16 (App Router)** | Full-stack React framework with built-in API routes, so the extraction and AI generation endpoints live alongside the frontend — no separate backend needed. Server-side route handlers also keep the API key secure. |
| **TypeScript** | Catches type errors at build time, especially important when parsing structured JSON responses from the LLM. The typed interfaces for extraction and generation responses made the AI integration much more reliable. |
| **Tailwind CSS 4** | I love tailwind css thus used it. |
| **Groq API (Llama 3.3-70B)** | There are better ai we can use, the reason I use because Groq gives 30 request/min that is sufficient for me to deploy a app on free tier (tradeoff) |
| **Vercel** | Zero-config deployment for Next.js with automatic previews, edge caching, and environment variable management. |

---

## AI Tools Used

- **Claude Code (Anthropic)** — Used as the primary coding assistant for scaffolding the project structure, building components, writing API route handlers, crafting the LLM prompt engineering, and debugging. Significantly accelerated development across all phases.
- **Groq Llama 3.3-70B** — Powers the core content generation at runtime, transforming extracted blog content into platform-specific social media posts with structured JSON output.

---

## What I Would Improve With Another 2 Hours

- **Streaming responses** — Use SSE/streaming from the Groq API so users see content appear in real-time instead of waiting for the full generation.
- **Platform-specific character counters** — Show live character/word counts with warnings when content exceeds platform limits (LinkedIn 3000 chars, Twitter 280 chars).
- **Shareable links** — Persist repurposed content to a database (e.g., Supabase) so users can share results via URL instead of only exporting markdown.
- **Rate limiting & caching** — Add Redis-based caching for previously extracted URLs and rate limiting per IP to prevent API abuse.
- **More platforms** — Add Instagram caption, newsletter intro, and Reddit post templates.

---

## Time Log

| Phase | Approx. Time |
|---|---|
| Project setup & architecture planning | ~10 min |
| Blog content extraction (URL fetch + Readability parsing) | ~20 min |
| AI integration (Groq API, prompt engineering, JSON parsing) | ~15 min |
| Frontend (components, styling, dark mode, animations) | ~45 hr |
| Features (copy, export, history, per-section regeneration) | ~30 min |
| Deployment & testing | ~20 min |
| **Total** | **~2 hrs 20min** |

---

## Feature Checklist

### Core Requirements (All Implemented)

| # | Requirement | Status |
|---|---|---|
| 1 | Accept a blog URL as input (paste or type) | Done |
| 2 | Extract blog content programmatically | Done |
| 3 | Send extracted content to an AI model | Done — Groq Llama 3.3-70B |
| 4a | 3 LinkedIn post variations (Educational, Controversial Take, Personal Story) | Done |
| 4b | 3 Twitter/X thread hooks (Curiosity Gap, Contrarian, Data-Led) | Done |
| 4c | 1 optimized meta description (under 160 chars, SEO-focused) | Done |
| 4d | 1 YouTube video title + description | Done |
| 5 | Clean UI where someone can copy individual pieces | Done — per-section copy buttons |
| 6 | Live deployment on a free-tier platform | Done — Vercel |

### Bonus Features (All Implemented)

These were listed as optional in the assessment brief — all are included:

| Bonus Feature | Status |
|---|---|
| Tone / audience selector (B2B vs B2C, Formal vs Casual vs Bold) | Done |
| Export functionality (download all outputs as Markdown file) | Done |
| History of previous generations (localStorage, up to 20 entries) | Done |
| Error handling with user-friendly messages and retry | Done |
| Responsive design that works on mobile | Done |

### Extra Features (Beyond the Brief)

Additional features I added to make the tool genuinely more useful:

| Extra Feature | What It Does |
|---|---|
| **Per-section regeneration** | Regenerate any individual LinkedIn/Twitter/YouTube variation with a fresh angle — no need to redo the entire generation |
| **Skeleton loading animations** | Shimmer loading states while extraction and generation are in progress, so the UI never feels stuck |
| **Smooth UI animations** | fade-in-up, pop-in, and slide-in transitions for a polished feel |
| **Article metadata display** | Shows extracted title, word count, author, and site name before generation |
| **History drawer sidebar** | Slide-out panel to browse and reload past repurposings — not just a list, but full content recall |
| **Smart content truncation** | Extracts up to 12,000 chars and calculates word count to keep LLM input within optimal range |
| **3-attempt retry with backoff** | Groq API calls retry automatically on rate limits with 2-second backoff, so the user rarely sees failures |
