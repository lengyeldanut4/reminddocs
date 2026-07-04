"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

export default function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between mb-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          {t.appName}
        </h1>

        <p className="text-slate-400 mt-1">
          {t.smartManager}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <LanguageSwitcher />

        <button
          onClick={logout}
          className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
        >
          {t.logout}
        </button>

      </div>

    </header>
  );
}