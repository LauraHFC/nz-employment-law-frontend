# NZ Employment Law Assistant — Frontend

A production React / Next.js 14 frontend for an AI-powered NZ employment law chatbot, built on a Retrieval-Augmented Generation (RAG) pipeline backed by official NZ government sources.

**Live:** [nzlaw.linkiwise.com](https://nzlaw.linkiwise.com)

---

## Project Overview

This frontend was built as part of a full-stack RAG application that allows users to ask plain-English questions about New Zealand employment law and receive accurate, cited answers drawn from official sources including Employment New Zealand, the ERA, and the Employment Court.

The system was originally prototyped with a Streamlit UI. This React frontend was developed to replace it — delivering a production-quality chat interface with improved UX, extensibility for future knowledge bases, and a clean REST API boundary between frontend and backend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS custom properties (design tokens), no CSS framework |
| Font | Inter via `next/font/google` |
| Testing | Jest + React Testing Library |
| Deployment | Vercel |
| Backend API | FastAPI on Railway (`https://nzlaw-api.linkiwise.com`) |

---

## Architecture

```
User
 │
 ▼
Next.js Frontend (Vercel)
 │   nzlaw.linkiwise.com
 │
 ├── GET  /api/topics    → fetch available knowledge bases
 ├── POST /api/query     → submit question, receive answer + sources
 └── POST /api/feedback  → log thumbs up / down rating
 │
 ▼
FastAPI Backend (Railway)
 │   
 │
 └── RAG Pipeline
      ├── ChromaDB vectorstore
      ├── sentence-transformers/all-MiniLM-L6-v2 (embeddings)
      └── Claude Haiku (answer generation)
```

The frontend is fully decoupled from the RAG pipeline — it communicates only via REST API. Adding a new knowledge base requires editing a single frontend config file; no component changes needed.

---

## Key Design Decisions

**Topic-driven architecture** — Knowledge bases are fetched dynamically from `GET /api/topics` at runtime. The `TopicContext` manages per-topic conversation state, so chat history is isolated between topics. The `TopicSelector` tab appears automatically when two or more topics are active.

**Single config file for new topics** — `src/config/topics.config.ts` is the only file that needs editing when onboarding a new knowledge base. It controls example questions, sidebar description, input placeholder, and empty state copy.

**No hardcoded API strings** — All fetch calls are centralised in `src/lib/api.ts`. Components never call `fetch()` directly.

**Graceful degradation** — The app loads without the backend running. Topics fall back to a static list, and failed queries show friendly retry states rather than blank screens.

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
│   │   ├── SourcesPanel.tsx        # Collapsible source citations
│   │   ├── FeedbackRow.tsx         # 👍/👎 + copy to clipboard
│   │   ├── TopicSelector.tsx       # Hidden until 2+ topics exist
│   │   ├── Modal.tsx               # Privacy / Disclaimer / Terms
│   │   └── LoadingDots.tsx
│   ├── contexts/
│   │   └── TopicContext.tsx        # Single source of truth for topics + messages
│   ├── config/
│   │   └── topics.config.ts        # Per-topic UI strings — only file to edit when adding a topic
│   └── lib/
│       ├── api.ts                  # All fetch calls
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

## Local Development

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.x |
| npm | ≥ 10.x |

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

## Testing

# Unit tests + coverage report
npm test

Coverage threshold: statements ≥ 80%
Report output: coverage/lcov-report/index.html
Integration test (requires backend)
npm run test:integration
```

---

## Deployment

The frontend is deployed to **Vercel** via GitHub integration. Every push to `main` triggers an automatic redeploy.

## Contact

**Project owner:** Laura Cai
**LinkedIn:** https://www.linkedin.com/in/laurahfc/
