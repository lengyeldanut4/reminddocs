"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => changeLanguage(e.target.value as any)}
      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none hover:border-blue-500 transition"
    >
      <option value="ro">🇷🇴 Română</option>
      <option value="en">🇬🇧 English</option>
      <option value="es">🇪🇸 Español</option>
    </select>
  );
}