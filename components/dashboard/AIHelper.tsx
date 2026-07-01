"use client";

import { useState } from "react";

interface Document {
  title: string;
  expiry_date: string;
}

export default function AIHelper({
  documents,
}: {
  documents: Document[];
}) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");

  function askAI() {
    const today = new Date();

    const expired = documents.filter(
      (d) => new Date(d.expiry_date) < today
    );

    const expiringSoon = documents.filter((d) => {
      const diff =
        (new Date(d.expiry_date).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);
      return diff > 0 && diff < 30;
    });

    let text = "";

    if (expired.length > 0) {
      text += `❌ Ai ${expired.length} documente expirate.\n`;
    }

    if (expiringSoon.length > 0) {
      text += `⚠️ Ai ${expiringSoon.length} documente care expiră curând.\n`;
    }

    if (expired.length === 0 && expiringSoon.length === 0) {
      text = "✅ Totul este în regulă. Nu ai probleme cu documentele.";
    }

    setResponse(text);
    setOpen(true);
  }

  return (
    <div className="mt-6">
      <button
        onClick={askAI}
        className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 rounded-xl font-semibold"
      >
        🤖 Ask AI Assistant
      </button>

      {open && (
        <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl whitespace-pre-line">
          {response}
        </div>
      )}
    </div>
  );
}