export type Language = "en" | "nl" | "zh";

export type ArticlePage = "main" | "savings" | "piano" | "earthquakes" | "appendix" | "validation";

export type HeroContent = {
  title: string;
  byline: string;
  audience: string;
  time: string;
};

export type Block =
  | { type: "text"; content: string }
  | { type: "quote"; content: string }
  | { type: "heading"; content: string }
  | { type: "heading3"; content: string }
  | { type: "formula"; lines: string[]; label: string }
  | { type: "symbols" }
  | { type: "pair"; left: string; right: string; arrow: string }
  | { type: "levels"; rows: { op: string; desc: string; note: string }[] }
  | { type: "try"; expr: string }
  | { type: "proof"; steps: { n: number; label: string; detail: string; expr?: string }[] }
  | { type: "interestViz" }
  | { type: "pianoChainViz" }
  | { type: "pianoFreqViz" }
  | { type: "earthquakeViz" }
  | { type: "inverseRule" }
  | { type: "examplesIntro" }
  | { type: "collapsible"; title: string; blocks: Block[] }
  | { type: "challenge"; title: string; description: string; items: { expr: string; hint?: string }[] }
  | { type: "notationTransform" }
  | { type: "coreHighlight"; blocks: Block[] }
  | { type: "savingsExplorer" }
  | { type: "repeatedMultViz" }
  | { type: "pageLink"; page: "appendix" | "main" | "validation"; label: string };
