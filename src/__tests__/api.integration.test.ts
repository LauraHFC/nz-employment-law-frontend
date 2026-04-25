/**
 * Integration test — POST /api/hub/query happy path (v3)
 * Verifies: correct endpoint, request shape, response fields
 *
 * Run with mock (default):      npx jest api.integration
 * Run against live backend:     INTEGRATION=true npx jest api.integration
 */

import { askHubQuestion } from "@/lib/api";

const LIVE = process.env.INTEGRATION === "true";
const QUESTION = "How many sick days am I entitled to?";

if (!LIVE) {
  global.fetch = jest.fn();
}

describe("POST /api/hub/query — integration", () => {
  if (!LIVE) {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          question: QUESTION,
          intent: "legal",
          confidence: "high",
          answer: "## Sick Leave\n\nEmployees are entitled to 10 days.",
          sources: [
            {
              title: "Sick leave | Employment New Zealand",
              url: "https://www.employment.govt.nz/leave-and-holidays/sick-leave/",
              content_type: "guide",
            },
          ],
          data_sql: null,
          data_rows: null,
          out_of_range_warning: null,
          router_reasoning: "Question is about legal entitlements.",
          chart: null,
        }),
      });
    });

    it("calls /api/hub/query — correct URL and method", async () => {
      await askHubQuestion(QUESTION);
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain("/api/hub/query");
      expect(options.method).toBe("POST");
      expect(options.headers?.["Content-Type"]).toBe("application/json");
    });

    it("request body has question and n_results — no topic param", async () => {
      await askHubQuestion(QUESTION, 5);
      const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.question).toBe(QUESTION);
      expect(body.n_results).toBe(5);
      expect(body.topic).toBeUndefined(); // topic must NOT be present (v3 contract)
    });

    it("returns all expected HubQueryResponse fields", async () => {
      const result = await askHubQuestion(QUESTION);
      expect(result.answer).toContain("Sick Leave");
      expect(result.intent).toBe("legal");
      expect(result.sources).toHaveLength(1);
      expect(result.sources[0].content_type).toBe("guide");
      expect(result.chart).toBeNull();
      expect(result.out_of_range_warning).toBeNull();
    });
  } else {
    it("returns a valid response from the live backend", async () => {
      const result = await askHubQuestion(QUESTION, 3);
      expect(typeof result.answer).toBe("string");
      expect(result.answer.length).toBeGreaterThan(10);
      expect(["legal", "data", "hybrid"]).toContain(result.intent);
      expect(Array.isArray(result.sources)).toBe(true);
    }, 15_000);
  }
});

describe("POST /api/hub/query — error handling", () => {
  it("throws on non-OK response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => '{"detail":"ANTHROPIC_API_KEY not set"}',
    });
    await expect(askHubQuestion("test")).rejects.toThrow();
  });

  it("throws on network failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(askHubQuestion("test")).rejects.toThrow("Failed to fetch");
  });
});
