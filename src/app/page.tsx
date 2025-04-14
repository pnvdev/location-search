"use client";

import { MapSearch } from "@/components/MapSearch";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslations";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center">
          {t("page.title")}
        </h1>
        <MapSearch />
      </div>
      <Footer />
    </main>
  );
}
