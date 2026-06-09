import { slugify } from "@/lib/slugify";
import type { ArticlePage, Block, HeroContent, Language } from "./types";

export const EXAMPLE_SLUGS = ["savings", "piano", "earthquakes"] as const;
export type ExampleSlug = (typeof EXAMPLE_SLUGS)[number];

export function isExampleSlug(value: string): value is ExampleSlug {
  return (EXAMPLE_SLUGS as readonly string[]).includes(value);
}

export function isExamplePage(page: ArticlePage): page is ExampleSlug {
  return isExampleSlug(page);
}

export function getExamplesHubHeading(lang: Language): string {
  return lang === "en" ? "Four examples, one pattern" : lang === "zh" ? "四个例题，一个模式" : "Vier voorbeelden, een patroon";
}

export function getExamplesHubLink(lang: Language): { href: string; label: string } {
  return {
    href: `/${lang}#${slugify(getExamplesHubHeading(lang))}`,
    label:
      lang === "en"
        ? "← Back to where you left off in the article"
        : lang === "zh"
          ? "← 返回文章中刚才阅读的位置"
          : "← Terug naar waar je gebleven was in het artikel",
  };
}

type ContentBundle = {
  intro: Block[];
  savings: Block[];
  piano: Block[];
  earthquakes: Block[];
  mainClosing: Block[];
  appendix: Block[];
  validation: Block[];
  heroes: Record<ArticlePage, HeroContent>;
};

// Blocks are defined in interactive-blog-page.tsx and registered here at module init.
let bundles: Record<Language, ContentBundle> | null = null;

export function registerArticleContent(b: Record<Language, ContentBundle>) {
  bundles = b;
}

export function getArticleBlocks(lang: Language, page: ArticlePage): Block[] {
  if (!bundles) throw new Error("Article content not registered");
  const c = bundles[lang];
  switch (page) {
    case "main":
      return [...c.intro, ...c.mainClosing];
    case "savings":
      return c.savings;
    case "piano":
      return c.piano;
    case "earthquakes":
      return c.earthquakes;
    case "appendix":
      return c.appendix;
    case "validation":
      return c.validation;
  }
}

export function getArticleHero(lang: Language, page: ArticlePage): HeroContent {
  if (!bundles) throw new Error("Article content not registered");
  return bundles[lang].heroes[page];
}

export function getBackLink(lang: Language, page: ArticlePage): { href: string; label: string } | undefined {
  if (page === "main") return undefined;
  const home = `/${lang}`;
  if (page === "appendix" || page === "validation") {
    return {
      href: home,
      label: lang === "en" ? "← Back to article" : lang === "zh" ? "← 返回文章" : "← Terug naar artikel",
    };
  }
  return getExamplesHubLink(lang);
}
