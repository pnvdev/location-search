"use client";

import { MapSearch } from "@/components/MapSearch";
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {t.pageTitle}
        </h1>
        <MapSearch />
      </div>
    </main>
  );
}
