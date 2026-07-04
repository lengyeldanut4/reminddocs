"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

import {
  Search,
  Trash2,
  FileText,
  Plus,
} from "lucide-react";

import AddDocumentDialog from "@/components/dashboard/AddDocumentDialog";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
  folder_id: string | null;
  created_at: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadDocuments();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.replace("/login");
    }
  }

  async function loadDocuments() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    setDocuments(data || []);
    setLoading(false);
  }

  async function deleteDocument(id: string) {
    await supabase.from("documents").delete().eq("id", id);
    loadDocuments();
  }

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            {t.documents}
          </h1>

          <p className="text-slate-400 mt-1">
            Toate documentele tale într-un singur loc
          </p>
        </div>

        <AddDocumentDialog onSuccess={loadDocuments} />

      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 mb-8">

        <Search className="text-slate-400" size={18} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută document..."
          className="bg-transparent outline-none w-full"
        />

      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">{t.loading}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-900">

          <FileText size={50} className="mx-auto text-slate-600 mb-4" />

          <p className="text-slate-400">
            {t.noDocuments}
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
            >

              <div className="flex items-center justify-between">

                <FileText className="text-blue-500" />

                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <h2 className="text-xl font-semibold mt-4">
                {doc.title}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                {doc.expiry_date}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}