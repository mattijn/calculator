import { notFound } from "next/navigation";
import { InteractiveBlogPage } from "@/components/blog/interactive-blog-page";
import { isExampleSlug } from "@/components/blog/article-content";
import type { ArticlePage, Language } from "@/components/blog/types";

const SUPPORTED_LANGUAGES: Language[] = ["en", "nl", "zh"];

type ExamplePageProps = {
  params: Promise<{ lang: string; example: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.flatMap((lang) =>
    (["savings", "piano", "earthquakes"] as const).map((example) => ({ lang, example })),
  );
}

export default async function ExamplePage({ params }: ExamplePageProps) {
  const { lang, example } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language) || !isExampleSlug(example)) {
    notFound();
  }
  return <InteractiveBlogPage initialLanguage={lang as Language} page={example as ArticlePage} />;
}
