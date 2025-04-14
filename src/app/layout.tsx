import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/language-context"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Location Search",
  description: "Search and visualize locations weather on an interactive map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <LanguageProvider>
        {children}
        <Toaster position="top-right" />
      </LanguageProvider>
      </body>
    </html>
  );
}
