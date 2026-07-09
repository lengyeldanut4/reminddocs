"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import AIChat from "@/components/dashboard/AIChat";
import StatsCards from "@/components/dashboard/StatsCards";
import AddDocumentDialog from "@/components/dashboard/AddDocumentDialog";
import AddFolderDialog from "@/components/dashboard/AddFolderDialog";
import DocumentCard from "@/components/dashboard/DocumentCard";
import FolderCard from "@/components/dashboard/FolderCard";
import NotificationsCard from "@/components/dashboard/NotificationsCard";

import { FileText } from "lucide-react";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
  folder_id: string | null;

  file_url: string | null;
  file_name: string |null;
  file_type: string | null;
  file_path: string | null;
}

interface FolderItem {
  id: string;
  name: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadData();

    const handler = () => loadData();

    window.addEventListener("refresh-documents", handler);

    return () =>
      window.removeEventListener("refresh-documents", handler);
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.replace("/login");
    }
  }

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const [{ data: docs }, { data: foldersData }] = await Promise.all([
      supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("name"),
    ]);

    setDocuments(docs || []);
    setFolders(foldersData || []);

    setLoading(false);
  }

async function deleteDocument(doc: Document) {
  if (!confirm("Ștergi documentul?")) return;

  // Șterge fișierul din Storage
  if (doc.file_path) {
    await supabase.storage
      .from("documents")
      .remove([doc.file_path]);
  }

  // Șterge documentul din baza de date
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", doc.id);

  if (error) {
    alert(error.message);
    return;
  }

  loadData();
}



  async function deleteFolder(id: string) {
    if (
      !confirm(
        "Ștergi folderul? Documentele vor rămâne în aplicație și vor fi mutate în «Fără folder»."
      )
    )
      return;

    await supabase
      .from("documents")
      .update({ folder_id: null })
      .eq("folder_id", id);

    await supabase
      .from("folders")
      .delete()
      .eq("id", id);

    loadData();
  }

  async function renameFolder(id: string, currentName: string) {
    const name = prompt("Nume nou folder:", currentName);

    if (!name?.trim()) return;

    const { error } = await supabase
      .from("folders")
      .update({
        name,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  const total = documents.length;
    const expired = documents.filter(
    (d) => new Date(d.expiry_date) < new Date()
  ).length;

  const expiringSoon = documents.filter((d) => {
    const diff =
      (new Date(d.expiry_date).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 && diff < 30;
  }).length;

  const active = total - expired - expiringSoon;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <Navbar />

        <StatsCards
          total={total}
          active={active}
          expired={expired}
          expiringSoon={expiringSoon}
        />
        <NotificationsCard documents={documents} />

        <AIChat documents={documents} />

        <div className="flex items-center justify-between mt-12 mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Foldere
            </h2>

            <p className="text-slate-400 mt-1">
              Organizează documentele pe categorii.
            </p>
          </div>

          <AddFolderDialog onSuccess={loadData} />
        </div>

        {folders.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {folders.map((folder) => {
              const folderDocs = documents.filter(
                (d) => d.folder_id === folder.id
              );

              const activeDocs = folderDocs.filter((d) => {
                const diff =
                  (new Date(d.expiry_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24);

                return diff >= 30;
              }).length;

              const expiringDocs = folderDocs.filter((d) => {
                const diff =
                  (new Date(d.expiry_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24);

                return diff >= 0 && diff < 30;
              }).length;

              const expiredDocs = folderDocs.filter((d) => {
                return new Date(d.expiry_date) < new Date();
              }).length;

              return (
                <FolderCard
                  key={folder.id}
                  id={folder.id}
                  name={folder.name}
                  total={folderDocs.length}
                  active={activeDocs}
                  expiring={expiringDocs}
                  expired={expiredDocs}
                  onDelete={() => deleteFolder(folder.id)}
                  onRename={() =>
                    renameFolder(folder.id, folder.name)
                  }
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}