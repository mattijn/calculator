import { useEffect, useMemo, useState } from "react";
import type { Block, Language } from "./types";

const LANGUAGE_KEY = "interactive-language-v1";
const THEME_KEY = "interactive-theme-v1";

type Theme = "light" | "dark";

type HeroContent = {
  title: string;
  byline: string;
  audience: string;
  time: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function getInitialLanguage(): Language {
  return "en";
}

function getPreferredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  if (stored === "en" || stored === "nl" || stored === "zh") return stored;
  const browserLang = navigator.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("zh")) return "zh";
  return browserLang.startsWith("nl") ? "nl" : "en";
}

function getInitialTheme(): Theme {
  return "light";
}

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useInteractiveArticleModel({
  heroEn,
  heroNl,
  heroZh,
  enBlocks,
  nlBlocks,
  zhBlocks,
}: {
  heroEn: HeroContent;
  heroNl: HeroContent;
  heroZh: HeroContent;
  enBlocks: Block[];
  nlBlocks: Block[];
  zhBlocks: Block[];
}) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileCalc, setMobileCalc] = useState(false);
  const [fabPulsed, setFabPulsed] = useState(false);

  useEffect(() => {
    const preferredLanguage = getPreferredLanguage();
    const preferredTheme = getPreferredTheme();
    const syncPreferred = () => {
      setLanguage((current) => (current === preferredLanguage ? current : preferredLanguage));
      setTheme((current) => (current === preferredTheme ? current : preferredTheme));
    };
    const taskId = window.setTimeout(syncPreferred, 0);
    return () => window.clearTimeout(taskId);
  }, []);

  useEffect(() => {
    const onFirstScroll = () => {
      setFabPulsed(true);
      window.removeEventListener("scroll", onFirstScroll);
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => window.removeEventListener("scroll", onFirstScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const hero = useMemo(() => {
    if (language === "nl") return heroNl;
    if (language === "zh") return heroZh;
    return heroEn;
  }, [heroEn, heroNl, heroZh, language]);
  const blocks = useMemo(() => {
    if (language === "nl") return nlBlocks;
    if (language === "zh") return zhBlocks;
    return enBlocks;
  }, [enBlocks, nlBlocks, zhBlocks, language]);
  const toc = useMemo(
    () =>
      blocks
        .filter((b): b is Block & { type: "heading" } => b.type === "heading")
        .map((b) => ({ label: b.content, id: slugify(b.content) })),
    [blocks],
  );

  return {
    language,
    setLanguage,
    theme,
    setTheme,
    mobileCalc,
    setMobileCalc,
    fabPulsed,
    hero,
    blocks,
    toc,
  };
}
