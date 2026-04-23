import { notFound } from "next/navigation";
import { InteractiveBlogPage } from "@/components/blog/interactive-blog-page";
import type { Language } from "@/components/blog/types";

const SUPPORTED_LANGUAGES: Language[] = ["en", "nl", "zh"];

type LangPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function LangPage({ params }: LangPageProps) {
  const { lang } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }
  return <InteractiveBlogPage initialLanguage={lang as Language} />;
}
