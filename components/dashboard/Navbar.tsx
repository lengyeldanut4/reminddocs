"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect, useState } from "react";

import {
  LogOut,
  ShieldCheck,
  Bell,
  AlertTriangle,
  Clock3,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
const [openNotifications, setOpenNotifications] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  useEffect(() => {
  loadNotifications();
}, []);

async function loadNotifications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("documents")
    .select("id,title,expiry_date")
    .eq("user_id", user.id);

  if (!data) return;

  const docs = data
    .map((doc) => {
      const diff = Math.floor(
        (new Date(doc.expiry_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...doc,
        diff,
      };
    })
    .filter((d) => d.diff <= 30)
    .sort((a, b) => a.diff - b.diff);

  setNotifications(docs);
}
  return (
  <header className="mb-10 flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900 px-8 py-6">

    <div className="flex items-center gap-4">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
        <ShieldCheck size={28} />
      </div>

      <div>

        <h1 className="text-3xl font-bold">
          {t.appName}
        </h1>

        <p className="mt-1 text-slate-400">
          {t.smartManager}
        </p>

      </div>

    </div>

    <div className="flex items-center gap-4">

<div className="relative">

  <button
    onClick={() =>
      setOpenNotifications(!openNotifications)
    }
    className="relative rounded-xl bg-slate-800 p-3 hover:bg-slate-700 transition"
  >
    <Bell size={22} />

    {notifications.length > 0 && (

      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
        {notifications.length}
      </span>

    )}

  </button>

  {openNotifications && (

    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl z-50">

      <h3 className="mb-4 font-bold">
        Notificări
      </h3>

      {notifications.length === 0 ? (

        <p className="text-slate-400">
          Nu există notificări.
        </p>

      ) : (

        <div className="space-y-3">

          {notifications.map((doc) => (

            <div
              key={doc.id}
              className="rounded-xl bg-slate-800 p-3"
            >

              <div className="flex items-center gap-2">

                {doc.diff < 0 ? (

                  <AlertTriangle
                    size={18}
                    className="text-red-500"
                  />

                ) : (

                  <Clock3
                    size={18}
                    className="text-yellow-400"
                  />

                )}

                <span className="font-semibold">
                  {doc.title}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-400">

                {doc.diff < 0
                  ? `Expirat de ${Math.abs(doc.diff)} zile`
                  : doc.diff === 0
                  ? "Expiră astăzi"
                  : doc.diff === 1
                  ? "Expiră mâine"
                  : `Expiră în ${doc.diff} zile`}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  )}

</div>
      <LanguageSwitcher />

      <button
        onClick={logout}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
      >
        <LogOut size={18} />
        {t.logout}
      </button>

    </div>

  </header>
);
}