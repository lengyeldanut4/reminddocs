"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddFolderDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");

  async function create() {
    if (!name.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from("folders").insert({
      user_id: userData.user.id,
      name,
    });

    setName("");
    onSuccess();
  }

  return (
    <div className="flex gap-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nume folder"
        className="bg-slate-900 border-slate-700"
      />

      <Button onClick={create} className="bg-blue-600">
        + Folder
      </Button>
    </div>
  );
}