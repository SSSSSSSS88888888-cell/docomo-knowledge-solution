import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "ナレッジ検索システム",
  description: "AI搭載の社内ナレッジ検索プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
