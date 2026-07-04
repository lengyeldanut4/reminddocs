"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Folder, Plus, Trash2 } from "lucide-react";

interface FolderItem {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("USER:", user);

const test = await supabase.from("folders").select("*");

console.log(test);

    console.log("USER:", user);

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
  .from("folders")
  .select("*")
  .order("created_at", { ascending: false });

    console.log("FOLDERS:", data);
    console.log("ERROR:", error);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setFolders(data || []);
    setLoading(false);
  }

  async function createFolder() {
    if (!newFolder.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("folders")
      .insert({
        user_id: user.id,
        name: newFolder,
      })
      .select();

    console.log("INSERT:", data);
    console.log("INSERT ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    setNewFolder("");
    await loadFolders();
  }

  async function deleteFolder(id: string) {
    if (!confirm("Ștergi folderul?")) return;

    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadFolders();
  }

  return (
    <div>

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">Foldere</h1>
          <p className="text-slate-400">
            Organizează documentele pe categorii.
          </p>
        </div>

      </div>

      <div className="flex gap-3 mb-8">

        <input
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          placeholder="Nume folder"
          className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3"
        />

        <button
          onClick={createFolder}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 flex items-center gap-2"
        >
          <Plus size={18} />
          Folder nou
        </button>

      </div>

      {loading ? (
        <p className="text-slate-400">Se încarcă...</p>
      ) : folders.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-2xl">
          <Folder size={60} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">Nu există foldere.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer"
            >
              <div className="flex justify-between items-center">

                <Folder
                  className="text-blue-500"
                  size={40}
                />

                <button
                  onClick={() => deleteFolder(folder.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <h2 className="text-xl font-semibold mt-5">
                {folder.name}
              </h2>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}