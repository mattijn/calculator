import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alternative Notation Calculator",
  description:
    "Calculator and learning website for alternative notation with ↑, ↓ and ⇓ operators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="siteHeader">
          <Link href="/" className="brand">
            Alternative Notation Calculator
          </Link>
        </header>
        <main className="pageContainer">{children}</main>
      </body>
    </html>
  );
}
