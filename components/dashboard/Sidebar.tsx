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
      disabled: true,
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
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="border-b border-slate-800 px-8 py-8">
        <h1 className="text-3xl font-extrabold">
          <span className="text-blue-500">Remind</span>
          <span className="text-white">Docs</span>
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {t.smartManager}
        </p>
      </div>

      <nav className="flex-1 px-5 py-8 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <button
                key={item.title}
                disabled
                className="flex items-center justify-between w-full rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
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

          const active =
            pathname === "/dashboard" &&
            item.href === "/dashboard";

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-6">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 font-bold">
            U
          </div>

          <div>
            <p className="font-semibold">User</p>
            <p className="text-sm text-slate-500">
              RemindDocs
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
        >
          <LogOut size={18} />
          {t.logout}
        </button>

      </div>

    </aside>
  );
}