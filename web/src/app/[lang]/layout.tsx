import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Language } from "@/components/blog/types";

const SUPPORTED_LANGUAGES: Language[] = ["en", "nl", "zh"];

const META_BY_LANG: Record<Language, { title: string; description: string }> = {
  en: {
    title: "↑ ↓ ⇓ — The hidden pattern behind powers, roots, and logarithms",
    description:
      "An interactive article about an alternative notation for powers, roots, and logarithms using ↑, ↓ and ⇓.",
  },
  nl: {
    title: "↑ ↓ ⇓ — Het verborgen patroon achter machten, wortels en logaritmen",
    description:
      "Een interactief artikel over een alternatieve notatie voor machten, wortels en logaritmen met ↑, ↓ en ⇓.",
  },
  zh: {
    title: "↑ ↓ ⇓ — 幂、根和对数里藏着同一个模式",
    description:
      "一篇互动文章：用 ↑、↓、⇓ 这种写法，把幂、根和对数的同一关系看得更清楚。",
  },
};

type LangLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }
  const locale = lang as Language;
  const meta = META_BY_LANG[locale];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      locale: locale === "nl" ? "nl_NL" : locale === "zh" ? "zh_CN" : "en_GB",
      alternateLocale: ["en_GB", "nl_NL", "zh_CN"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }
  return children;
}
