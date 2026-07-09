"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";

export default function AddFolderDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    if (!name.trim()) {
      alert("Introdu numele folderului.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("folders")
      .insert({
        user_id: userData.user.id,
        name,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");

    onSuccess();

    window.dispatchEvent(new Event("refresh-documents"));
  }
  return (
  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-4">

    <div className="flex items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
        <FolderPlus size={24} />
      </div>

      <div>
        <h3 className="font-bold text-lg">
          Folder nou
        </h3>

        <p className="text-sm text-slate-400">
          Organizează documentele tale.
        </p>
      </div>

    </div>

    <Input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Nume folder..."
      className="bg-slate-800 border-slate-700 h-11 rounded-xl"
    />

    <Button
      onClick={create}
      disabled={loading}
      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
    >
      {loading ? "Se creează..." : "+ Creează folder"}
    </Button>

  </div>
);
}