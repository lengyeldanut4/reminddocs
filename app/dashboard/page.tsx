"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import AIChat from "@/components/dashboard/AIChat";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔔 NOTIFICATIONS PERMISSION
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // 📄 LOAD DOCUMENTS
  async function loadDocuments() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

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

  // 🗑️ DELETE DOCUMENT
  async function deleteDocument(id: string) {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Eroare: " + error.message);
      return;
    }

    loadDocuments();
  }

  // 🔔 SIMPLE NOTIFICATIONS (LOCAL)
  useEffect(() => {
    if (!documents.length) return;

    const now = new Date();

    documents.forEach((doc) => {
      const expiry = new Date(doc.expiry_date);

      const diff =
        (expiry.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24);

      if (Notification.permission !== "granted") return;

      if (diff < 0) {
        new Notification("❌ Document expirat", {
          body: doc.title,
        });
      } else if (diff < 7) {
        new Notification("⚠️ Expiră curând", {
          body: doc.title,
        });
      }
    });
  }, [documents]);

  // 📊 STATS
  const total = documents.length;

  const expired = documents.filter(
    (d) => new Date(d.expiry_date) < new Date()
  ).length;

  const expiringSoon = documents.filter((d) => {
    const today = new Date();
    const expiry = new Date(d.expiry_date);

    const diff =
      (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 && diff < 30;
  }).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <Navbar />

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Total documente</p>
            <h3 className="text-3xl font-bold mt-2">{total}</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-red-400">Expirate</p>
            <h3 className="text-3xl font-bold mt-2">{expired}</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-yellow-400">Expiră curând</p>
            <h3 className="text-3xl font-bold mt-2">
              {expiringSoon}
            </h3>
          </div>
        </div>

        {/* 🤖 AI CHAT */}
        <AIChat documents={documents} />

        {/* LISTA DOCUMENTE */}
        <h2 className="text-2xl font-bold mt-10 mb-6">
          Documentele mele
        </h2>

        {loading ? (
          <p className="text-slate-400">Se încarcă...</p>
        ) : documents.length === 0 ? (
          <div className="text-slate-400 bg-slate-900 p-6 rounded-xl border border-slate-800">
            Nu ai documente încă. Adaugă primul document 👆
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const today = new Date();
              const expiry = new Date(doc.expiry_date);

              const diffDays =
                (expiry.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24);

              let status = "Activ";
              let color = "text-green-400";

              if (diffDays < 0) {
                status = "Expirat";
                color = "text-red-500";
              } else if (diffDays < 30) {
                status = "Expiră curând";
                color = "text-yellow-400";
              }

              return (
                <div
                  key={doc.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:scale-[1.02] transition"
                >
                  <h3 className="text-xl font-semibold">
                    {doc.title}
                  </h3>

                  <p className="text-slate-400 mt-2">
                    Expiră la:
                  </p>

                  <p className="font-bold mb-2">
                    {doc.expiry_date}
                  </p>

                  <span className={`font-semibold ${color}`}>
                    ● {status}
                  </span>

                  {/* 🗑️ DELETE BUTTON */}
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                  >
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