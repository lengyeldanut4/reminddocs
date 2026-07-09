"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Folder,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";


interface Props {
  id: string;
  name: string;
  total: number;
  active: number;
  expiring: number;
  expired: number;
  onDelete: () => void;
  onRename: () => void;
}


export default function FolderCard({
  id,
  name,
  total,
  active,
  expiring,
  expired,
  onDelete,
  onRename,
}: Props) {

  const [open, setOpen] = useState(false);


  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">


      <div className="flex items-start justify-between">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <Folder size={30} />
        </div>


        <div className="relative">


          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl p-2 transition hover:bg-slate-800"
          >
            <MoreVertical size={20} />
          </button>


          {open && (
            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
                              <button
                onClick={() => {
                  setOpen(false);
                  onRename();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 transition hover:bg-slate-800"
              >
                <Pencil size={16} />
                Redenumește
              </button>


              <button
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-red-400 transition hover:bg-slate-800"
              >
                <Trash2 size={16} />
                Șterge
              </button>


            </div>
          )}

        </div>

      </div>


      <Link href={`/dashboard/folders/${id}`}>

        <h3 className="mt-6 cursor-pointer text-2xl font-bold">
          {name}
        </h3>

      </Link>


      <p className="mt-2 text-slate-400">
        {total} documente
      </p>


      <div className="mt-6 space-y-3">


        <div className="flex justify-between text-green-400">

          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} />
            Active
          </span>

          <span>
            {active}
          </span>

        </div>


        <div className="flex justify-between text-yellow-400">

          <span className="flex items-center gap-2">
            <Clock3 size={17} />
            Expiră curând
          </span>

          <span>
            {expiring}
          </span>

        </div>


        <div className="flex justify-between text-red-400">

          <span className="flex items-center gap-2">
            <AlertTriangle size={17} />
            Expirate
          </span>

          <span>
            {expired}
          </span>

        </div>


      </div>


      <Link
        href={`/dashboard/folders/${id}`}
        className="mt-6 block rounded-xl bg-blue-600 py-3 text-center font-semibold transition hover:bg-blue-700"
      >
        Deschide folder
      </Link>


    </div>
  );
}