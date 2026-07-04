"use client";

import { useEffect, useState } from "react";
import { Language, translations } from "@/lib/translations";

export function useLanguage() {
  const [lang, setLang] = useState<Language>("ro");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;

    if (saved) {
      setLang(saved);
    }

    function update() {
      const l = (localStorage.getItem("lang") as Language) || "ro";
      setLang(l);
    }

    window.addEventListener("language-change", update);

    return () =>
      window.removeEventListener("language-change", update);
  }, []);

  function changeLanguage(language: Language) {
    localStorage.setItem("lang", language);
    setLang(language);
    window.dispatchEvent(new Event("language-change"));
  }

  return {
    lang,
    t: translations[lang],
    changeLanguage,
  };
}