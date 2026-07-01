"use client";

import AddDocumentDialog from "./AddDocumentDialog";
import { Search, Bell, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="mb-10">

      {/* TOP */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Bun venit înapoi 👋 Gestionarea documentelor tale într-un singur loc.
          </p>
        </div>

        <div className="flex items-center gap-4">

          <button className="relative w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition flex items-center justify-center">

            <Bell size={20} />

            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></span>

          </button>

          <AddDocumentDialog
            onSuccess={() => {
              window.dispatchEvent(new Event("refresh-documents"));
            }}
          />

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2">

            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
              D
            </div>

            <div>
              <p className="font-semibold">
                Utilizator
              </p>

              <p className="text-xs text-slate-500">
                RemindDocs
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="mt-8">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex items-center px-5 py-4">

          <Search className="text-slate-500" size={20} />

          <input
            type="text"
            placeholder="Caută documente..."
            className="ml-4 flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
          />

          <Sparkles className="text-blue-500" size={20} />

        </div>

      </div>

    </header>
  );
}