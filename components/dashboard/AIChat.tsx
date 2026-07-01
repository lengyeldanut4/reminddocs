"use client";

import { useState } from "react";

export default function AIChat({ documents }: any) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          documents,
        }),
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data?.reply ||
            "⚠️ Nu am primit răspuns de la AI",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Eroare la AI request.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="mt-10 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4">
        🤖 AI PRO Assistant
      </h3>

      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-slate-400">
            Întreabă despre documente...
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "text-blue-400"
                  : "text-green-400"
              }
            >
              <b>{m.role}:</b> {m.content}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 bg-slate-800 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: câte documente sunt active?"
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}