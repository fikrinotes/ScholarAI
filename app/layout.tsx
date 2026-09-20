import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScholarAI - Platform Rekomendasi Beasiswa Cerdas",
  description:
    "Temukan beasiswa impian yang sesuai dengan profil akademik dan minat Anda. Platform rekomendasi beasiswa berbasis AI (Google Gemini) untuk mahasiswa Indonesia.",
  keywords: ["beasiswa", "scholarship", "AI", "rekomendasi beasiswa", "MEXT", "GKS", "LPDP"],
  openGraph: {
    title: "ScholarAI - Platform Rekomendasi Beasiswa Cerdas",
    description:
      "Temukan beasiswa impian yang sesuai dengan profil Anda dengan bantuan AI.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
