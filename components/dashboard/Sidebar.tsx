"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/hooks/useLanguage";

import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  Bell,
  Bot,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const menu = [
    {
      title: t.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Documente",
      href: "/dashboard/documents",
      icon: FolderOpen,
    },
    {
      title: t.calendar,
      href: "/dashboard/calendar",
      icon: CalendarDays,
      
    },
    {
      title: t.notifications,
      href: "/dashboard/notifications",
      icon: Bell,
      disabled: true,
    },
    {
      title: t.ai,
      href: "/dashboard/ai",
      icon: Bot,
      disabled: true,
    },
    {
      title: t.settings,
      href: "/dashboard/settings",
      icon: Settings,
      disabled: true,
    },
  ];
  return (
  <aside className="flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">

    <div className="border-b border-slate-800 p-8">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <ShieldCheck size={30} />
        </div>

        <div>

          <h1 className="text-3xl font-extrabold">
            <span className="text-blue-500">Remind</span>
            <span className="text-white">Docs</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {t.smartManager}
          </p>

        </div>

      </div>

    </div>

    <nav className="flex-1 space-y-3 p-5">

      {menu.map((item) => {

        const Icon = item.icon;

        const active =
  item.href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(item.href);

        if (item.disabled) {
          return (
            <button
              key={item.title}
              disabled
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 text-slate-500"
            >
              <div className="flex items-center gap-4">
                <Icon size={20} />
                {item.title}
              </div>

              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">
                {t.soon}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`flex items-center gap-4 rounded-2xl px-4 py-4 font-medium transition ${
              active
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <Icon size={21} />
            {item.title}
          </Link>
        );
      })}

    </nav>
        <div className="border-t border-slate-800 p-6">

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-lg font-bold">
          U
        </div>

        <div>

          <p className="font-semibold">
            User
          </p>

          <p className="text-sm text-slate-500">
            RemindDocs
          </p>

        </div>

      </div>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
      >
        <LogOut size={18} />
        {t.logout}
      </button>

      <p className="mt-6 text-center text-xs text-slate-600">
        RemindDocs v1.0
      </p>

    </div>

  </aside>
);
}