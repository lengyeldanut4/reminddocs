"use client";

import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Bell,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* LOGO */}
      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-blue-500">Remind</span>
          <span className="text-white">Docs</span>
        </h1>

        <p className="text-slate-500 text-sm mt-2">
          Smart document manager
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-5 py-8 space-y-2">

        <button className="flex items-center gap-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-700">
          <LayoutDashboard size={21} />
          Dashboard
        </button>

        <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 transition">
          <FileText size={21} />
          Documente
        </button>

        <button className="flex items-center justify-between w-full rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 transition">
          <div className="flex items-center gap-4">
            <CalendarDays size={21} />
            Calendar
          </div>

          <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
            Soon
          </span>
        </button>

        <button className="flex items-center justify-between w-full rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 transition">
          <div className="flex items-center gap-4">
            <Bell size={21} />
            Notificări
          </div>

          <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
            Soon
          </span>
        </button>

        <button className="flex items-center justify-between w-full rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 transition">
          <div className="flex items-center gap-4">
            <Bot size={21} />
            AI Assistant
          </div>

          <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
            Soon
          </span>
        </button>

        <button className="flex items-center justify-between w-full rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-900 transition">
          <div className="flex items-center gap-4">
            <Settings size={21} />
            Setări
          </div>

          <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
            Soon
          </span>
        </button>

      </nav>

      {/* USER */}
      <div className="border-t border-slate-800 p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold">
            D
          </div>

          <div>
            <p className="font-semibold">
              Utilizator
            </p>

            <p className="text-sm text-slate-500">
              RemindDocs
            </p>
          </div>

        </div>

        <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 transition font-semibold">
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}