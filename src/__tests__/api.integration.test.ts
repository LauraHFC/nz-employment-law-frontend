/**
 * Integration test — POST /api/query happy path
 * Verifies: topic field is present in request body (§3.2 handoff doc requirement)
 *
 * Run against a live backend:   INTEGRATION=true npx jest api.integration
 * Run with mock (default):      npx jest api.integration
 */

import { askQuestion } from "@/lib/api";

const LIVE = process.env.INTEGRATION === "true";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Mock mode (default — no backend required) ─────────────────────────────────
if (!LIVE) {
  global.fetch = jest.fn();
}

describe("POST /api/query — integration", () => {
  const QUESTION = "How many sick days am I entitled to?";
  const TOPIC    = "nz_employment_law";

  if (!LIVE) {
    // ── Mock: verifies the request shape and topic param ─────────────────────
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: "## Sick Leave\n\nEmployees are entitled to 10 days.",
          sources: [
            {
              title: "Sick leave | Employment New Zealand",
              url: "https://www.employment.govt.nz/leave-and-holidays/sick-leave/",
              content_type: "guide",
              source_name: "employment_govt_nz",
            },
          ],
          question: QUESTION,
        }),
      });
    });

    it("sends POST to /api/query with correct shape including topic", async () => {
      await askQuestion(QUESTION, TOPIC);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];

      // Correct endpoint
      expect(url).toContain("/api/query");

      // Method
      expect(options.method).toBe("POST");

      // Content-Type
      expect(options.headers?.["Content-Type"]).toBe("application/json");

      // Body must include topic field (§3.2 requirement)
      const body = JSON.parse(options.body);
      expect(body.topic).toBe(TOPIC);
      expect(body.question).toBe(QUESTION);
      expect(typeof body.n_results).toBe("number");
    });

    it("returns answer, sources, and question from response", async () => {
      const result = await askQuestion(QUESTION, TOPIC);
      expect(result.answer).toContain("Sick Leave");
      expect(result.sources).toHaveLength(1);
      expect(result.sources[0].content_type).toBe("guide");
      expect(result.question).toBe(QUESTION);
    });
  } else {
    // ── Live mode: runs against real backend ─────────────────────────────────
    it("returns a valid response from the live backend", async () => {
      const result = await askQuestion(QUESTION, TOPIC, 3);
      expect(typeof result.answer).toBe("string");
      expect(result.answer.length).toBeGreaterThan(10);
      expect(Array.isArray(result.sources)).toBe(true);
      expect(result.question).toBe(QUESTION);
    }, 15_000); // allow up to 15s for Claude API call
  }
});

describe("POST /api/query — error handling", () => {
  it("throws an error when API returns non-OK status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => '{"detail":"RAG query failed: timeout"}',
    });
    await expect(askQuestion("test", TOPIC)).rejects.toThrow();
  });

  it("throws on network failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(askQuestion("test", TOPIC)).rejects.toThrow("Failed to fetch");
  });
});
