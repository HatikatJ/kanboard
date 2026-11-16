import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanboard — votre culture, à votre rythme",
  description: "Suivez vos films, séries et livres dans un seul espace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
