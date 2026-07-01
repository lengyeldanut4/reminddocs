"use client";

import AddDocumentDialog from "./AddDocumentDialog";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-slate-400">Bine ai revenit 👋</p>
      </div>

      <AddDocumentDialog
        onSuccess={() => {
          window.dispatchEvent(new Event("refresh-documents"));
        }}
      />
    </header>
  );
}