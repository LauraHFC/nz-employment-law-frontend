"use client";
// /t/[topicId] — main chat page (§7.3 handoff doc)
import { useParams } from "next/navigation";
import { TopicProvider } from "@/contexts/TopicContext";
import { ChatLayout } from "@/components/ChatLayout";

export default function TopicPage() {
  const params = useParams();
  const topicId = typeof params.topicId === "string" ? params.topicId : "nz_employment_law";

  return (
    <TopicProvider initialTopicId={topicId}>
      <ChatLayout />
    </TopicProvider>
  );
}
