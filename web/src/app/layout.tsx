import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export const metadata: Metadata = {
  title: "↑ ↓ ⇓ — The hidden pattern behind powers, roots, and logarithms",
  description:
    "An interactive article about an alternative notation for powers, roots, and logarithms using ↑, ↓ and ⇓.",
  openGraph: {
    title: "↑ ↓ ⇓ — The hidden pattern behind powers, roots, and logarithms",
    description:
      "Powers, roots, and logarithms are the same relationship. School notation hides it. Three arrows make it visible.",
    type: "article",
    locale: "en_GB",
    alternateLocale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "↑ ↓ ⇓ — The hidden pattern behind powers, roots, and logarithms",
    description:
      "Powers, roots, and logarithms are the same relationship. School notation hides it. Three arrows make it visible.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
