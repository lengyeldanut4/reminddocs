"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddDocumentDialog({
  onSuccess,
  folderId = null,
}: {
  onSuccess: () => void;
  folderId?: string | null;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  async function save() {
    if (!title || !date) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from("documents").insert({
      user_id: userData.user.id,
      title,
      expiry_date: date,
      folder_id: folderId,
    });

    setTitle("");
    setDate("");
    onSuccess();
  }

  return (
    <div className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nume document"
        className="bg-slate-900 border-slate-700"
      />

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-slate-900 border-slate-700"
      />

      <Button onClick={save} className="w-full bg-blue-600">
        + Document
      </Button>
    </div>
  );
}