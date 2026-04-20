"use client";
import { useEffect, useRef } from "react";
import { useTopicContext } from "@/contexts/TopicContext";
import { Message } from "./Message";
import { WelcomeState } from "./WelcomeState";

interface ChatAreaProps {
  onSend: (text: string) => void;
  onRetry: (text: string, loadId: string) => void;
}

export function ChatArea({ onSend, onRetry }: ChatAreaProps) {
  const { activeTopic, conversations } = useTopicContext();
  const messages = activeTopic ? (conversations[activeTopic.id] ?? []) : [];
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView ? undefined : null;
    if (bottomRef.current?.parentElement) {
      const el = bottomRef.current.parentElement;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, messages[messages.length - 1]?.text]);

  return (
    <div
      className="chat-area"
      role="log"
      aria-live="polite"
      aria-label="Conversation"
    >
      {messages.length === 0 ? (
        <WelcomeState onSend={onSend} />
      ) : (
        messages.map((msg) => (
          <Message key={msg.id} msg={msg} onRetry={onRetry} />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
