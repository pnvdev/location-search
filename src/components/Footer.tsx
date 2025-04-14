import { useTranslation } from "@/hooks/useTranslations";

export function Footer() {

  const { t } = useTranslation();

  return (
    <footer className="mt-8 text-center text-sm text-muted-foreground">
      <p>
        {t("footer.credits")}{" "}
        <a
          href="https://github.com/pnvdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          pnvdev
        </a>
      </p>
    </footer>
  );
}
