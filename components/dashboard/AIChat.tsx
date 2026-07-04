"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import { Send } from "lucide-react";

export default function AIChat({ documents }: { documents: any[] }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);

    setLoading(true);

    // 🔥 SIMPLE AI LOGIC (local / upgrade later to OpenAI)
    const expired = documents.filter(
      (d) => new Date(d.expiry_date) < new Date()
    ).length;

    const expiringSoon = documents.filter((d) => {
      const diff =
        (new Date(d.expiry_date).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24);

      return diff > 0 && diff < 30;
    }).length;

    let response = "";

    if (userMsg.toLowerCase().includes("expir")) {
      response = `Ai ${expired} documente expirate și ${expiringSoon} care expiră curând.`;
    } else if (userMsg.toLowerCase().includes("document")) {
      response = `Ai în total ${documents.length} documente în sistem.`;
    } else {
      response =
        "Pot să te ajut cu documentele tale, expirări și notificări.";
    }

    setTimeout(() => {
      setChat((prev) => [...prev, { role: "ai", text: response }]);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-xl font-bold">🤖 AI Assistant</h3>
        <p className="text-slate-400 text-sm">
          Întreabă despre documentele tale
        </p>
      </div>

      {/* CHAT BOX */}
      <div className="h-64 overflow-y-auto space-y-3 mb-4 pr-2">

        {chat.map((c, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              c.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-slate-800"
            }`}
          >
            {c.text}
          </div>
        ))}

        {loading && (
          <div className="text-slate-400">AI scrie...</div>
        )}

      </div>

      {/* INPUT */}
      <div className="flex gap-2">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Întreabă AI..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-xl flex items-center gap-2"
        >
          <Send size={18} />
        </button>

      </div>

    </div>
  );
}