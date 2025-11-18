"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  es: {
    // Navigation & Common
    "nav.dashboard": "Panel de Control",
    "nav.backToDashboard": "Panel",
    "common.loading": "Cargando",
    "common.error": "Error",
    "common.page": "Página",
    "common.of": "de",

    // Similar Creators Page
    "similarCreators.title": "Creadores Similares",
    "similarCreators.loading": "Cargando creadores similares...",
    "similarCreators.noCreators": "No se encontraron creadores",
    "similarCreators.noCreatorsDesc":
      "No hay creadores disponibles en este momento",
    "similarCreators.creators": "creadores",

    // Creator Card Metrics
    "metrics.gmv30d": "GMV 30D",
    "metrics.engagement": "COMPROMISO",
    "metrics.score": "PUNTUACIÓN",

    // Categories
    "category.beauty": "Belleza",
    "category.fashion": "Moda",
    "category.food": "Comida",
    "category.tech": "Tecnología",
    "category.fitness": "Fitness",
    "category.travel": "Viajes",
    "category.gaming": "Gaming",
    "category.music": "Música",
    "category.art": "Arte",
    "category.education": "Educación",

    // Pagination
    "pagination.previous": "Anterior",
    "pagination.next": "Siguiente",

    // Errors
    "error.loadingCreators": "Error al cargar creadores",
    "error.generic": "Ha ocurrido un error",
  },
  en: {
    // Navigation & Common
    "nav.dashboard": "Dashboard",
    "nav.backToDashboard": "Dashboard",
    "common.loading": "Loading",
    "common.error": "Error",
    "common.page": "Page",
    "common.of": "of",

    // Similar Creators Page
    "similarCreators.title": "Similar Creators",
    "similarCreators.loading": "Loading similar creators...",
    "similarCreators.noCreators": "No creators found",
    "similarCreators.noCreatorsDesc": "No creators available at this time",
    "similarCreators.creators": "creators",

    // Creator Card Metrics
    "metrics.gmv30d": "GMV 30D",
    "metrics.engagement": "ENGAGEMENT",
    "metrics.score": "SCORE",

    // Categories
    "category.beauty": "Beauty",
    "category.fashion": "Fashion",
    "category.food": "Food",
    "category.tech": "Technology",
    "category.fitness": "Fitness",
    "category.travel": "Travel",
    "category.gaming": "Gaming",
    "category.music": "Music",
    "category.art": "Art",
    "category.education": "Education",

    // Pagination
    "pagination.previous": "Previous",
    "pagination.next": "Next",

    // Errors
    "error.loadingCreators": "Error loading creators",
    "error.generic": "An error occurred",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es"); // Spanish by default

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["es"]] || key
    );
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
