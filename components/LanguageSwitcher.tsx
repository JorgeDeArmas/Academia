"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <button
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
      title={language === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      <span className="text-sm font-medium text-gray-700">
        {language.toUpperCase()}
      </span>
    </button>
  );
}
