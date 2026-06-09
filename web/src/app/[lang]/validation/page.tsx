import { notFound } from "next/navigation";
import { InteractiveBlogPage } from "@/components/blog/interactive-blog-page";
import type { Language } from "@/components/blog/types";

const SUPPORTED_LANGUAGES: Language[] = ["en", "nl", "zh"];

type ValidationPageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function ValidationPage({ params }: ValidationPageProps) {
  const { lang } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }
  return <InteractiveBlogPage initialLanguage={lang as Language} page="validation" />;
}
