# NZ Employment Intelligence Hub — Frontend

React / Next.js 14 frontend for the NZ Employment Intelligence Hub — a dual-channel AI system combining employment law RAG and Stats NZ labour market Text-to-SQL to Insights engine.

Live at **[nzlaw.linkiwise.com](https://nzlaw.linkiwise.com)**

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.x |
| npm | ≥ 10.x |
| Backend API | Running on `http://localhost:8000` |

---

## Quick Start (< 10 minutes)

### 1. Clone and enter the frontend directory

```bash
git clone https://github.com/LauraHFC/nz-employment-law-frontend.git
cd nz-employment-law-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If the backend is already deployed (e.g. Railway), replace with the live backend URL.

### 4. Start the dev server

```bash
npm run dev
```

App available at **http://localhost:3000**.

> **Note:** The app works without the backend running — it falls back to a static topic list and shows friendly error states for failed queries.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, font preload
│   │   ├── globals.css             # Design tokens + component styles (incl. chart + warning banner)
│   │   ├── page.tsx                # / → redirect to /t/<first active topic>
│   │   └── t/[topicId]/
│   │       └── page.tsx            # Main chat page
│   ├── components/
│   │   ├── ChatLayout.tsx          # Root layout — calls askHubQuestion()
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── ChatArea.tsx
│   │   ├── Message.tsx             # Renders text + DataChart + warning banner + sources
│   │   ├── DataChart.tsx           # Recharts chart component (line/bar/grouped_bar/pie)
│   │   ├── WelcomeState.tsx
│   │   ├── InputBar.tsx
│   │   ├── SourcesPanel.tsx        # Collapsible legal citations
│   │   ├── FeedbackRow.tsx         # 👍/👎 + copy answer
│   │   ├── TopicSelector.tsx       # Hidden until 2+ topics exist
│   │   ├── Modal.tsx               # Privacy / Disclaimer / Terms
│   │   └── LoadingDots.tsx
│   ├── contexts/
│   │   └── TopicContext.tsx        # Single source of truth for topics
│   ├── config/
│   │   └── topics.config.ts        # Per-topic UI strings — only file to edit when adding a topic
│   └── lib/
│       ├── api.ts                  # askHubQuestion() + legacy askQuestion()
│       └── types.ts                # HubQueryResponse, ChartConfig, LegalSource, ChatMessage
└── src/__tests__/
    ├── DataChart.test.tsx
    ├── Message.test.tsx
    ├── WelcomeState.test.tsx
    ├── SourcesPanel.test.tsx
    ├── FeedbackRow.test.tsx
    ├── TopicSelector.test.tsx
    ├── Modal.test.tsx
    └── api.integration.test.ts
```

---

## Key v3 Changes

### New: `DataChart.tsx`
Recharts-based chart component. Renders automatically when a data query returns a `chart` config in the response.

Supported chart types: `line` · `bar` · `grouped_bar` · `pie`

### New: `HubQueryResponse` type
All chat messages now carry optional `chart`, `outOfRangeWarning`, and `intent` fields alongside the existing `answer` and `sources`.

```ts
interface HubQueryResponse {
  answer: string
  intent: "legal" | "data" | "hybrid"
  sources?: LegalSource[]
  chart?: ChartConfig
  outOfRangeWarning?: string
}
```

### New: `askHubQuestion()` in `api.ts`
Calls `POST /api/hub/query` — the unified backend endpoint that handles all three query types. The legacy `askQuestion()` is preserved for backward compatibility but not used in the main chat flow.

### Updated: `Message.tsx`
Renders all v3 response fields:
- Natural language answer (all query types)
- `DataChart` component (data and hybrid queries)
- Warning banner for out-of-range queries
- `SourcesPanel` with legal citations (legal and hybrid queries)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm test` | Run all tests with coverage |
| `npm run test:watch` | Watch mode |
| `npm run test:integration` | Integration test against live backend |

---

## Running Tests

```bash
# All unit tests + coverage report
npm test

# Coverage threshold: statements ≥ 80%  (current: 87.91%)
# Output: coverage/lcov-report/index.html

# Integration test (requires backend running on localhost:8000)
npm run test:integration
```

---

## Docker

```bash
# Build (from the frontend/ directory)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://nzlaw-api.linkiwise.com \
  -t nzlaw-frontend .

# Run
docker run -p 3000:3000 nzlaw-frontend
```

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `.env.local` | Backend base URL. Default: `http://localhost:8000` |

---

## API Reference

The frontend calls a single unified endpoint for all queries:

```
POST /api/hub/query
Body: { "question": string, "topic_id"?: string }

Response: HubQueryResponse {
  answer:             string
  intent:             "legal" | "data" | "hybrid"
  sources?:           LegalSource[]       // legal + hybrid only
  chart?:             ChartConfig         // data + hybrid only
  outOfRangeWarning?: string
}
```

The backend's Query Router classifies each question and routes it automatically — the frontend does not need to know the intent in advance.

---

## Design System

All design tokens are in `src/app/globals.css` under `:root`:

| Token | Value | Usage |
|-------|-------|-------|
| `--primary-dark` | `#0F2A5C` | Sidebar, user bubble, headings |
| `--primary-mid` | `#3B6FC7` | Badges, send button hover, focus rings |
| `--surface-bg` | `#F0F4FA` | Page background |
| `--surface-card` | `#FFFFFF` | Cards, bot messages, input |
| `--border` | `#E2E8F0` | Dividers, card borders |

Chart and warning banner styles: `.chart-wrap`, `.chart-title`, `.warning-banner` (added in v3).

Font: **Inter** (preloaded via `next/font/google`). Fallback: `Segoe UI, sans-serif`.

---

## Legal

The disclaimer text in `src/components/Modal.tsx` is a **legal requirement**. Do not modify, shorten, or rephrase it.

---

## Related

| Repo | Description |
|------|-------------|
| [rag-app-nz-employment-law](https://github.com/LauraHFC/rag-app-nz-employment-law) | Data pipeline + FastAPI backend |
| [nz-employment-law-frontend](https://github.com/LauraHFC/nz-employment-law-frontend) | This repo |

---

**Author:** Laura Cai · [Portfolio](https://linkiwise.com) · [LinkedIn](https://www.linkedin.com/in/laurahfc/)
