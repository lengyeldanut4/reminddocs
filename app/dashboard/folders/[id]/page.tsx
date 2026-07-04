"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import AddDocumentDialog from "@/components/dashboard/AddDocumentDialog";

import {
  Folder,
  FileText,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

interface FolderItem {
  id: string;
  name: string;
}

interface DocumentItem {
  id: string;
  title: string;
  expiry_date: string;
  folder_id: string | null;
}

export default function FolderPage() {
  const router = useRouter();
  const params = useParams();

  const folderId = params.id as string;

  const [folder, setFolder] = useState<FolderItem | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolder();
  }, []);

  async function loadFolder() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: folderData } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .single();

    setFolder(folderData);

    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("folder_id", folderId)
      .order("created_at", { ascending: false });

    setDocuments(docs || []);

    setLoading(false);
  }

  async function deleteDocument(id: string) {
    if (!confirm("Ștergi documentul?")) return;

    await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    loadFolder();
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-10">

        <Navbar />        {loading ? (
          <div className="text-slate-400">
            Se încarcă...
          </div>
        ) : (
          <>

            <div className="flex items-center justify-between mb-8">

              <div>

                <div className="flex items-center gap-4">

                  <Folder
                    size={50}
                    className="text-blue-500"
                  />

                  <div>

                    <h1 className="text-4xl font-bold">
                      {folder?.name}
                    </h1>

                    <p className="text-slate-400 mt-2">
                      {documents.length} documente
                    </p>

                  </div>

                </div>

              </div>

              <div className="w-[380px]">
                <AddDocumentDialog
                  folderId={folderId}
                  onSuccess={loadFolder}
                />
              </div>

            </div>

            {documents.length === 0 ? (

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-16 text-center">

                <FileText
                  size={70}
                  className="mx-auto text-slate-600 mb-5"
                />

                <h2 className="text-3xl font-bold">
                  Folder gol
                </h2>

                <p className="text-slate-400 mt-3">
                  Adaugă primul document în acest folder.
                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

                {documents.map((doc) => {

                  const diff =
                    (new Date(doc.expiry_date).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24);

                  let status = "Activ";
                  let color = "text-green-400";
                  let Icon = CheckCircle2;

                  if (diff < 0) {
                    status = "Expirat";
                    color = "text-red-500";
                    Icon = AlertTriangle;
                  } else if (diff < 30) {
                    status = "Expiră curând";
                    color = "text-yellow-400";
                    Icon = Clock3;
                  }

                  return (

                    <div
                      key={doc.id}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 transition"
                    >

                      <div className="flex justify-between">

                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                          <FileText size={28} />
                        </div>

                        <Icon
                          size={26}
                          className={color}
                        />

                      </div>

                      <h3 className="text-2xl font-bold mt-6">
                        {doc.title}
                      </h3>

                      <p className="text-slate-400 mt-4">
                        Expiră la
                      </p>

                      <p className="font-semibold text-lg">
                        {doc.expiry_date}
                      </p>

                      <div className={`mt-6 flex items-center gap-2 font-semibold ${color}`}>
                        <Icon size={18} />
                        {status}
                      </div>

                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="mt-8 w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        Șterge document
                      </button>

                    </div>

                  );
                })}

              </div>

            )}

          </>
        )}      </main>

    </div>
  );
}
        