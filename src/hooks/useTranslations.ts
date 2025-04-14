"use client";

import { useLanguage } from "@/context/language-context";
import { getTranslation, type TranslationKey } from "@/lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey) => {
    return getTranslation(language, key);
  };

  return { t };
}