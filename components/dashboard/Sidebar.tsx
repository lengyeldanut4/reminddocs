export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-blue-500 mb-10">
        📄 RemindDocs
      </h1>

      <nav className="space-y-3">
        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          🏠 Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          📄 Documente
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          🔔 Notificări
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          🤖 AI Assistant
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          ⚙️ Setări
        </button>
      </nav>

      <div className="mt-auto">
        <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl">
          Logout
        </button>
      </div>
    </aside>
  );
}