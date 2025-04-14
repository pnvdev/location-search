"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <Button variant="outline" onClick={toggleLanguage} className="ml-2">
      {language === "en" ? "ES" : "EN"}
    </Button>
  );
}
