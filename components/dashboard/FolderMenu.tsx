"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";


interface Props {
  onRename: () => void;
  onDelete: () => void;
}


export default function FolderMenu({
  onRename,
  onDelete,
}: Props) {

  return (
    <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">


      <button
        onClick={onRename}
        className="flex w-full items-center gap-3 px-4 py-3 transition hover:bg-slate-800"
      >

        <Pencil size={16} />

        Redenumește

      </button>


      <button
        onClick={onDelete}
        className="flex w-full items-center gap-3 px-4 py-3 text-red-400 transition hover:bg-slate-800"
      >

        <Trash2 size={16} />

        Șterge

      </button>


    </div>
  );
}