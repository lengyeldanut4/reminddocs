"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import AIChat from "@/components/dashboard/AIChat";
import StatsCards from "@/components/dashboard/StatsCards";

import {
  FileText,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
      }
    };

    checkUser();
  }, [router]);

  async function loadDocuments() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setDocuments(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadDocuments();

    const handler = () => loadDocuments();

    window.addEventListener("refresh-documents", handler);

    return () =>
      window.removeEventListener("refresh-documents", handler);
  }, []);

  async function deleteDocument(id: string) {
    const ok = confirm("Ștergi acest document?");

    if (!ok) return;

    await supabase.from("documents").delete().eq("id", id);

    loadDocuments();
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

        <AIChat documents={documents} />

        <div className="flex items-center justify-between mt-12 mb-6">

          <div>

            <h2 className="text-3xl font-bold">
              Documentele mele
            </h2>

            <p className="text-slate-400 mt-1">
              Gestionarea tuturor documentelor într-un singur loc.
            </p>

          </div>

        </div>

        {loading ? (
          <div className="text-slate-400">
            Se încarcă...
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

            <FileText
              size={60}
              className="mx-auto text-slate-600 mb-5"
            />

            <h3 className="text-2xl font-bold">
              Nu ai documente
            </h3>

            <p className="text-slate-400 mt-3">
              Adaugă primul document folosind butonul din dreapta sus.
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
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 hover:scale-[1.02] transition duration-300"
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