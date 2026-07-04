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
import Link from "next/link";

import {
  FileText,
  Folder,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
  folder_id: string | null;
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

  async function deleteDocument(id: string) {
    if (!confirm("Ștergi documentul?")) return;

    await supabase.from("documents").delete().eq("id", id);

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

  return (    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-10">

        <Navbar />

        <StatsCards
          total={total}
          active={active}
          expired={expired}
          expiringSoon={expiringSoon}
        />

        <AIChat documents={documents} />

        {/* ================= FOLDERE ================= */}

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

const count = folderDocs.length;

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
  <Link
    key={folder.id}
    href={`/dashboard/folders/${folder.id}`}
    className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 hover:scale-[1.02] transition duration-300 block"
  >

    <Folder
      size={46}
      className="text-blue-500"
    />

    <h3 className="text-2xl font-bold mt-5">
      {folder.name}
    </h3>

    <p className="text-slate-400 mt-2">
  {count} documente
</p>

<div className="mt-5 space-y-2 text-sm">

  <div className="flex justify-between">
    <span className="text-green-400">Active</span>
    <span>{activeDocs}</span>
  </div>

  <div className="flex justify-between">
    <span className="text-yellow-400">Expiră curând</span>
    <span>{expiringDocs}</span>
  </div>

  <div className="flex justify-between">
    <span className="text-red-400">Expirate</span>
    <span>{expiredDocs}</span>
  </div>

</div>

    <p className="text-blue-400 mt-6 font-medium">
      Deschide folder →
    </p>

  </Link>
);
            })}

          </div>
        )}

        {/* ================= DOCUMENTE ================= */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-3xl font-bold">
              Documentele mele
            </h2>

            <p className="text-slate-400 mt-1">
              Toate documentele.
            </p>
          </div>

          <AddDocumentDialog onSuccess={loadData} />

        </div>

        {loading ? (
          <div className="text-slate-400">
            Se încarcă...
          </div>
        ) : documents.length === 0 ? (

          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-12 text-center">

            <FileText
              size={70}
              className="mx-auto text-slate-600 mb-5"
            />

            <h3 className="text-3xl font-bold">
              Nu ai documente încă
            </h3>

            <p className="text-slate-400 mt-3 max-w-md mx-auto">
              Creează primul document folosind butonul „+ Document” din partea de sus.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

            {documents
  .filter((doc) => !doc.folder_id)
  .map((doc) => {

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
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 hover:scale-[1.02] transition duration-300"
                >

                  <div className="flex justify-between">

                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                      <FileText size={28} />
                    </div>

                    <Icon size={26} className={color} />

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

                  {doc.folder_id && (
                    <p className="text-sm text-blue-400 mt-2">
                      {folders.find((f) => f.id === doc.folder_id)?.name}
                    </p>
                  )}

                  <div
                    className={`mt-6 font-semibold flex items-center gap-2 ${color}`}
                  >
                    <Icon size={18} />
                    {status}
                  </div>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="mt-8 w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <Trash2 size={18} />
                    Șterge document
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}