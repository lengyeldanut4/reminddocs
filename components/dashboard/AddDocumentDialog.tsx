"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddDocumentDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  async function addDocument() {
    if (!title || !expiryDate) {
      alert("Completează toate câmpurile");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Nu ești logat");
      return;
    }

    const { error } = await supabase.from("documents").insert({
      user_id: user.id,
      title,
      expiry_date: expiryDate,
    });

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    setTitle("");
    setExpiryDate("");
    onSuccess();
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        className="px-3 py-2 rounded bg-slate-800 text-white"
        placeholder="Nume document"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="px-3 py-2 rounded bg-slate-800 text-white"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />

      <button
        onClick={addDocument}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Adaugă
      </button>
    </div>
  );
}