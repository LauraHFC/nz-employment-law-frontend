# NZ Employment Law Assistant — Frontend

React / Next.js 14 frontend for the NZ Employment Law RAG chatbot.

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
git clone https://github.com/LauraHFC/rag-app-nz-employment-law.git
cd rag-app-nz-employment-law/frontend
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

If the backend is already deployed (e.g. Railway), replace the URL with the live backend address.

### 4. Start the dev server

```bash
npm run dev
```

App is now available at **http://localhost:3000** — it automatically redirects to `/t/nz_employment_law`.

> **Note:** The app works without the backend running — it falls back to a static topic list and shows friendly error states for failed queries.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, font preload
│   │   ├── globals.css             # All CSS — design tokens + components
│   │   ├── page.tsx                # / → redirect to /t/<first active topic>
│   │   └── t/[topicId]/
│   │       └── page.tsx            # Main chat page
│   ├── components/
│   │   ├── ChatLayout.tsx          # Root layout component
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── ChatArea.tsx
│   │   ├── Message.tsx
│   │   ├── WelcomeState.tsx
│   │   ├── InputBar.tsx
│   │   ├── SourcesPanel.tsx        # Collapsible citations
│   │   ├── FeedbackRow.tsx         # 👍/👎 + copy
│   │   ├── TopicSelector.tsx       # Hidden until 2+ topics exist
│   │   ├── Modal.tsx               # Privacy / Disclaimer / Terms
│   │   └── LoadingDots.tsx
│   ├── contexts/
│   │   └── TopicContext.tsx        # Single source of truth for topics
│   ├── config/
│   │   └── topics.config.ts        # Per-topic UI strings — only file to edit when adding a topic
│   └── lib/
│       ├── api.ts                  # All fetch calls — never call fetch() directly in components
│       └── types.ts                # Shared TypeScript interfaces
└── src/__tests__/
    ├── WelcomeState.test.tsx
    ├── SourcesPanel.test.tsx
    ├── FeedbackRow.test.tsx
    ├── TopicSelector.test.tsx
    ├── Modal.test.tsx
    └── api.integration.test.ts
```

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

# Coverage must meet: statements ≥ 80%
# Output: coverage/lcov-report/index.html

# Integration test (requires backend running on localhost:8000)
npm run test:integration
```

---

## Docker

```bash
# Build (from the frontend/ directory)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.nzlaw.linkiwise.com \
  -t nzlaw-frontend .

# Run
docker run -p 3000:3000 nzlaw-frontend
```

---

## Adding a New Knowledge Base

When the backend team adds a new topic to `GET /api/topics`, the **only frontend file you need to edit** is:

```
src/config/topics.config.ts
```

Add a new entry:

```ts
export const TOPIC_UI_CONFIG: Record<string, TopicUIConfig> = {
  nz_employment_law: { ... },   // existing

  health_and_safety: {
    exampleQuestions: ["What are my rights under the Health and Safety at Work Act?", ...],
    chips: ["🦺", "⚙️", ...],
    inputPlaceholder: "Ask about NZ health and safety law…",
    sidebarDescription: "AI-powered answers about workplace safety in New Zealand.",
    emptyStateTitle: "Ask anything about NZ health & safety",
    emptyStateSubtitle: "Answers from official WorkSafe NZ sources.",
  },
};
```

The `TopicSelector` tab appears automatically — no other code changes required.

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `.env.local` | Backend base URL. Default: `http://localhost:8000` |

---

## Design System

All design tokens are in `src/app/globals.css` under `:root`. Color palette from handoff doc §5.3:

| Token | Value | Usage |
|-------|-------|-------|
| `--primary-dark` | `#0F2A5C` | Sidebar, user bubble, headings |
| `--primary-mid` | `#3B6FC7` | Badges, send button hover, focus rings |
| `--surface-bg` | `#F0F4FA` | Page background |
| `--surface-card` | `#FFFFFF` | Cards, bot messages, input |
| `--border` | `#E2E8F0` | Dividers, card borders |

Font: **Inter** (preloaded via `next/font/google`). Fallback: `Segoe UI, sans-serif`.

---

## Legal

The disclaimer text in `src/components/Modal.tsx` is a **legal requirement** (handoff doc §5.6 and §9.4). Do not modify, shorten, or rephrase it.

---

## Contact

**Project owner:** Laura Cai  
**LinkedIn:** https://www.linkedin.com/in/laurahfc/  
**GitHub:** https://github.com/LauraHFC/rag-app-nz-employment-law
