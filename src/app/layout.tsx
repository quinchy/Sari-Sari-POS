import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sari-Sari POS",
  description: "POS System for Sari Sari Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} antialiased`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
