"use client";

import { useState } from "react";
import Link from "next/link";

import {
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";


interface Document {
  id: string;
  title: string;
  expiry_date: string;
  folder_id: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
}


interface FolderItem {
  id: string;
  name: string;
}


interface Props {
  doc: Document;
  folders: FolderItem[];
  onDelete: () => void;
}


export default function DocumentCard({
  doc,
  folders,
  onDelete,
}: Props) {

  const [open, setOpen] = useState(false);


  const diff =
    (new Date(doc.expiry_date).getTime() - Date.now()) /
    (1000 * 60 * 60 * 24);


  let status = "Activ";
  let color = "text-green-400";
  let badge = "bg-green-500/10";
  let Icon = CheckCircle2;


  if (diff < 0) {
    status = "Expirat";
    color = "text-red-500";
    badge = "bg-red-500/10";
    Icon = AlertTriangle;

  } else if (diff < 30) {

    status = "Expiră curând";
    color = "text-yellow-400";
    badge = "bg-yellow-500/10";
    Icon = Clock3;

  }
  return (
  <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">

    <div className="flex items-start justify-between">

      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-blue-600">

  {doc.file_type?.startsWith("image/") ? (

    <img
      src={doc.file_url || ""}
      alt={doc.title}
      className="h-full w-full object-cover"
    />

  ) : (

    <FileText size={28} />

  )}

</div>


      <div className="relative">

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl p-2 transition hover:bg-slate-800"
        >
          <MoreVertical size={20} />
        </button>


        {open && (

          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">

            <Link
              href={`/dashboard/documents/${doc.id}`}
              className="flex items-center gap-2 px-4 py-3 transition hover:bg-slate-800"
            >
              <Pencil size={16} />
              Editează
            </Link>


            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 px-4 py-3 text-red-400 transition hover:bg-slate-800"
            >
              <Trash2 size={16} />
              Șterge
            </button>

          </div>

        )}

      </div>

    </div>


    <h3 className="mt-6 text-2xl font-bold">
      {doc.title}
    </h3>


    <p className="mt-4 text-slate-400">
      Expiră la
    </p>

    <p className="text-lg font-semibold">
      {doc.expiry_date}
    </p>

    {doc.file_url && (

  <div className="mt-5 rounded-xl bg-slate-800 p-4">

    <p className="text-sm text-slate-400">
      Fișier atașat
    </p>

    <p className="mt-1 truncate font-semibold">
      {doc.file_name}
    </p>

    {doc.file_type?.startsWith("image/") && (

      <img
        src={doc.file_url}
        alt={doc.title}
        className="mt-4 h-48 w-full rounded-xl object-cover"
      />

    )}

    <div className="mt-4 grid grid-cols-2 gap-3">

      <a
        href={doc.file_url}
        target="_blank"
        className="rounded-xl bg-green-600 py-2 text-center font-semibold transition hover:bg-green-700"
      >
        👁️ Deschide
      </a>

    </div>

  </div>

)}


    {doc.folder_id && (

      <p className="mt-3 text-sm text-blue-400">
        {folders.find(
          (folder) => folder.id === doc.folder_id
        )?.name}
      </p>

    )}


    <div
      className={`mt-6 flex items-center gap-2 rounded-xl px-3 py-2 font-semibold ${color} ${badge}`}
    >
      <Icon size={18} />
      {status}
    </div>


    <Link href={`/dashboard/documents/${doc.id}`}>

      <button
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
      >
        Vezi detalii
      </button>

    </Link>


  </div>
);
}