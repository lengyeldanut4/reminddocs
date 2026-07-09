"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import AddDocumentDialog from "@/components/dashboard/AddDocumentDialog";
import DocumentCard from "@/components/dashboard/DocumentCard";

import {
  Folder,
  FileText,
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

  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_path: string | null;
}

interface FolderInfo {
  id: string;
  name: string;
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

    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("folder_id", folderId)
      .order("created_at", { ascending: false });

    setFolder(folderData);
    setDocuments(docs || []);

    setLoading(false);
  }

  async function deleteDocument(id: string) {
    if (!confirm("Ștergi documentul?")) return;

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadFolder();
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <Navbar />
                {loading ? (
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
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    folders={
                      folder
                        ? [
                            {
                              id: folder.id,
                              name: folder.name,
                            },
                          ]
                        : []
                    }
                    onDelete={() => deleteDocument(doc.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
              </main>
    </div>
  );
}