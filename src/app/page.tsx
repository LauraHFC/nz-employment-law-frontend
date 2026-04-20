// / → redirect to first active topic (§7.3 handoff doc)
// The redirect uses server-side fetch so it's always driven by GET /api/topics
import { redirect } from "next/navigation";
import { fetchTopics } from "@/lib/api";

export default async function RootPage() {
  try {
    const topics = await fetchTopics();
    const first = topics.find((t) => t.active);
    if (first) redirect(`/t/${first.id}`);
  } catch {
    // Fallback when backend is unavailable
  }
  redirect("/t/nz_employment_law");
}
