"use client";

import { useState } from "react";

import {
  Send,
  Bot,
  User,
} from "lucide-react";

export default function AIChat({
  documents,
}: {
  documents: any[];
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState<
    {
      role: "user" | "ai";
      text: string;
    }[]
  >([]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMsg = message;

    setMessage("");

    setChat((prev) => [
      ...prev,
      {
        role: "user",
        text: userMsg,
      },
    ]);

    setLoading(true);

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
      response = `Ai ${expired} documente expirate și ${expiringSoon} care expiră în următoarele 30 de zile.`;
    } else if (
      userMsg.toLowerCase().includes("document")
    ) {
      response = `Ai ${documents.length} documente salvate în aplicație.`;
    } else {
      response =
        "Momentan te pot ajuta cu documentele, folderele și datele de expirare.";
    }

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: response,
        },
      ]);

      setLoading(false);
    }, 700);
  }
  return (
  <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">

    <div className="mb-5 flex items-center gap-3">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
        <Bot size={25} />
      </div>

      <div>

        <h3 className="text-xl font-bold">
          AI Assistant
        </h3>

        <p className="text-sm text-slate-400">
          Întreabă despre documentele tale
        </p>

      </div>

    </div>


    <div className="mb-5 h-64 space-y-3 overflow-y-auto pr-2">

      {chat.length === 0 && (
        <div className="rounded-xl bg-slate-800 p-4 text-slate-400">
          Salut! Pot analiza documentele și expirările tale.
        </div>
      )}


      {chat.map((c, i) => (

        <div
          key={i}
          className={`flex gap-3 ${
            c.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >

          {c.role === "ai" && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <Bot size={16} />
            </div>
          )}


          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              c.role === "user"
                ? "bg-blue-600"
                : "bg-slate-800"
            }`}
          >
            {c.text}
          </div>


          {c.role === "user" && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
              <User size={16} />
            </div>
          )}

        </div>

      ))}


      {loading && (
        <div className="text-sm text-slate-400">
          AI analizează...
        </div>
      )}

    </div>


    <div className="flex gap-3">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Întreabă AI..."
        className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
      />


      <button
        onClick={sendMessage}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 transition hover:bg-blue-700"
      >
        <Send size={18} />
      </button>

    </div>

  </div>
);
}