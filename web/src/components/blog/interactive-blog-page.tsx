"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { InterestChart, RepeatedMultViz, PianoChainViz, PianoFreqViz, EarthquakeViz, SavingsExplorer } from "./visualizations";
import { useInteractiveArticleModel } from "./article-model";
import { evaluateTryExpression, useCalculatorModel } from "./calculator-model";
import type { Language, Block } from "./types";
import type { CalculatorViewModel } from "./calculator-model";

export type { Language, Block };

const LANGUAGE_CUE_KEY = "interactive-language-cue-seen-v1";
const LANGUAGE_CHOICE_KEY = "interactive-language-choice-made-v1";

/* ── Try-it widget ── */

function pronounce(expr: string, lang: Language): string {
  const en = lang === "en";
  const zh = lang === "zh";
  let out = expr;
  out = out.split("⇓").join(en ? " double\u2011down " : zh ? " 双下 " : " dubbel\u2011omlaag ");
  out = out.split("↑").join(en ? " up " : zh ? " 上 " : " omhoog ");
  out = out.split("↓").join(en ? " down " : zh ? " 下 " : " omlaag ");
  out = out.split("×").join(en ? " times " : zh ? " 乘以 " : " keer ");
  out = out.split("÷").join(en ? " divided by " : zh ? " 除以 " : " gedeeld door ");
  out = out.split("+").join(zh ? " 加 " : " plus ");
  out = out.split("-").join(en ? " minus " : zh ? " 减 " : " min ");
  return out.replace(/\s+/g, " ").trim();
}

function displayExpr(expr: string): string {
  return expr.replace(/([↑↓⇓×÷+\-])/g, " $1 ").replace(/\s+/g, " ").trim();
}

function Try({ expression, lang }: { expression: string; lang: Language }) {
  const [result, setResult] = useState<string | null>(null);
  const pron = pronounce(expression, lang);
  const display = displayExpr(expression);
  const run = () => {
    setResult(evaluateTryExpression(expression));
  };
  return (
    <span className="tryInline">
      <code>{mathFormat(display)}</code>
      <span className="tryPronounce">({pron})</span>
      <button className="tryBtn" onClick={run}>
        {lang === "en" ? "try it" : lang === "zh" ? "试试看" : "probeer"}
      </button>
      {result !== null && <strong className="tryResult">= {result}</strong>}
    </span>
  );
}

/* ── Full calculator ── */
function FullCalc({ lang, model }: { lang: Language; model: CalculatorViewModel }) {
  const { expr, result, error, setExpr, evaluate, append, backspace, clear } = model;
  return (
    <div className="fullCalc card">
      <h3>{lang === "en" ? "Calculator" : lang === "zh" ? "计算器" : "Calculator"}</h3>
      <p className="calcSubtitle muted">{lang === "en" ? "Scrolls along with you as you read" : lang === "zh" ? "阅读时会跟着滚动" : "Scrolt mee terwijl je leest"}</p>
      <div className="calcDisplayWrap">
        <input
          className="calcDisplay"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder={
            lang === "en" ? "Type or tap buttons..." : lang === "zh" ? "输入或点击按钮..." : "Typ of tik knoppen..."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") evaluate();
          }}
        />
        <p className={`calcResult${error ? " calcResultError" : ""}`}>
          {error || (result ? `= ${result}` : "\u00A0")}
        </p>
      </div>
      <div className="calcKeypad">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "="].map((d) => (
          <button
            key={d}
            className={`calcKey${d === "=" ? " calcKeyAccent" : ""}`}
            onClick={() => d === "=" ? evaluate() : append(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="calcActions">
        <button
          className="calcKey calcKeyAction"
          onClick={backspace}
        >
          {lang === "en" ? "Delete" : lang === "zh" ? "删除" : "Wis"}
        </button>
        <button
          className="calcKey calcKeyAction"
          onClick={clear}
        >
          AC
        </button>
      </div>
      <div className="calcOps">
        {["↑", "↓", "⇓"].map((o) => (
          <button key={o} className="calcKey calcKeySpecial" onClick={() => append(o)}>
            {o}
          </button>
        ))}
        {["+", "-", "×", "÷", "(", ")"].map((o) => (
          <button key={o} className="calcKey calcKeyOp" onClick={() => append(o)}>
            {o}
          </button>
        ))}
      </div>
      <div className="calcRuleCard">
        <code><span className="calcNum calcNumA">2</span> ↑ <span className="calcNum calcNumB">3</span> = <span className="calcNum calcNumC">8</span></code><span></span>
        <code><span className="calcNum calcNumA">2</span> = <span className="calcNum calcNumC">8</span> ↓ <span className="calcNum calcNumB">3</span></code><span className="calcRuleHint">{lang === "en" ? "left unknown? use down" : lang === "zh" ? "左边未知？用 ↓" : "links onbekend? gebruik omlaag"}</span>
        <code><span className="calcNum calcNumB">3</span> = <span className="calcNum calcNumC">8</span> ⇓ <span className="calcNum calcNumA">2</span></code><span className="calcRuleHint">{lang === "en" ? "right unknown? use double-down" : lang === "zh" ? "右边未知？用 ⇓" : "rechts onbekend? gebruik dubbel-omlaag"}</span>
      </div>
    </div>
  );
}

function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      const progress = scrollable > 0 ? Math.min(h.scrollTop / scrollable, 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={barRef} className="progressBar" />;
}

/* ── Block rendering helpers ── */

function linkify(text: string): React.ReactNode[] {
  const re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const result: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) result.push(text.slice(last, match.index));
    result.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) result.push(text.slice(last));
  return result.length ? result : [text];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

const ARROW_RE = /([↑↓⇓])/g;
function mathFormat(text: string): React.ReactNode[] {
  const parts = text.split(ARROW_RE);
  return parts.map((part, i) =>
    ARROW_RE.test(part)
      ? <span key={i} className="mathArrow">{part}</span>
      : part,
  );
}

function RevealBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    // Safari/WebView can occasionally skip observer callbacks; reveal anyway.
    const fallback = window.setTimeout(() => setVisible(true), 1200);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
  return (
    <div ref={ref} className={`reveal${visible ? " revealed" : ""}`}>
      {children}
    </div>
  );
}

function NotationTransform({ lang }: { lang: Language }) {
  const [showNew, setShowNew] = useState(false);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !autoTriggered) {
          setAutoTriggered(true);
          setTimeout(() => setShowNew(true), 600);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoTriggered]);

  const rows = [
    { school: "2³ = 8", arrow: "2 ↑ 3 = 8" },
    { school: "³√8 = 2", arrow: "8 ↓ 3 = 2" },
    { school: "log₂(8) = 3", arrow: "8 ⇓ 2 = 3" },
  ];
  return (
    <div className="transformCard card" ref={ref}>
      <div className="transformRows">
        {rows.map((r, i) => (
          <div key={i} className="transformRow" style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="transformFlip">
              <code className={`transformFormula transformFront${showNew ? " transformHidden" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}>
                {r.school}
              </code>
              <code className={`transformFormula transformBack${showNew ? "" : " transformHidden"}`}
                style={{ transitionDelay: `${i * 120 + 150}ms` }}>
                {mathFormat(r.arrow)}
              </code>
            </div>
          </div>
        ))}
      </div>
      <button className="transformBtn" onClick={() => setShowNew((s) => !s)}>
        {showNew
          ? (lang === "en" ? "← School notation" : lang === "zh" ? "← 学校写法" : "← Schoolnotatie")
          : (lang === "en" ? "Transform →" : lang === "zh" ? "转换 →" : "Transformeer →")}
      </button>
    </div>
  );
}

function RenderBlock({ block, lang }: { block: Block; lang: Language }) {
  switch (block.type) {
    case "heading":
      return <h2 className="storyH2" id={slugify(block.content)}>{block.content}</h2>;
    case "heading3":
      return <h3 className="storyH3">{block.content}</h3>;
    case "quote":
      return <blockquote className="storyQuote">{block.content}</blockquote>;
    case "text":
      return (
        <>
          {block.content.split("\n").map((line, i) => (
            <p className="storyP" key={i}>
              {linkify(line)}
            </p>
          ))}
        </>
      );
    case "formula":
      return (
        <figure className="formulaFig">
          {block.lines.map((l, i) => (
            <code key={i} className="formulaLine">
              {mathFormat(l)}
            </code>
          ))}
          <figcaption className="muted">{block.label}</figcaption>
        </figure>
      );
    case "pair":
      return (
        <div className="pairBlock">
          <div className="pairRow">
            <code>{mathFormat(block.left)}</code>
            <span className="pairArrowText">→</span>
            <code>{mathFormat(block.right)}</code>
          </div>
          <p className="pairCaption muted">{block.arrow}</p>
        </div>
      );
    case "levels":
      return (
        <table className="levelsTable">
          <tbody>
            {block.rows.map((r, i) => {
              const hasPass = r.note.includes("✓");
              const hasFail = r.note.includes("✗");
              const noteText = r.note.replace(/[✓✗]/g, "").trim();
              const status = hasPass ? "✓" : hasFail ? "✗" : "";
              return (
              <tr key={`${r.op}-${i}`}>
                <td className="levelsOp">
                  <code>{mathFormat(r.op)}</code>
                </td>
                <td>{r.desc}</td>
                <td className="levelsCheck">
                  {status && (
                    <span className={`levelsCheckBadge ${hasPass ? "levelsCheckPass" : "levelsCheckFail"}`}>
                      {status}
                    </span>
                  )}
                </td>
                <td className="levelsNote">{noteText}</td>
              </tr>
            )})}
          </tbody>
        </table>
      );
    case "symbols":
      return (
        <div className="symbolFamily">
          <div className="symbolCard">
            <span className="symbolGlyph"><span className="mathArrow">↑</span></span>
            <span className="symbolName">{lang === "en" ? "power (up)" : lang === "zh" ? "幂（上）" : "macht (omhoog)"}</span>
            <span className="symbolEx muted">{mathFormat("2 ↑ 3 = 8")}</span>
          </div>
          <div className="symbolCard">
            <span className="symbolGlyph"><span className="mathArrow">↓</span></span>
            <span className="symbolName">{lang === "en" ? "root (down)" : lang === "zh" ? "根（下）" : "wortel (omlaag)"}</span>
            <span className="symbolEx muted">{mathFormat("8 ↓ 3 = 2")}</span>
          </div>
          <div className="symbolCard">
            <span className="symbolGlyph"><span className="mathArrow">⇓</span></span>
            <span className="symbolName">{lang === "en" ? "log (double down)" : lang === "zh" ? "对数（双下）" : "log (dubbel omlaag)"}</span>
            <span className="symbolEx muted">{mathFormat("8 ⇓ 2 = 3")}</span>
          </div>
        </div>
      );
    case "try":
      return (
        <div className="tryBlock">
          <Try expression={block.expr} lang={lang} />
        </div>
      );
    case "proof":
      return (
        <div className="proofBlock card">
          {block.steps.map((s) => (
            <div key={s.n} className="proofRow">
              <span className="proofIndex">{s.n}</span>
              <div className="proofContent">
                <p className="proofLabel">{s.label}</p>
                <code>{s.detail}</code>
              </div>
              {s.expr && <Try expression={s.expr} lang={lang} />}
            </div>
          ))}
        </div>
      );
    case "interestViz":
      return <InterestChart lang={lang} />;
    case "savingsExplorer":
      return <SavingsExplorer key={`savings-${lang}`} lang={lang} />;
    case "repeatedMultViz":
      return <RepeatedMultViz lang={lang} />;
    case "pianoChainViz":
      return <PianoChainViz lang={lang} />;
    case "pianoFreqViz":
      return <PianoFreqViz lang={lang} />;
    case "earthquakeViz":
      return <EarthquakeViz lang={lang} />;
    case "notationTransform":
      return <NotationTransform lang={lang} />;
    case "inverseRule":
      return (
        <div className="inverseRuleCard card">
          <table className="inverseRuleTable">
            <tbody>
              <tr className="inverseRuleHeaderRow">
                <td className="inverseRuleFormula"><code><span className="inverseVar inverseVarA">a</span> <span className="symbolHighlight">↑</span> <span className="inverseVar inverseVarB">b</span> = <span className="inverseVar inverseVarC">c</span></code></td>
                <td></td>
                <td className="inverseRuleArrow"></td>
                <td></td>
              </tr>
              <tr className="inverseRuleRow">
                <td className="inverseRuleFormula"><code><strong className="inverseVar inverseVarA">?</strong> <span className="symbolHighlight">↑</span> <span className="inverseVar inverseVarB">b</span> = <span className="inverseVar inverseVarC">c</span></code></td>
                <td className="inverseRuleHint">{lang === "en" ? <><em>Left missing?</em><br/>Use ↓ (down)</> : lang === "zh" ? <><em>左边缺少？</em><br/>用 ↓（下）</> : <><em>Links kwijt?</em><br/>Gebruik ↓ (omlaag)</>}</td>
                <td className="inverseRuleArrow">→</td>
                <td className="inverseRuleFormula"><code><strong className="inverseVar inverseVarA">?</strong> = <span className="inverseVar inverseVarC">c</span> <span className="symbolHighlight">↓</span> <span className="inverseVar inverseVarB">b</span></code></td>
              </tr>
              <tr className="inverseRuleRow">
                <td className="inverseRuleFormula"><code><span className="inverseVar inverseVarA">a</span> <span className="symbolHighlight">↑</span> <strong className="inverseVar inverseVarB">?</strong> = <span className="inverseVar inverseVarC">c</span></code></td>
                <td className="inverseRuleHint">{lang === "en" ? <><em>Right missing?</em><br/>Use ⇓ (double-down)</> : lang === "zh" ? <><em>右边缺少？</em><br/>用 ⇓（双下）</> : <><em>Rechts kwijt?</em><br/>Gebruik ⇓ (dubbel-omlaag)</>}</td>
                <td className="inverseRuleArrow">→</td>
                <td className="inverseRuleFormula"><code><strong className="inverseVar inverseVarB">?</strong> = <span className="inverseVar inverseVarC">c</span> <span className="symbolHighlight">⇓</span> <span className="inverseVar inverseVarA">a</span></code></td>
              </tr>
            </tbody>
          </table>
          <p className="inverseRuleExample muted">
            {lang === "en"
              ? <>Example: <span className="inverseVar inverseVarA">2</span> ↑ <span className="inverseVar inverseVarB">3</span> = <span className="inverseVar inverseVarC">8</span>. Missing the <span className="inverseVar inverseVarA">2</span>? → <span className="inverseVar inverseVarC">8</span> ↓ <span className="inverseVar inverseVarB">3</span> = <span className="inverseVar inverseVarA">2</span>. Missing the <span className="inverseVar inverseVarB">3</span>? → <span className="inverseVar inverseVarC">8</span> ⇓ <span className="inverseVar inverseVarA">2</span> = <span className="inverseVar inverseVarB">3</span>.</>
              : lang === "zh"
                ? <>例子：<span className="inverseVar inverseVarA">2</span> ↑ <span className="inverseVar inverseVarB">3</span> = <span className="inverseVar inverseVarC">8</span>。缺左边的 <span className="inverseVar inverseVarA">2</span>？→ <span className="inverseVar inverseVarC">8</span> ↓ <span className="inverseVar inverseVarB">3</span> = <span className="inverseVar inverseVarA">2</span>。缺右边的 <span className="inverseVar inverseVarB">3</span>？→ <span className="inverseVar inverseVarC">8</span> ⇓ <span className="inverseVar inverseVarA">2</span> = <span className="inverseVar inverseVarB">3</span>。</>
                : <>Voorbeeld: <span className="inverseVar inverseVarA">2</span> ↑ <span className="inverseVar inverseVarB">3</span> = <span className="inverseVar inverseVarC">8</span>. Mis je de <span className="inverseVar inverseVarA">2</span>? → <span className="inverseVar inverseVarC">8</span> ↓ <span className="inverseVar inverseVarB">3</span> = <span className="inverseVar inverseVarA">2</span>. Mis je de <span className="inverseVar inverseVarB">3</span>? → <span className="inverseVar inverseVarC">8</span> ⇓ <span className="inverseVar inverseVarA">2</span> = <span className="inverseVar inverseVarB">3</span>.</>}
          </p>
        </div>
      );
    case "examplesIntro": {
      const en = lang === "en";
      const zh = lang === "zh";
      const examples = [
        {
          href: `#${slugify(en ? "Saving money" : zh ? "存钱" : "Sparen")}`,
          label: en ? "Saving money" : zh ? "存钱" : "Sparen",
          ops: "÷  ↓  ⇓",
          icon: (
            <svg className="examplePreviewIcon" viewBox="0 0 40 40" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6v28M12 14l8-8 8 8" />
              <rect x="8" y="24" width="24" height="10" rx="2" fill="var(--accent-light)" />
              <line x1="14" y1="27" x2="14" y2="31" /><line x1="20" y1="27" x2="20" y2="31" /><line x1="26" y1="27" x2="26" y2="31" />
            </svg>
          ),
        },
        {
          href: `#${slugify(en ? "What does a piano sound like?" : zh ? "钢琴怎么调音？" : "Hoe klinkt een piano?")}`,
          label: en ? "Piano tuning" : zh ? "钢琴调音" : "Pianostemming",
          ops: "↓",
          icon: (
            <svg className="examplePreviewIcon" viewBox="0 0 40 40" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="12" width="5" height="22" rx="1" fill="var(--accent)" opacity="0.15" />
              <rect x="10" y="16" width="4" height="18" rx="1" fill="var(--foreground)" opacity="0.7" />
              <rect x="15" y="14" width="5" height="20" rx="1" fill="var(--accent)" opacity="0.25" />
              <rect x="21" y="10" width="4" height="24" rx="1" fill="var(--foreground)" opacity="0.7" />
              <rect x="26" y="12" width="5" height="22" rx="1" fill="var(--accent)" opacity="0.4" />
              <rect x="32" y="8" width="4" height="26" rx="1" fill="var(--foreground)" opacity="0.7" />
              <path d="M6 8c6 0 10 2 14 2s8-3 14-3" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            </svg>
          ),
        },
        {
          href: `#${slugify(en ? "Earthquakes and the Richter scale" : zh ? "地震与里氏震级" : "Aardbevingen en de Richterschaal")}`,
          label: en ? "Earthquakes" : zh ? "地震" : "Aardbevingen",
          ops: "↑  ⇓",
          icon: (
            <svg className="examplePreviewIcon" viewBox="0 0 40 40" fill="none" strokeLinecap="round">
              <path d="M4 30 Q10 28 14 30 Q18 32 22 30 Q26 28 30 30 Q34 32 38 30" stroke="var(--accent)" strokeWidth="2" />
              <path d="M8 26 Q12 24 16 26 Q20 28 24 26 Q28 24 32 26" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5" />
              <path d="M12 22 Q16 20 20 22 Q24 24 28 22" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
              <circle cx="20" cy="18" r="3" fill="var(--accent)" opacity="0.2" />
              <circle cx="20" cy="18" r="1" fill="var(--accent)" />
            </svg>
          ),
        },
      ];
      return (
        <div className="examplesIntroGrid">
          {examples.map((ex) => (
            <a key={ex.href} href={ex.href} className="examplePreviewCard card">
              {ex.icon}
              <span className="examplePreviewLabel">{ex.label}</span>
              <span className="examplePreviewOps">{mathFormat(ex.ops)}</span>
            </a>
          ))}
        </div>
      );
    }
    case "collapsible":
      return (
        <details className="collapsibleBlock card">
          <summary className="collapsibleSummary">{block.title}</summary>
          <div className="collapsibleContent">
            {block.blocks.map((b, i) => (
              <RenderBlock key={i} block={b} lang={lang} />
            ))}
            <button
              className="collapsibleClose"
              onClick={(e) => {
                const details = (e.target as HTMLElement).closest("details");
                if (details) details.open = false;
                details?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {lang === "en" ? "▲ Close appendix" : lang === "zh" ? "▲ 关闭附录" : "▲ Bijlage sluiten"}
            </button>
          </div>
        </details>
      );
    case "challenge":
      return (
        <div className="challengeCard card">
          <h4 className="challengeTitle">{block.title}</h4>
          <p className="challengeDesc">{block.description}</p>
          <div className="challengeItems">
            {block.items.map((item) => (
              <div key={item.expr} className="challengeRow">
                <Try expression={item.expr} lang={lang} />
                {item.hint && (
                  <span className="challengeHint muted">{item.hint}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
  }
}

/* ══════════════════════════════════════════════════════ */
/* ── English content                                 ── */
/* ══════════════════════════════════════════════════════ */

const en: Block[] = [
  { type: "text", content: "A researcher in Amsterdam was checking his son's maths homework. The assignment covered powers, roots, and logarithms. He looked at the formulas and thought:" },
  { type: "quote", content: "\"Why do they make something so simple so difficult?\"" },
  { type: "text", content: "That question turned into a [book](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf). This interactive article is based on it. We are going to show you a pattern that is already in your head — you just haven't noticed it yet — and then show how a small change in notation makes that pattern visible." },

  // ── Pattern ──
  { type: "heading", content: "A pattern you already know" },
  { type: "text", content: "Let's start with something simple. Addition and subtraction belong together:" },
  { type: "pair", left: "3 + 5 = 8", right: "8 − 5 = 3", arrow: "Subtraction helps you go back to the other number." },
  { type: "text", content: "Look: 3 + 5 = 8. If you know 8 and 5, then 8 − 5 gives you 3." },
  { type: "text", content: "Candy example: you had 3 candies and you get 5 more, so 3 + 5 = 8. Then you give 5 candies away: 8 − 5 = 3." },
  { type: "text", content: "This pattern is important in maths. You can also see it in the signs: + and − belong together." },

  { type: "text", content: "Now go one level up. Multiplication and division are partners in exactly the same way:" },
  { type: "pair", left: "3 × 4 = 12", right: "12 ÷ 4 = 3", arrow: "Division is the inverse of multiplication." },
  { type: "text", content: "Again: if you know the result (12) and one input (4), the inverse (division) gets the other input back. And the symbols × and ÷ look like relatives — both based on a cross-shape." },

  { type: "text", content: "So we have a nice pattern:" },
  { type: "levels", rows: [
    { op: "+  −", desc: "Addition ↔ Subtraction", note: "Symbols look related ✓" },
    { op: "×  ÷", desc: "Multiplication ↔ Division", note: "Symbols look related ✓" },
  ] },
  { type: "text", content: "Each level has an operation and its inverse, and you can tell they belong together because they look alike." },

  // ── Breaking ──
  { type: "heading", content: "Where school notation breaks the pattern" },
  { type: "text", content: "There is a third level. Multiplication is repeated addition (3 × 4 = 3 + 3 + 3 + 3). In the same way, there is an operation that means \"repeated multiplication\":" },
  { type: "pair", left: "2 × 2 × 2 = 8", right: "written as 2³ = 8", arrow: "This is \"taking a power.\" The small 3 means \"multiply 2 by itself 3 times.\"" },
  { type: "text", content: "So far so good. Now: what is the inverse? If you know the answer is 8 and the exponent is 3, how do you get the base (2) back? In school, this is written with a radical sign:" },
  { type: "formula", lines: ["³√8 = 2"], label: "Read: \"the cube root of 8 is 2.\"" },
  { type: "text", content: "And what if you know the answer is 8 and the base is 2, and you want to find the exponent (3)? That is called a logarithm:" },
  { type: "formula", lines: ["log₂(8) = 3"], label: "Read: \"the base-2 logarithm of 8 is 3.\"" },
  { type: "text", content: "Now put all three notations below each other:" },
  { type: "formula", lines: ["2³ = 8", "³√8 = 2", "log₂(8) = 3"], label: "Three ways to write the same relationship: the power, the root, and the log." },
  { type: "text", content: "Do these three look related to you? Do they look like they belong to the same family?" },
  { type: "text", content: "They don't. The first uses a tiny superscript. The second uses a √ sign with a little number in the crook. The third spells out the word \"log\" and puts the base as a subscript. Three completely different visual systems for three operations that are supposed to be inverses of each other." },
  { type: "text", content: "This is the problem: the maths still follows the same pattern, but these three very different symbols make that pattern much harder to see." },

  // ── Fix ──
  { type: "heading", content: "What if we fix it?" },
  { type: "text", content: "The fix is surprisingly simple. Instead of three different visual systems, use three symbols that look like variations of each other:" },
  { type: "symbols" },
  { type: "text", content: "Now let's rewrite that same relationship. Click the button to see the transformation:" },
  { type: "notationTransform" },
  { type: "text", content: "Read them out loud: \"2 up 3 is 8\", \"8 down 3 is 2\", \"8 double-down 2 is 3.\" The symbols go up, down, double-down — a family you can see." },
  { type: "text", content: "And the table now has a pattern on every level:" },
  { type: "levels", rows: [
    { op: "+  −", desc: "Addition ↔ Subtraction", note: "Symbols look related ✓" },
    { op: "×  ÷", desc: "Multiplication ↔ Division", note: "Symbols look related ✓" },
    { op: "↑  ↓  ⇓", desc: "Power ↔ Root ↔ Log", note: "Symbols look related ✓" },
  ] },
  { type: "text", content: "Three levels. Same structure everywhere: the inverse undoes the operation, and the symbols tell you they belong together. That's the whole idea." },

  { type: "heading3", content: "But wait — why two inverses?" },
  { type: "text", content: "At the first two levels, you only need one inverse: − for +, ÷ for ×. That's because order doesn't matter there: 3 + 5 = 5 + 3 and 3 × 4 = 4 × 3." },
  { type: "text", content: "But for powers, order matters: 2 ↑ 3 = 8, while 3 ↑ 2 = 9. So there are two numbers that can go missing — the one left of ↑ and the one right of ↑ — and you need a different inverse for each:" },
  { type: "inverseRule" },
  { type: "text", content: "That's the only rule you need. Missing the left number? Use ↓. Missing the right number? Use ⇓." },

  { type: "heading3", content: "The power of inverses: they cancel each other" },
  { type: "text", content: "There's something beautiful that follows from this. You already know that + and − cancel each other:" },
  { type: "formula", lines: ["(5 + 3) − 3 = 5"], label: "Add 3, then subtract 3 — you're back where you started." },
  { type: "text", content: "And × and ÷ cancel each other:" },
  { type: "formula", lines: ["(5 × 3) ÷ 3 = 5"], label: "Multiply by 3, then divide by 3 — back to the start." },
  { type: "text", content: "With the new notation, exactly the same works for ↑ and ↓:" },
  { type: "formula", lines: ["(5 ↑ 3) ↓ 3 = 5"], label: "Raise to the power 3, then take the 3rd root — back to the start." },
  { type: "try", expr: "(5↑3)↓3" },
  { type: "text", content: "And for ↑ and ⇓:" },
  { type: "formula", lines: ["(5 ↑ 3) ⇓ 5 = 3"], label: "Raise 5 to a power, then log base 5 — you get the exponent back." },
  { type: "try", expr: "(5↑3)⇓5" },
  { type: "text", content: "In school notation, that first cancellation would be written as ³√(5³) = 5, and the second as log₅(5³) = 3. But look at them: can you see that ³√ and ³ cancel? Or that log₅ and 5³ cancel? Not really — they look completely different. With ↓ and ↑, the cancellation is visible: they're the same symbol pointing in opposite directions. And ⇓ and ↑ work the same way. That's the whole point of the notation: it doesn't just label the operations — it shows you how they relate." },

  // ── Examples intro ──
  { type: "heading", content: "Three problems, one pattern" },
  { type: "text", content: "Theory is one thing. Let's see if it holds up in the real world — with three problems from three completely different worlds: finance, music, and geology. In school, each of these would require a different technique. With our notation, they all follow the same pattern: set up an equation with ↑, figure out which number is missing, and pick the matching inverse (↓ or ⇓)." },
  { type: "examplesIntro" },

  // ── Interest ──
  { type: "heading", content: "Saving money" },
  { type: "text", content: "Imagine you put $100 in a savings account. The bank pays 3% interest per year. What happens?" },

  { type: "heading3", content: "Building the formula step by step" },
  { type: "text", content: "After one year, the bank adds 3% to your money. That means you keep what you had (100%) and get 3% extra, so you now have 103% of your money:" },
  { type: "formula", lines: ["100 + 3% of 100 = 103"], label: "But there is a shortcut: adding 3% is the same as multiplying by 1.03." },
  { type: "formula", lines: ["100 × 1.03 = 103"], label: "Where does the 1.03 come from? It is 1 + 3/100 = 1 + 0.03 = 1.03." },
  { type: "text", content: "After the second year, you get 3% interest again — but this time on $103, the amount that already includes last year's interest:" },
  { type: "formula", lines: ["103 × 1.03 = 106.09"], label: "" },
  { type: "text", content: "But 103 was itself 100 × 1.03. So we can write the whole chain:" },
  { type: "formula", lines: ["100 × 1.03 × 1.03 = 100 × 1.03 ↑ 2 = 106.09"], label: "Repeated multiplication is a power. Two years means ↑ 2." },
  { type: "text", content: "See the pattern? After three years: 100 × 1.03 ↑ 3. After ten years: 100 × 1.03 ↑ 10. In general:" },
  { type: "formula", lines: ["After n years:  m × r ↑ n"], label: "m = starting amount, r = 1 + interest rate (1.03 for 3%), n = number of years." },
  { type: "text", content: "One formula. Three letters. Let's see what we can do with it." },
  { type: "interestViz" },

  { type: "heading3", content: "Question 1: How much money do I need to put in the bank now, to have $1000 after 10 years at 3% interest?" },
  { type: "text", content: "Our formula says: after n years, your money is m × r ↑ n. We know the interest rate (r = 1.03), the time (n = 10), and we know we want to end up with 1000. So:" },
  { type: "formula", lines: ["m × 1.03 ↑ 10 = 1000"], label: "We want m, but it's trapped in a multiplication." },
  { type: "text", content: "The m is multiplied by 1.03 ↑ 10. To get m alone, we apply the inverse of multiplication — which is division:" },
  { type: "formula", lines: ["m = 1000 ÷ 1.03 ↑ 10"], label: "" },
  { type: "try", expr: "1000÷1.03↑10" },
  { type: "text", content: "About $744. If you put $744 in the bank today at 3% interest, in 10 years it will have grown to $1000." },

  { type: "heading3", content: "Question 2: What interest rate do I need to double my money in 10 years?" },
  { type: "text", content: "Doubling means going from m to 2 × m. Our formula says m × r ↑ 10 = 2 × m. The m appears on both sides, so it cancels out. We are left with:" },
  { type: "formula", lines: ["r ↑ 10 = 2"], label: "We want r (the left side of ↑)." },
  { type: "text", content: "Compare with the rule card: this has the shape a ↑ b = c, and r is in the position of a — the left side. Left side unknown → use ↓:" },
  { type: "formula", lines: ["r = 2 ↓ 10"], label: "" },
  { type: "try", expr: "2↓10" },
  { type: "text", content: "About 1.072 — meaning an interest rate of about 7.2%. In school notation, this would be written as ¹⁰√2. Same answer, but you can't see where the root came from or why." },

  { type: "heading3", content: "Question 3: How many years does it take for my money to double at 3% interest?" },
  { type: "text", content: "Again: m × 1.03 ↑ y = 2 × m. The m's cancel:" },
  { type: "formula", lines: ["1.03 ↑ y = 2"], label: "We want y (the right side of ↑)." },
  { type: "text", content: "Compare with the rule card: a ↑ b = c, and y is in the position of b — the right side. Right side unknown → use ⇓:" },
  { type: "formula", lines: ["y = 2 ⇓ 1.03"], label: "" },
  { type: "try", expr: "2⇓1.03" },
  { type: "text", content: "About 23.4 years. In school, this would be log(2) / log(1.03) — correct, but it doesn't show you why. The ⇓ tells you: it's the inverse that recovers the right side of ↑." },

  { type: "text", content: "Three questions. In the old system, each one feels like a different trick: \"move the exponent down\", \"use a root sign\", \"use log and divide.\" In the new notation, every answer is the same move: check the rule card, pick the right inverse (↓ or ⇓), apply it. Done." },

  { type: "text", content: "Try it yourself — click m, r, or n to choose what you want to find, and slide the others to see the answer change live:" },
  { type: "savingsExplorer" },

  // ── Piano ──
  { type: "heading", content: "What does a piano sound like?" },
  { type: "text", content: "Play a C on the piano. That note vibrates 262 times per second (262 Hz)." },
  { type: "text", content: "Now play the C one octave higher. That note vibrates exactly twice as fast: 524 Hz." },
  { type: "text", content: "Between those two C's there are 12 keys. Here's the clever part: the piano is tuned so that each key is the same percentage higher in pitch than the one before. Not the same amount higher — the same factor." },
  { type: "text", content: "Let's call that unknown factor r. You start at 262 Hz and multiply by r for each key:" },
  { type: "pianoChainViz" },
  { type: "text", content: "After 12 keys you arrive at 524 Hz, which is exactly 2 × 262. So those twelve multiplications by r together multiply by 2:" },
  { type: "repeatedMultViz" },
  { type: "text", content: "Repeated multiplication by the same number — that's a power:" },
  { type: "formula", lines: ["r ↑ 12 = 2"], label: "" },
  { type: "text", content: "Look at this formula: it has the shape a ↑ b = c, where r is in the position of a — the left side of ↑. From the rule card: left side unknown → use ↓." },
  { type: "formula", lines: ["r = 2 ↓ 12"], label: "" },
  { type: "try", expr: "2↓12" },
  { type: "text", content: "About 1.0595. Each piano key is roughly 6% higher in pitch than the previous one. Here's what that looks like in practice:" },
  { type: "pianoFreqViz" },
  { type: "text", content: "In school, this answer would be written as ¹²√2. Same number — but good luck seeing where it came from. With the notation, the equation r ↑ 12 = 2 directly mirrors what the piano does, and ↓ gets you the answer in one step." },

  // ── Earthquakes ──
  { type: "heading", content: "Earthquakes and the Richter scale" },
  { type: "text", content: "You've probably heard of the Richter scale on the news. A magnitude 3 earthquake you barely feel, a magnitude 7 can destroy a city. But the difference between 3 and 7 isn't \"a bit more\" — it's enormous." },
  { type: "text", content: "Scientists designed the Richter scale so that each step of 1 magnitude means exactly 10 ↑ 1.5 times more energy:" },
  { type: "formula", lines: ["10 ↑ 1.5 = 31.623"], label: "Each +1 on the scale = about 31.6 times more energy." },
  { type: "try", expr: "10↑1.5" },
  { type: "text", content: "So from magnitude 5 to magnitude 6: 31.6× more energy. From 5 to 7? That's two steps: 31.6 × 31.6 = about 1000× more energy. The numbers on the scale look small, but the energy behind them is huge." },

  { type: "heading3", content: "How much magnitude for double energy?" },
  { type: "text", content: "If a full step (+1 magnitude) means 10 ↑ 1.5 more energy, then a half step (+0.5) means:" },
  { type: "formula", lines: ["10 ↑ (1.5 × 0.5) = 10 ↑ 0.75"], label: "A half step means 1.5 × 0.5 = 0.75 as the exponent." },
  { type: "try", expr: "10↑0.75" },
  { type: "text", content: "About 5.6× more energy. In general, a step of Δ magnitude means:" },
  { type: "formula", lines: ["energy ratio = 10 ↑ (1.5 × Δ)"], label: "Δ is how much the magnitude increases." },
  { type: "text", content: "Now the question: for which Δ does the energy exactly double? We fill in 2:" },
  { type: "formula", lines: ["10 ↑ (1.5 × Δ) = 2"], label: "We're looking for Δ." },
  { type: "text", content: "This has the shape a ↑ b = c, where 1.5 × Δ is in the position of b — the right side of ↑. From the rule card: right side unknown → use ⇓." },
  { type: "formula", lines: ["1.5 × Δ = 2 ⇓ 10"], label: "" },
  { type: "try", expr: "2⇓10" },
  { type: "text", content: "That gives about 0.301. But that's 1.5 × Δ, not Δ itself. To get Δ alone, divide by 1.5:" },
  { type: "formula", lines: ["Δ = 2 ⇓ 10 ÷ 1.5"], label: "" },
  { type: "try", expr: "2⇓10÷1.5" },
  { type: "text", content: "About 0.2. That means a magnitude 7.2 earthquake releases roughly twice the energy of a 7.0. Let's see what that looks like:" },
  { type: "earthquakeViz" },
  { type: "text", content: "Each tiny 0.2 step doubles the energy. From 5.0 to 6.0 is just one number on the scale, but it means 32 times more energy. The Richter scale is hiding a power relationship — and the ⇓ symbol is what lets you see into it." },

  // ── Your turn ──
  { type: "heading", content: "Your turn" },
  { type: "text", content: "The calculator on this page supports ↑, ↓, and ⇓. Here are some things to explore:" },
  { type: "challenge", title: "The triangle of inverses", description: "These three expressions all describe the same relationship: 2¹⁰ = 1024. Verify each one.", items: [
    { expr: "2↑10", hint: "= 1024 (the power)" },
    { expr: "1024↓10", hint: "= 2 (the root — gets the base back)" },
    { expr: "1024⇓2", hint: "= 10 (the log — gets the exponent back)" },
  ] },
  { type: "challenge", title: "Half power = square root", description: "A power of 0.5 is the same as a square root. These two should give the same answer:", items: [
    { expr: "2↑0.5", hint: "power with exponent ½" },
    { expr: "2↓2", hint: "square root of 2" },
  ] },
  { type: "challenge", title: "Radioactive decay", description: "Some materials slowly fall apart. Carbon-14 is one of them: every 5730 years, half of it is gone. You start with 100%. After halving once, you have 0.5 (= 50%) left. After halving twice: 0.5 × 0.5 = 0.5 ↑ 2 = 0.25 (= 25%). After n halvings you have 0.5 ↑ n left. The question: after how many halvings is only 1% (= 0.01) left? You're looking for n in 0.5 ↑ n = 0.01. The number right of ↑ is missing — so use ⇓:", items: [
    { expr: "0.01⇓0.5", hint: "≈ 6.6 halvings, or about 38,000 years" },
  ] },

  // ── Origin ──
  { type: "heading", content: "Where this comes from" },
  { type: "text", content: "This notation was developed by Steven Pemberton, a computer scientist at CWI Amsterdam. In his book \"Numbers,\" he starts from the very beginning — counting with sticks — and builds up through addition, multiplication, and powers, showing that each level follows the same pattern. The notation isn't arbitrary: it was designed to make that pattern visible." },
  { type: "text", content: "If this notation made something click for you — or if you want to share it with a student or teacher — the full book by Steven Pemberton is [available as a PDF](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf)." },

  // ── Proof (appendix) ──
  { type: "collapsible", title: "Appendix: A proof that becomes simple", blocks: [
    { type: "text", content: "Note — This section is for maths teachers and maths enthusiasts. Share it with them — this notation often surprises even experienced maths teachers, and the proof tends to spark a good discussion." },
    { type: "text", content: "Wikipedia has a page about [nested radicals](https://en.wikipedia.org/wiki/Nested_radical) — expressions where a square root contains another square root. That page is full of advanced maths — but we're only looking at one small corner of it, and we'll keep it simple." },
    { type: "formula", lines: ["√(3 + 2√2) = 1 + √2"], label: "Wikipedia says: \"It is not immediately obvious\" that these two are equal." },
    { type: "text", content: "In school notation, proving this requires you to know special rules about roots. But with our notation, it's just a puzzle. Let's solve it — you only need one thing you probably already know:" },
    { type: "formula", lines: ["(a + b) ↑ 2 = a ↑ 2 + 2 × a × b + b ↑ 2"], label: "The \"square of a sum\" rule, which works in any notation." },

    { type: "heading3", content: "Translating to our notation" },
    { type: "text", content: "We write the square root as ↓2. Let's translate both sides, piece by piece." },
    { type: "text", content: "The right side is easy. It says: 1 + √2. The only thing to translate is √2, the square root of 2:" },
    { type: "formula", lines: ["√2  →  2 ↓ 2"], label: "Read: \"2 down 2\". The first number (2) is what you're taking the root of. The second number (2) says it's a square root." },
    { type: "text", content: "So the right side becomes: 1 + 2 ↓ 2." },
    { type: "text", content: "Now the left side. It says: √(3 + 2√2). That's a root of something, and that \"something\" itself contains another root. We work from the inside out:" },
    { type: "formula", lines: [
      "Inner √2               →  2 ↓ 2",
      "2 × √2                 →  2 × (2 ↓ 2)",
      "3 + 2 × √2             →  3 + 2 × (2 ↓ 2)",
      "√(3 + 2 × √2)          →  (3 + 2 × (2 ↓ 2)) ↓ 2",
    ], label: "The outer √ becomes ↓2 at the very end — it takes the root of everything inside." },
    { type: "formula", lines: [
      "Left side:   (3 + 2 × (2 ↓ 2)) ↓ 2",
      "Right side:  1 + 2 ↓ 2",
    ], label: "This is what we want to show: left side = right side." },

    { type: "heading3", content: "The plan" },
    { type: "text", content: "Look at the left side: it says (something) ↓ 2. That means: \"the square root of what's inside.\" The \"something\" inside is 3 + 2 × (2 ↓ 2)." },
    { type: "text", content: "If we square the right side (↑ 2), and end up with exactly 3 + 2 × (2 ↓ 2), then we know the left side equals the right side. Why? Because ↑ 2 and ↓ 2 are inverses — they cancel each other." },

    { type: "heading3", content: "Step by step" },
    { type: "text", content: "Let's square the right side:" },
    { type: "formula", lines: ["(1 + 2 ↓ 2) ↑ 2"], label: "We use the \"square of a sum\" rule with a = 1 and b = 2 ↓ 2." },
    { type: "try", expr: "(1+2↓2)↑2" },
    { type: "text", content: "Expanding with the rule gives us three pieces:" },
    { type: "formula", lines: ["1 ↑ 2 + 2 × (2 ↓ 2) + (2 ↓ 2) ↑ 2"], label: "a ↑ 2 + 2 × a × b + b ↑ 2, where a = 1 and b = 2 ↓ 2." },
    { type: "try", expr: "1↑2+2×(2↓2)+(2↓2)↑2" },
    { type: "text", content: "Now comes the magic. Look at the last piece: (2 ↓ 2) ↑ 2. That's ↓ followed by ↑, with the same number (2). They're inverses — they cancel! So (2 ↓ 2) ↑ 2 = 2. And 1 ↑ 2 is just 1. So we get:" },
    { type: "formula", lines: ["1 + 2 × (2 ↓ 2) + 2"], label: "The inverses cancelled: (2 ↓ 2) ↑ 2 became just 2." },
    { type: "try", expr: "1+2×(2↓2)+2" },
    { type: "text", content: "Rearranging 1 + 2 = 3:" },
    { type: "formula", lines: ["3 + 2 × (2 ↓ 2)"], label: "That's exactly what's inside the ↓ 2 on the left side!" },
    { type: "try", expr: "3+2×(2↓2)" },
    { type: "text", content: "We squared the right side and got exactly the left side's contents. That means:" },
    { type: "formula", lines: ["(3 + 2 × (2 ↓ 2)) ↓ 2 = 1 + 2 ↓ 2  ✓"], label: "Both sides are equal. Done!" },
    { type: "try", expr: "(3+2×(2↓2))↓2" },

    { type: "heading3", content: "Why this matters" },
    { type: "text", content: "The entire proof hinged on one moment: seeing that (2 ↓ 2) ↑ 2 = 2, because ↓ and ↑ cancel. In school notation, that same step would be written as (√2)² = 2. Can you see the cancellation there? Not really — √ and ² look nothing alike. But ↓ and ↑? They're the same arrow, pointing opposite ways. The cancellation is staring you in the face." },
    { type: "text", content: "That's the point of the whole article. Better notation doesn't just look nicer — it makes hard things easy to see." },
    { type: "text", content: "You can both sit back down now." },
  ] },
];

/* ══════════════════════════════════════════════════════ */
/* ── Dutch content                                   ── */
/* ══════════════════════════════════════════════════════ */

const nl: Block[] = [
  { type: "text", content: "Een onderzoeker in Amsterdam keek het wiskundehuiswerk van zijn zoon na. De opdracht ging over machten, wortels en logaritmen. Hij bekeek de formules en dacht:" },
  { type: "quote", content: "\"Waarom maken ze iets simpels zo moeilijk?\"" },
  { type: "text", content: "Die vraag werd een [boek](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf), en dit interactieve artikel is daarop gebaseerd. We laten je een patroon zien dat al in je hoofd zit — je hebt het alleen nog niet opgemerkt — en dan laten we zien hoe een kleine verandering in notatie dat patroon zichtbaar maakt." },

  // ── Patroon ──
  { type: "heading", content: "Een patroon dat je al kent" },
  { type: "text", content: "We beginnen met iets simpels. Optellen en aftrekken horen bij elkaar:" },
  { type: "pair", left: "3 + 5 = 8", right: "8 − 5 = 3", arrow: "Met aftrekken ga je terug naar het andere getal." },
  { type: "text", content: "Kijk: 3 + 5 = 8. Weet je 8 en 5? Dan doe je 8 − 5 en krijg je 3." },
  { type: "text", content: "Voorbeeld met snoepjes: je had 3 snoepjes en krijgt er 5 bij, dus 3 + 5 = 8. Daarna geef je 5 snoepjes weg: 8 − 5 = 3." },
  { type: "text", content: "Dit verband is belangrijk in wiskunde. Je ziet het ook aan de tekens: + en − horen bij elkaar." },

  { type: "text", content: "Nu een niveau hoger. Vermenigvuldigen en delen zijn op precies dezelfde manier partners:" },
  { type: "pair", left: "3 × 4 = 12", right: "12 ÷ 4 = 3", arrow: "Delen is omgekeerd vermenigvuldigen." },
  { type: "text", content: "Ook hier: als je het resultaat (12) en een invoer (4) kent, dan kun je met delen het andere getal terugvinden. En de symbolen × en ÷ lijken op familie — allebei gebaseerd op een kruisvorm." },

  { type: "text", content: "We hebben dus een mooi patroon:" },
  { type: "levels", rows: [
    { op: "+  −", desc: "Optellen ↔ Aftrekken", note: "Symbolen lijken op elkaar ✓" },
    { op: "×  ÷", desc: "Vermenigvuldigen ↔ Delen", note: "Symbolen lijken op elkaar ✓" },
  ] },
  { type: "text", content: "Elk niveau heeft een bewerking en een omgekeerde bewerking, en je kunt zien dat ze bij elkaar horen omdat ze op elkaar lijken." },

  // ── Breuk ──
  { type: "heading", content: "Waar schoolnotatie het patroon breekt" },
  { type: "text", content: "Er is een derde niveau. Vermenigvuldigen is herhaald optellen (3 × 4 = 3 + 3 + 3 + 3). Op dezelfde manier bestaat er een bewerking die \"herhaald vermenigvuldigen\" betekent:" },
  { type: "pair", left: "2 × 2 × 2 = 8", right: "geschreven als 2³ = 8", arrow: "Dit is \"machtsverheffen.\" Die kleine 3 betekent \"vermenigvuldig 2 drie keer met zichzelf.\"" },
  { type: "text", content: "Tot zover prima. Maar nu: wat is de omgekeerde bewerking? Als je weet dat het antwoord 8 is en de exponent 3, hoe krijg je dan het grondtal (2) terug? Op school schrijf je dit met een wortelteken:" },
  { type: "formula", lines: ["³√8 = 2"], label: "Lees als: \"de derdemachtswortel van 8 is 2.\"" },
  { type: "text", content: "En als je het antwoord 8 en het grondtal 2 kent, en je wilt de exponent (3) terugvinden? Dat heet een logaritme:" },
  { type: "formula", lines: ["log₂(8) = 3"], label: "Lees als: \"het logaritme met grondtal 2 van 8 is 3.\"" },
  { type: "text", content: "Zet nu alle drie de notaties onder elkaar:" },
  { type: "formula", lines: ["2³ = 8", "³√8 = 2", "log₂(8) = 3"], label: "Drie manieren om dezelfde relatie te schrijven: de macht, de wortel en de logaritme." },
  { type: "text", content: "Lijken die drie op elkaar? Zien ze eruit als familie?" },
  { type: "text", content: "Nee. De eerste gebruikt een klein verhoogd getal. De tweede een √-teken met een indexcijfer. De derde spelt het woord \"log\" en zet het grondtal als subscript. Drie compleet verschillende systemen voor drie bewerkingen die elkaars omgekeerde bewerking zouden moeten zijn." },
  { type: "text", content: "Dat is het probleem: de wiskunde volgt nog steeds hetzelfde patroon, maar door deze drie heel verschillende tekens zie je dat patroon veel minder goed." },

  // ── Oplossing ──
  { type: "heading", content: "Wat als we het repareren?" },
  { type: "text", content: "De oplossing is verrassend simpel. In plaats van drie verschillende systemen, gebruik drie symbolen die op variaties van elkaar lijken:" },
  { type: "symbols" },
  { type: "text", content: "Laten we diezelfde relatie herschrijven. Klik op de knop om de transformatie te zien:" },
  { type: "notationTransform" },
  { type: "text", content: "Zeg het hardop: \"2 omhoog 3 is 8\", \"8 omlaag 3 is 2\", \"8 dubbel-omlaag 2 is 3.\" De symbolen gaan omhoog, omlaag, dubbel-omlaag — een familie die je kunt zien." },
  { type: "text", content: "En het patroon klopt nu op alle drie de niveaus:" },
  { type: "levels", rows: [
    { op: "+  −", desc: "Optellen ↔ Aftrekken", note: "Symbolen lijken op elkaar ✓" },
    { op: "×  ÷", desc: "Vermenigvuldigen ↔ Delen", note: "Symbolen lijken op elkaar ✓" },
    { op: "↑  ↓  ⇓", desc: "Macht ↔ Wortel ↔ Log", note: "Symbolen lijken op elkaar ✓" },
  ] },
  { type: "text", content: "Drie niveaus. Overal dezelfde structuur: de omgekeerde bewerking draait de bewerking terug, en de symbolen vertellen je dat ze bij elkaar horen. Dat is het hele idee." },

  { type: "heading3", content: "Maar wacht — waarom twee manieren van terugrekenen?" },
  { type: "text", content: "Bij de eerste twee niveaus heb je maar een omgekeerde bewerking nodig: − voor +, ÷ voor ×. Dat komt omdat de volgorde daar niet uitmaakt: 3 + 5 = 5 + 3 en 3 × 4 = 4 × 3." },
  { type: "text", content: "Maar bij machten maakt de volgorde wél uit: 2 ↑ 3 = 8, terwijl 3 ↑ 2 = 9. Er zijn dus twee getallen die kunnen ontbreken — het getal links van ↑ en het getal rechts van ↑ — en je hebt voor elk een andere manier van terugrekenen nodig:" },
  { type: "inverseRule" },
  { type: "text", content: "Dat is de enige regel die je nodig hebt. Mis je het linker getal? Gebruik ↓. Mis je het rechter getal? Gebruik ⇓." },

  { type: "heading3", content: "De kracht van omgekeerd rekenen: het heft elkaar op" },
  { type: "text", content: "Hier volgt iets prachtigs. Je weet al dat + en − elkaar opheffen:" },
  { type: "formula", lines: ["(5 + 3) − 3 = 5"], label: "Tel 3 erbij op, trek 3 eraf — je bent terug bij het begin." },
  { type: "text", content: "En dat × en ÷ elkaar opheffen:" },
  { type: "formula", lines: ["(5 × 3) ÷ 3 = 5"], label: "Vermenigvuldig met 3, deel door 3 — terug bij het begin." },
  { type: "text", content: "Met de nieuwe notatie werkt dat precies hetzelfde voor ↑ en ↓:" },
  { type: "formula", lines: ["(5 ↑ 3) ↓ 3 = 5"], label: "Verhef tot de 3e macht, neem de 3e-machtswortel — terug bij het begin." },
  { type: "try", expr: "(5↑3)↓3" },
  { type: "text", content: "En voor ↑ en ⇓:" },
  { type: "formula", lines: ["(5 ↑ 3) ⇓ 5 = 3"], label: "Verhef 5 tot een macht, neem dan het logaritme grondtal 5 — je krijgt de exponent terug." },
  { type: "try", expr: "(5↑3)⇓5" },
  { type: "text", content: "In schoolnotatie zou die eerste opheffing geschreven worden als ³√(5³) = 5, en de tweede als log₅(5³) = 3. Maar kijk ernaar: kun je zien dat ³√ en ³ elkaar opheffen? Of dat log₅ en 5³ elkaar opheffen? Niet echt — ze zien er compleet anders uit. Met ↓ en ↑ is de opheffing zichtbaar: het zijn hetzelfde symbool dat de andere kant op wijst. En ⇓ en ↑ werken op dezelfde manier. Dat is het hele punt van de notatie: ze labelt niet alleen de bewerkingen — ze laat zien hoe ze zich tot elkaar verhouden." },

  // ── Voorbeelden intro ──
  { type: "heading", content: "Drie problemen, een patroon" },
  { type: "text", content: "Theorie is één ding. Laten we kijken of het standhoudt in de echte wereld — met drie problemen uit drie totaal verschillende werelden: geld, muziek en geologie. Op school zou elk probleem een andere techniek vereisen. Met onze notatie volgen ze allemaal hetzelfde patroon: stel een vergelijking op met ↑, kijk welk getal ontbreekt, en kies de juiste manier van terugrekenen (↓ of ⇓)." },
  { type: "examplesIntro" },

  // ── Sparen ──
  { type: "heading", content: "Sparen" },
  { type: "text", content: "Stel, je zet €100 op een spaarrekening. De bank geeft 3% rente per jaar. Wat gebeurt er?" },

  { type: "heading3", content: "De formule opbouwen, stap voor stap" },
  { type: "text", content: "Na een jaar voegt de bank 3% toe aan je geld. Dat betekent dat je houdt wat je had (100%) en 3% extra krijgt, dus je hebt nu 103% van je geld:" },
  { type: "formula", lines: ["100 + 3% van 100 = 103"], label: "Maar er is een afkorting: 3% erbij tellen is hetzelfde als vermenigvuldigen met 1.03." },
  { type: "formula", lines: ["100 × 1.03 = 103"], label: "Waar komt die 1.03 vandaan? Het is 1 + 3/100 = 1 + 0.03 = 1.03." },
  { type: "text", content: "In het tweede jaar krijg je weer 3% rente — maar nu over €103, het bedrag waar in het eerste jaar ook al 3% bij is opgeteld:" },
  { type: "formula", lines: ["103 × 1.03 = 106.09"], label: "" },
  { type: "text", content: "Maar die 103 was zelf 100 × 1.03. Dus we kunnen de hele keten opschrijven:" },
  { type: "formula", lines: ["100 × 1.03 × 1.03 = 100 × 1.03 ↑ 2 = 106.09"], label: "Herhaald vermenigvuldigen is een macht. Twee jaar betekent ↑ 2." },
  { type: "text", content: "Zie je het patroon? Na drie jaar: 100 × 1.03 ↑ 3. Na tien jaar: 100 × 1.03 ↑ 10. In het algemeen:" },
  { type: "formula", lines: ["Na n jaar:  m × r ↑ n"], label: "m = beginbedrag, r = 1 + rentevoet (1.03 bij 3%), n = aantal jaren." },
  { type: "text", content: "Eén formule. Drie letters. Laten we kijken wat we ermee kunnen doen." },
  { type: "interestViz" },

  { type: "heading3", content: "Vraag 1: Hoeveel geld moet ik nu op de bank zetten om over 10 jaar €1000 te hebben, als de rente 3% blijft?" },
  { type: "text", content: "Onze formule zegt: na n jaar is je geld m × r ↑ n. We kennen de rente (r = 1.03), de tijd (n = 10), en we weten dat we op 1000 willen uitkomen. Dus:" },
  { type: "formula", lines: ["m × 1.03 ↑ 10 = 1000"], label: "We zoeken m, maar die zit vast in een vermenigvuldiging." },
  { type: "text", content: "De m is vermenigvuldigd met 1.03 ↑ 10. Om m alleen te krijgen, passen we de omgekeerde bewerking van vermenigvuldigen toe — en dat is delen:" },
  { type: "formula", lines: ["m = 1000 ÷ 1.03 ↑ 10"], label: "" },
  { type: "try", expr: "1000÷1.03↑10" },
  { type: "text", content: "Ongeveer €744. Als je vandaag €744 op de bank zet tegen 3% rente, is dat over 10 jaar gegroeid tot €1000." },

  { type: "heading3", content: "Vraag 2: Welke rente heb ik nodig om mijn geld te verdubbelen in 10 jaar?" },
  { type: "text", content: "Verdubbelen betekent van m naar 2 × m gaan. Onze formule zegt m × r ↑ 10 = 2 × m. De m staat aan beide kanten, dus die valt weg. Er blijft over:" },
  { type: "formula", lines: ["r ↑ 10 = 2"], label: "We zoeken r (de linkerkant van ↑)." },
  { type: "text", content: "Vergelijk met de regelkaart: dit heeft de vorm a ↑ b = c, en r staat op de plek van a — de linkerkant. Links onbekend → gebruik ↓:" },
  { type: "formula", lines: ["r = 2 ↓ 10"], label: "" },
  { type: "try", expr: "2↓10" },
  { type: "text", content: "Ongeveer 1.072 — dat betekent een rente van zo'n 7.2%. Op school schrijf je ¹⁰√2. Hetzelfde antwoord, maar je kunt niet zien waar die wortel vandaan komt of waarom." },

  { type: "heading3", content: "Vraag 3: Hoeveel jaar duurt het voordat mijn geld verdubbelt bij 3% rente?" },
  { type: "text", content: "Weer: m × 1.03 ↑ y = 2 × m. De m's vallen weg:" },
  { type: "formula", lines: ["1.03 ↑ y = 2"], label: "We zoeken y (de rechterkant van ↑)." },
  { type: "text", content: "Vergelijk met de regelkaart: a ↑ b = c, en y staat op de plek van b — de rechterkant. Rechts onbekend → gebruik ⇓:" },
  { type: "formula", lines: ["y = 2 ⇓ 1.03"], label: "" },
  { type: "try", expr: "2⇓1.03" },
  { type: "text", content: "Ongeveer 23.4 jaar. Op school schrijf je log(2) / log(1.03) — klopt, maar het laat niet zien waarom. Het ⇓-symbool vertelt je: het is de omgekeerde bewerking die de rechterkant van ↑ teruggeeft." },

  { type: "text", content: "Drie vragen. In het oude systeem voelt elk antwoord als een ander trucje. In de nieuwe notatie is elk antwoord dezelfde stap: kijk op de regelkaart, kies de juiste manier van terugrekenen (↓ of ⇓), pas toe. Klaar." },

  { type: "text", content: "Probeer het zelf — klik op m, r of n om te kiezen wat je wilt vinden, en verschuif de rest om het antwoord live te zien veranderen:" },
  { type: "savingsExplorer" },

  // ── Piano ──
  { type: "heading", content: "Hoe klinkt een piano?" },
  { type: "text", content: "Sla een C aan op de piano. Die noot trilt 262 keer per seconde (262 Hz)." },
  { type: "text", content: "Sla nu de C een octaaf hoger aan. Die trilt precies twee keer zo snel: 524 Hz." },
  { type: "text", content: "Tussen die twee C's zitten 12 toetsen. En hier wordt het slim: de piano is zo gestemd dat elke toets hetzelfde percentage hoger klinkt dan de vorige. Niet hetzelfde bedrag hoger — dezelfde factor." },
  { type: "text", content: "Noem die onbekende factor r. Je begint bij 262 Hz en vermenigvuldigt met r voor elke toets:" },
  { type: "pianoChainViz" },
  { type: "text", content: "Na 12 toetsen kom je uit op 524 Hz, en dat is precies 2 × 262. Dus die twaalf vermenigvuldigingen met r samen vermenigvuldigen met 2:" },
  { type: "repeatedMultViz" },
  { type: "text", content: "Herhaald vermenigvuldigen met hetzelfde getal — dat is een macht:" },
  { type: "formula", lines: ["r ↑ 12 = 2"], label: "" },
  { type: "text", content: "Kijk naar deze formule: hij heeft de vorm a ↑ b = c, waarbij r op de plek van a staat — de linkerkant van ↑. Uit de regelkaart: links onbekend → gebruik ↓." },
  { type: "formula", lines: ["r = 2 ↓ 12"], label: "" },
  { type: "try", expr: "2↓12" },
  { type: "text", content: "Ongeveer 1.0595. Elke pianotoets is ruwweg 6% hoger in toonhoogte. Zo ziet dat er in de praktijk uit:" },
  { type: "pianoFreqViz" },
  { type: "text", content: "Op school zou het antwoord ¹²√2 zijn. Hetzelfde getal — maar probeer daar maar eens uit af te lezen waar het vandaan komt. Met de notatie spiegelt de vergelijking r ↑ 12 = 2 direct wat de piano doet, en ↓ geeft je het antwoord in één stap." },

  // ── Aardbevingen ──
  { type: "heading", content: "Aardbevingen en de Richterschaal" },
  { type: "text", content: "Je hebt vast weleens de Richterschaal op het nieuws gehoord. Een aardbeving van magnitude 3 voel je amper, magnitude 7 kan een stad verwoesten. Maar het verschil tussen 3 en 7 is niet \"een beetje meer\" — het is enorm." },
  { type: "text", content: "Wetenschappers hebben de Richterschaal zo ontworpen dat elke stap van 1 magnitude precies 10 ↑ 1.5 keer meer energie betekent:" },
  { type: "formula", lines: ["10 ↑ 1.5 = 31.623"], label: "Elke +1 op de schaal = ongeveer 31.6 keer meer energie." },
  { type: "try", expr: "10↑1.5" },
  { type: "text", content: "Dus van magnitude 5 naar 6: 31.6× meer energie. Van 5 naar 7? Dat zijn twee stappen: 31.6 × 31.6 = ongeveer 1000× meer energie. De getallen op de schaal lijken klein, maar de energie erachter is gigantisch." },

  { type: "heading3", content: "Hoeveel magnitude voor dubbele energie?" },
  { type: "text", content: "Als een hele stap (+1 magnitude) 10 ↑ 1.5 meer energie oplevert, dan levert een halve stap (+0.5) op:" },
  { type: "formula", lines: ["10 ↑ (1.5 × 0.5) = 10 ↑ 0.75"], label: "Een halve stap betekent 1.5 × 0.5 = 0.75 als exponent." },
  { type: "try", expr: "10↑0.75" },
  { type: "text", content: "Ongeveer 5.6× meer energie. In het algemeen: een stap van Δ magnitude betekent:" },
  { type: "formula", lines: ["energieverhouding = 10 ↑ (1.5 × Δ)"], label: "Δ is hoeveel de magnitude stijgt." },
  { type: "text", content: "Nu de vraag: bij welke Δ verdubbelt de energie precies? We vullen 2 in:" },
  { type: "formula", lines: ["10 ↑ (1.5 × Δ) = 2"], label: "We zoeken Δ." },
  { type: "text", content: "Dit heeft de vorm a ↑ b = c, waarbij 1.5 × Δ op de plek van b staat — de rechterkant van ↑. Uit de regelkaart: rechts onbekend → gebruik ⇓." },
  { type: "formula", lines: ["1.5 × Δ = 2 ⇓ 10"], label: "" },
  { type: "try", expr: "2⇓10" },
  { type: "text", content: "Dat geeft ongeveer 0.301. Maar dat is 1.5 × Δ, niet Δ zelf. Om Δ alleen te krijgen, delen we door 1.5:" },
  { type: "formula", lines: ["Δ = 2 ⇓ 10 ÷ 1.5"], label: "" },
  { type: "try", expr: "2⇓10÷1.5" },
  { type: "text", content: "Ongeveer 0.2. Dat betekent dat een aardbeving van magnitude 7.2 ruwweg twee keer zoveel energie vrijmaakt als een van 7.0. Laten we kijken hoe dat eruitziet:" },
  { type: "earthquakeViz" },
  { type: "text", content: "Elke kleine stap van 0.2 verdubbelt de energie. Van 5.0 naar 6.0 is maar één getal op de schaal, maar het betekent 32 keer meer energie. De Richterschaal verbergt een machtsrelatie — en het ⇓-symbool is wat je in staat stelt die te doorzien." },

  // ── Jouw beurt ──
  { type: "heading", content: "Jouw beurt" },
  { type: "text", content: "De calculator op deze pagina ondersteunt ↑, ↓ en ⇓. Hier zijn een paar dingen om te ontdekken:" },
  { type: "challenge", title: "De driehoek van omgekeerd rekenen", description: "Deze drie uitdrukkingen beschrijven allemaal dezelfde relatie: 2¹⁰ = 1024. Controleer ze allemaal.", items: [
    { expr: "2↑10", hint: "= 1024 (de macht)" },
    { expr: "1024↓10", hint: "= 2 (de wortel — geeft het grondtal terug)" },
    { expr: "1024⇓2", hint: "= 10 (de logaritme — geeft de exponent terug)" },
  ] },
  { type: "challenge", title: "Halve macht = wortel", description: "Een macht van 0.5 is hetzelfde als een wortel. Deze twee moeten hetzelfde antwoord geven:", items: [
    { expr: "2↑0.5", hint: "macht met exponent ½" },
    { expr: "2↓2", hint: "wortel van 2" },
  ] },
  { type: "challenge", title: "Radioactief verval", description: "Sommige stoffen vallen langzaam uit elkaar. Koolstof-14 is er daar één van: elke 5730 jaar is de helft weg. Je begint met 100%. Na één keer halveren heb je 0.5 (= 50%) over. Na twee keer halveren: 0.5 × 0.5 = 0.5 ↑ 2 = 0.25 (= 25%). Na n keer halveren heb je dus 0.5 ↑ n over. De vraag is: na hoeveel keer halveren is nog maar 1% (= 0.01) over? Je zoekt n in 0.5 ↑ n = 0.01. Het getal rechts van ↑ ontbreekt — dus gebruik ⇓:", items: [
    { expr: "0.01⇓0.5", hint: "≈ 6.6 halveringen, oftewel zo'n 38.000 jaar" },
  ] },

  // ── Herkomst ──
  { type: "heading", content: "Waar dit vandaan komt" },
  { type: "text", content: "Deze notatie is ontwikkeld door Steven Pemberton, een informaticus bij CWI Amsterdam. Zijn boek begint helemaal bij het begin — tellen met streepjes — en bouwt op via optellen, vermenigvuldigen en machten, en laat zien dat elk niveau hetzelfde patroon volgt. De notatie is niet willekeurig: die is ontworpen om dat patroon zichtbaar te maken." },
  { type: "text", content: "Als deze notatie iets voor je heeft opgehelderd — of als je het wilt delen met een leerling of docent — het volledige boek van Steven Pemberton is [beschikbaar als PDF](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf)." },

  // ── Bewijs (bijlage) ──
  { type: "collapsible", title: "Bijlage: Een bewijs dat simpel wordt", blocks: [
    { type: "text", content: "NB — Dit stuk is voor wiskundedocenten en wiskundeliefhebbers. Deel het met ze — deze notatie verrast zelfs ervaren wiskundedocenten, en het bewijs leidt vaak tot een goed gesprek." },
    { type: "text", content: "Wikipedia heeft een pagina over [geneste wortels](https://en.wikipedia.org/wiki/Nested_radical) — uitdrukkingen waarin een wortel nóg een wortel bevat. Die pagina staat vol met zware wiskunde — maar wij pakken er slechts één klein voorbeeldje uit en houden het simpel." },
    { type: "formula", lines: ["√(3 + 2√2) = 1 + √2"], label: "Wikipedia zegt: \"Het is niet meteen duidelijk\" dat deze twee gelijk zijn." },
    { type: "text", content: "In schoolnotatie moet je speciale regels over wortels kennen om dit te bewijzen. Maar met onze notatie is het gewoon een puzzel. We hebben maar één ding nodig dat je waarschijnlijk al kent:" },
    { type: "formula", lines: ["(a + b) ↑ 2 = a ↑ 2 + 2 × a × b + b ↑ 2"], label: "De \"kwadraat van een som\" regel, die in elke notatie werkt." },

    { type: "heading3", content: "Vertalen naar onze notatie" },
    { type: "text", content: "De wortel schrijven we als ↓2. Laten we de twee kanten stukje voor stukje vertalen." },
    { type: "text", content: "De rechterkant is makkelijk. Daar staat: 1 + √2. Het enige dat we hoeven te vertalen is √2, de wortel van 2:" },
    { type: "formula", lines: ["√2  →  2 ↓ 2"], label: "Lees: \"2 omlaag 2\". Het eerste getal (2) is waar je de wortel van neemt. Het tweede getal (2) zegt dat het een wortel is (de 2e-machtswortel)." },
    { type: "text", content: "Dus de rechterkant wordt: 1 + 2 ↓ 2." },
    { type: "text", content: "Nu de linkerkant. Daar staat: √(3 + 2√2). Dat is een wortel van iets, en dat \"iets\" bevat zelf ook weer een wortel. We werken van binnen naar buiten:" },
    { type: "formula", lines: [
      "Binnenste √2          →  2 ↓ 2",
      "2 × √2                →  2 × (2 ↓ 2)",
      "3 + 2 × √2            →  3 + 2 × (2 ↓ 2)",
      "√(3 + 2 × √2)         →  (3 + 2 × (2 ↓ 2)) ↓ 2",
    ], label: "De buitenste √ wordt ↓2 helemaal aan het einde — die pakt de wortel van alles erbinnen." },
    { type: "formula", lines: [
      "Linkerkant:   (3 + 2 × (2 ↓ 2)) ↓ 2",
      "Rechterkant:  1 + 2 ↓ 2",
    ], label: "Dit willen we laten zien: linkerkant = rechterkant." },

    { type: "heading3", content: "Het plan" },
    { type: "text", content: "Kijk naar de linkerkant: daar staat (iets) ↓ 2. Dat betekent: \"de wortel van wat erbinnen staat.\" Het \"iets\" erbinnen is 3 + 2 × (2 ↓ 2)." },
    { type: "text", content: "Als we nu de rechterkant kwadrateren (↑ 2), en we komen precies uit op 3 + 2 × (2 ↓ 2), dan weten we dat de linkerkant gelijk is aan de rechterkant. Waarom? Omdat ↑ 2 en ↓ 2 omgekeerde bewerkingen zijn — ze heffen elkaar op." },

    { type: "heading3", content: "Stap voor stap" },
    { type: "text", content: "Laten we de rechterkant kwadrateren:" },
    { type: "formula", lines: ["(1 + 2 ↓ 2) ↑ 2"], label: "We gebruiken de \"kwadraat van een som\" regel met a = 1 en b = 2 ↓ 2." },
    { type: "try", expr: "(1+2↓2)↑2" },
    { type: "text", content: "Uitwerken met de regel geeft drie stukken:" },
    { type: "formula", lines: ["1 ↑ 2 + 2 × (2 ↓ 2) + (2 ↓ 2) ↑ 2"], label: "a ↑ 2 + 2 × a × b + b ↑ 2, met a = 1 en b = 2 ↓ 2." },
    { type: "try", expr: "1↑2+2×(2↓2)+(2↓2)↑2" },
    { type: "text", content: "Nu komt de magie. Kijk naar het laatste stuk: (2 ↓ 2) ↑ 2. Dat is ↓ gevolgd door ↑, met hetzelfde getal (2). Het zijn omgekeerde bewerkingen — ze heffen elkaar op! Dus (2 ↓ 2) ↑ 2 = 2. En 1 ↑ 2 is gewoon 1. Dan krijgen we:" },
    { type: "formula", lines: ["1 + 2 × (2 ↓ 2) + 2"], label: "De omgekeerde bewerkingen hebben elkaar opgeheven: (2 ↓ 2) ↑ 2 werd gewoon 2." },
    { type: "try", expr: "1+2×(2↓2)+2" },
    { type: "text", content: "Herschikken: 1 + 2 = 3:" },
    { type: "formula", lines: ["3 + 2 × (2 ↓ 2)"], label: "Dat is precies wat er bínnen de ↓ 2 aan de linkerkant staat!" },
    { type: "try", expr: "3+2×(2↓2)" },
    { type: "text", content: "We hebben de rechterkant gekwadrateerd en komen precies uit op de inhoud van de linkerkant. Dat betekent:" },
    { type: "formula", lines: ["(3 + 2 × (2 ↓ 2)) ↓ 2 = 1 + 2 ↓ 2  ✓"], label: "Beide kanten zijn gelijk. Klaar!" },
    { type: "try", expr: "(3+2×(2↓2))↓2" },

    { type: "heading3", content: "Waarom dit ertoe doet" },
    { type: "text", content: "Het hele bewijs draaide om één moment: zien dat (2 ↓ 2) ↑ 2 = 2, omdat ↓ en ↑ elkaar opheffen. In schoolnotatie zou diezelfde stap geschreven worden als (√2)² = 2. Kun je daar de opheffing zien? Niet echt — √ en ² lijken nergens op elkaar. Maar ↓ en ↑? Het is dezelfde pijl, de andere kant op. De opheffing springt je in het gezicht." },
    { type: "text", content: "Dat is het punt van dit hele artikel. Betere notatie is niet alleen mooier — het maakt moeilijke dingen makkelijk te zien." },
    { type: "text", content: "Jullie mogen nu allebei weer rustig gaan zitten." },
  ] },
];

const zh: Block[] = [
  { type: "text", content: "阿姆斯特丹的一位研究者在看他儿子的数学作业。题目是幂、根和对数。他看完后想：" },
  { type: "quote", content: "\"为什么这么简单的东西要写得这么难？\"" },
  { type: "text", content: "这个问题后来写成了一本[书](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf)。这篇互动文章就基于那本书。我们会先指出你心里其实已经有的一种模式——只是还没留意到——再说明：只要稍微改一下写法，这个模式就会变得一眼可见。" },

  { type: "heading", content: "你已经知道的模式" },
  { type: "text", content: "先看最简单的：加法和减法是一对。" },
  { type: "pair", left: "3 + 5 = 8", right: "8 − 5 = 3", arrow: "减法可以把加法退回去" },
  { type: "text", content: "你看：3 + 5 = 8。如果你知道 8 和 5，那么 8 − 5 就能找回 3。" },
  { type: "text", content: "糖果例子：你有 3 颗糖，又拿到 5 颗，所以是 8 颗。再送出 5 颗，就回到 3 颗。" },
  { type: "text", content: "这种模式在数学里很重要。你还能从符号上看出来：+ 和 − 像一家人。" },
  { type: "text", content: "再往上一层：乘法和除法也是完全同一类关系：" },
  { type: "pair", left: "3 × 4 = 12", right: "12 ÷ 4 = 3", arrow: "除法是乘法的逆运算" },
  { type: "text", content: "同样：如果你知道结果 12 和其中一个因数 4，用除法就能把另一个因数 3 找回来。符号 × 和 ÷ 也都带着“十字形”的亲戚感。" },
  { type: "text", content: "于是我们有一层好看的模式：" },
  { type: "levels", rows: [
    { op: "+  −", desc: "加法 ↔ 减法", note: "符号看起来像一组 ✓" },
    { op: "×  ÷", desc: "乘法 ↔ 除法", note: "符号看起来像一组 ✓" },
  ] },
  { type: "text", content: "每一层都是“运算 + 逆运算”，而且符号长得像，你能看出它们属于同一套。" },

  { type: "heading", content: "学校写法把模式藏起来了" },
  { type: "text", content: "还有第三层。乘法可以理解为重复加法（3 × 4 = 3 + 3 + 3 + 3）。同样地，还有一种运算表示“重复乘法”，也就是幂：" },
  { type: "pair", left: "2 × 2 × 2 = 8", right: "写作 2³ = 8", arrow: "这叫乘方：小 3 表示“2 连乘 3 次”" },
  { type: "text", content: "到这里都还好。接下来：逆运算是什么？如果你知道结果是 8、指数是 3，怎么把底数 2 找回来？学校用根号这样写：" },
  { type: "formula", lines: ["³√8 = 2"], label: "读作：8 的立方根是 2" },
  { type: "text", content: "如果你知道结果是 8、底数是 2，想找回指数 3？那叫对数：" },
  { type: "formula", lines: ["log₂(8) = 3"], label: "读作：以 2 为底，8 的对数是 3" },
  { type: "text", content: "把三种写法摆在一起：" },
  { type: "formula", lines: ["2³ = 8", "³√8 = 2", "log₂(8) = 3"], label: "同一个关系：幂、根、对数——却是三种写法" },
  { type: "text", content: "你觉得它们看起来像一家人吗？像同一套符号里的“逆运算”吗？" },
  { type: "text", content: "不太像。第一个是小小的上标；第二个是 √ 再加角上的指数；第三个写出 log，底数又变成下标。三套完全不同的视觉系统，却要说它们互为逆运算。" },
  { type: "text", content: "问题不在数学本身，而在写法：规律其实还在，但这三种符号让它更难一眼看出来。" },

  { type: "heading", content: "如果我们把写法修一下？" },
  { type: "text", content: "办法出奇地简单：别用三套完全不同的样子，改用三个“彼此像变体”的符号：" },
  { type: "symbols" },
  { type: "text", content: "下面把同一个关系改写。点按钮看变换：" },
  { type: "notationTransform" },
  { type: "text", content: "试着读出来：“2 上 3 等于 8”“8 下 3 等于 2”“8 双下 2 等于 3”。符号往上、往下、双往下——一眼能看出是一家人。" },
  { type: "text", content: "表格里每一层也都对齐同一种结构：" },
  { type: "levels", rows: [
    { op: "+  −", desc: "加法 ↔ 减法", note: "符号看起来像一组 ✓" },
    { op: "×  ÷", desc: "乘法 ↔ 除法", note: "符号看起来像一组 ✓" },
    { op: "↑  ↓  ⇓", desc: "幂 ↔ 根 ↔ 对数", note: "符号看起来像一组 ✓" },
  ] },
  { type: "text", content: "三层结构，处处相同：逆运算把运算退回去，符号也在告诉你它们是一对。这就是整套想法的核心。" },

  { type: "heading3", content: "为什么会有两种逆运算？" },
  { type: "text", content: "在前两层里，你通常只需要一个逆运算：+ 用 − 退，× 用 ÷ 退。因为那里顺序不太要紧：3 + 5 = 5 + 3，3 × 4 = 4 × 3。" },
  { type: "text", content: "但幂不一样，顺序很要紧：2 ↑ 3 = 8，而 3 ↑ 2 = 9。所以 ↑ 左边和右边都可能“缺一个数”，也就需要两种不同的逆运算：" },
  { type: "inverseRule" },
  { type: "text", content: "你只要记住这一条：左边未知用 ↓，右边未知用 ⇓。" },

  { type: "heading3", content: "逆运算会互相抵消" },
  { type: "text", content: "从这里还能推出一件很妙的事。你已经知道 + 和 − 会互相抵消：" },
  { type: "formula", lines: ["(5 + 3) − 3 = 5"], label: "加上去，再减回来" },
  { type: "text", content: "× 和 ÷ 也一样：" },
  { type: "formula", lines: ["(5 × 3) ÷ 3 = 5"], label: "乘上去，再除回来" },
  { type: "text", content: "在新记号里，↑ 和 ↓ 完全同一套路：" },
  { type: "formula", lines: ["(5 ↑ 3) ↓ 3 = 5"], label: "先三次方，再开三次方根——回到起点" },
  { type: "try", expr: "(5↑3)↓3" },
  { type: "text", content: "↑ 和 ⇓ 也一样：" },
  { type: "formula", lines: ["(5 ↑ 3) ⇓ 5 = 3"], label: "把 5 乘到某个幂，再用以 5 为底的对数——指数就回来了" },
  { type: "try", expr: "(5↑3)⇓5" },
  { type: "text", content: "在学校写法里，前一种抵消会写成 ³√(5³) = 5，后一种写成 log₅(5³) = 3。你一眼能看出 ³√ 和 ³ 在互消吗？能看出 log₅ 和 5³ 在互消吗？其实很难——它们长得太不像。用 ↓ 和 ↑，互消是看得见的：同一支箭头，方向相反。⇓ 和 ↑ 也是同一思路。记号的用处不只是“起名”，而是让你看见关系。" },

  { type: "heading", content: "三个问题，一个模式" },
  { type: "text", content: "理论是一回事，现实里也要站得住脚。下面用三个来自完全不同世界的问题：存钱、钢琴、地震。在学校，它们常常像三种不同技巧：“把指数挪下来”“写根号”“取对数再相除”。用本文的记号，它们都走同一条路：先写成 a ↑ b = c，看缺的是左边还是右边，再选 ↓ 或 ⇓。" },
  { type: "examplesIntro" },

  { type: "heading", content: "存钱" },
  { type: "text", content: "想象你在银行存 100 元，年利率 3%。会发生什么？" },
  { type: "heading3", content: "一步一步写出公式" },
  { type: "text", content: "第一年末，银行在你本金上加 3%。也就是你保留原来的 100%，再多 3%，所以一共是本金的 103%：" },
  { type: "formula", lines: ["100 + 100 的 3% = 103"], label: "更短的写法：加 3% 等于乘 1.03" },
  { type: "formula", lines: ["100 × 1.03 = 103"], label: "1.03 从哪来？1 + 3/100 = 1 + 0.03 = 1.03" },
  { type: "text", content: "第二年末，又是 3%——但这次是对 103 元计息，里面已经包含上一年的利息：" },
  { type: "formula", lines: ["103 × 1.03 = 106.09"], label: "" },
  { type: "text", content: "而 103 本来就是 100 × 1.03，所以整条链可以写成一个式子：" },
  { type: "formula", lines: ["100 × 1.03 × 1.03 = 100 × 1.03 ↑ 2 = 106.09"], label: "重复乘法就是幂：两年就是 ↑ 2" },
  { type: "text", content: "看出规律了吗？三年：100 × 1.03 ↑ 3；十年：100 × 1.03 ↑ 10。一般地：" },
  { type: "formula", lines: ["n 年后: m × r ↑ n"], label: "m 起始金额，r = 1 + 年利率（3% 时 r = 1.03），n 年数" },
  { type: "text", content: "一个公式，三个字母。看看能用它算什么。" },
  { type: "interestViz" },
  { type: "heading3", content: "问题 1：10 年后要到 10000，现在要存多少？" },
  { type: "text", content: "公式是：n 年后，钱变成 m × r ↑ n。我们知道利率 r = 1.03，时间 n = 10，还想最后变成 10000。所以：" },
  { type: "formula", lines: ["m × 1.03 ↑ 10 = 10000"], label: "要求 m，但 m 被乘法“包”在里面。" },
  { type: "text", content: "m 乘了 1.03 ↑ 10。要把 m 单独拿出来，就用乘法的逆运算——除法：" },
  { type: "formula", lines: ["m = 10000 ÷ 1.03 ↑ 10"], label: "用除法把 m 单独留下来" },
  { type: "try", expr: "10000÷1.03↑10" },
  { type: "text", content: "大约 7441 元。如果你今天存这么多，年利率 3%，10 年后大约能到 10000 元。" },
  { type: "heading3", content: "问题 2：10 年翻倍需要多少利率？" },
  { type: "text", content: "翻倍就是从 m 变成 2 × m。公式写成 m × r ↑ 10 = 2 × m。两边都有 m，可以约掉，剩下：" },
  { type: "formula", lines: ["r ↑ 10 = 2"], label: "要求 r，它在 ↑ 的左边。" },
  { type: "text", content: "对照规则卡：这是 a ↑ b = c 的样子，r 在 a 的位置——左边未知，用 ↓：" },
  { type: "formula", lines: ["r = 2 ↓ 10"], label: "" },
  { type: "try", expr: "2↓10" },
  { type: "text", content: "大约 1.072，也就是年利率约 7.2%。在学校会写成 ¹⁰√2。答案一样，但不容易看出根号从哪来、为什么。" },
  { type: "heading3", content: "问题 3：3% 利率要多少年翻倍？" },
  { type: "text", content: "同样：m × 1.03 ↑ y = 2 × m。两边的 m 约掉：" },
  { type: "formula", lines: ["1.03 ↑ y = 2"], label: "要求 y，它在 ↑ 的右边。" },
  { type: "text", content: "对照规则卡：a ↑ b = c 里，y 在 b 的位置——右边未知，用 ⇓：" },
  { type: "formula", lines: ["y = 2 ⇓ 1.03"], label: "" },
  { type: "try", expr: "2⇓1.03" },
  { type: "text", content: "大约 23.4 年。学校常写成 log(2) / log(1.03)，对但看不出“为什么”。⇓ 告诉你：这是在找回 ↑ 右边那一项。" },
  { type: "text", content: "三个问题。旧写法里，每一个都像不同口诀：“把指数挪下来”“写根号”“取对数再除”。在新记号里，每一步都是同一动作：对照规则卡，选对逆运算（↓ 或 ⇓），代进去。结束。" },
  { type: "text", content: "你也可以亲手试：点 m、r、n 选择要求哪一个，再拖动别的量，看答案怎么跟着变：" },
  { type: "savingsExplorer" },

  { type: "heading", content: "钢琴怎么调音？" },
  { type: "text", content: "在钢琴上弹一个 C，它的频率大约是每秒振动 262 次（262 Hz）。" },
  { type: "text", content: "再弹高一个八度的 C，频率正好快一倍：524 Hz。" },
  { type: "text", content: "这两个 C 之间隔着 12 个键。巧妙之处在于：钢琴被调成“每一键相对前一键，音高都乘同一个比例”。不是“每次都加同样多的赫兹”，而是“每次都乘同一个因子”。" },
  { type: "text", content: "把这个未知因子叫作 r。你从 262 Hz 出发，每经过一个键就乘一次 r：" },
  { type: "pianoChainViz" },
  { type: "text", content: "走过 12 个键，你到达 524 Hz，也就是 2 × 262。所以这 12 次乘以 r，合起来相当于乘了 2：" },
  { type: "repeatedMultViz" },
  { type: "text", content: "同一个数连乘多次，就是幂：" },
  { type: "formula", lines: ["r ↑ 12 = 2"], label: "" },
  { type: "text", content: "看这个式子：形状是 a ↑ b = c，而 r 在 a 的位置——在 ↑ 左边。规则卡说：左边未知 → 用 ↓。" },
  { type: "formula", lines: ["r = 2 ↓ 12"], label: "" },
  { type: "try", expr: "2↓12" },
  { type: "text", content: "大约 1.0595，也就是相邻两键音高大约差 6%。直观上看频率怎么爬升：" },
  { type: "pianoFreqViz" },
  { type: "text", content: "在学校会写成 ¹²√2。数字一样，却很难看出它从钢琴的“12 步翻倍”里长出来。用新记号，r ↑ 12 = 2 直接照抄钢琴在做什么，而 ↓ 一步就把 r 求出来。" },

  { type: "heading", content: "地震与里氏震级" },
  { type: "text", content: "新闻里常听到里氏震级。3 级你可能几乎感觉不到，7 级却能毁城。3 到 7 不是“稍微大一点”，背后的能量差非常巨大。" },
  { type: "text", content: "科学家把里氏震级设计成：每增加 1 级，能量正好变成原来的 10 ↑ 1.5 倍：" },
  { type: "formula", lines: ["10 ↑ 1.5 = 31.623"], label: "震级每 +1，能量约 ×31.6" },
  { type: "try", expr: "10↑1.5" },
  { type: "text", content: "所以从 5 级到 6 级：大约 31.6 倍能量。从 5 级到 7 级？跨了两级：31.6 × 31.6 ≈ 1000 倍。刻度上的数字看起来小，背后的能量却大得惊人。" },
  { type: "heading3", content: "能量翻倍要震级差多少？" },
  { type: "text", content: "如果完整的一级（+1）对应 10 ↑ 1.5 倍能量，那么半步（+0.5）就是：" },
  { type: "formula", lines: ["10 ↑ (1.5 × 0.5) = 10 ↑ 0.75"], label: "半步：指数用 1.5 × 0.5 = 0.75" },
  { type: "try", expr: "10↑0.75" },
  { type: "text", content: "大约 5.6 倍能量。一般地，震级增加 Δ，能量比是：" },
  { type: "formula", lines: ["能量比 = 10 ↑ (1.5 × Δ)"], label: "Δ 表示震级增加了多少" },
  { type: "text", content: "现在问：Δ 取多少时，能量刚好翻倍？把目标写成 2：" },
  { type: "formula", lines: ["10 ↑ (1.5 × Δ) = 2"], label: "要求 Δ" },
  { type: "text", content: "这是 a ↑ b = c 的形状，其中 1.5 × Δ 在 b 的位置——在 ↑ 右边。规则卡：右边未知 → 用 ⇓。" },
  { type: "formula", lines: ["1.5 × Δ = 2 ⇓ 10"], label: "" },
  { type: "try", expr: "2⇓10" },
  { type: "text", content: "这给出大约 0.301，但这是 1.5 × Δ，还不是 Δ。要单独求 Δ，再除以 1.5：" },
  { type: "formula", lines: ["Δ = 2 ⇓ 10 ÷ 1.5"], label: "" },
  { type: "try", expr: "2⇓10÷1.5" },
  { type: "text", content: "大约 0.2。意思是 7.2 级地震释放的能量大约 7.0 级的两倍。看图感受一下：" },
  { type: "earthquakeViz" },
  { type: "text", content: "震级上每挪大约 0.2，能量就翻一倍。从 5.0 到 6.0 只是刻度上 +1，能量却大约 ×32。里氏震级藏着一个幂关系——⇓ 正好帮你把它看穿。" },

  { type: "heading", content: "轮到你了" },
  { type: "text", content: "本页的计算器支持 ↑、↓、⇓。可以试试下面几题：" },
  { type: "challenge", title: "逆运算三角形", description: "下面三个式子描述同一个关系：2¹⁰ = 1024。请都验证一下。", items: [
    { expr: "2↑10", hint: "= 1024（幂）" },
    { expr: "1024↓10", hint: "= 2（根，找回底数）" },
    { expr: "1024⇓2", hint: "= 10（对数，找回指数）" },
  ] },
  { type: "challenge", title: "半次幂 = 平方根", description: "指数取 0.5 的幂，和开平方根是一回事。下面两个式子结果应该一样：", items: [
    { expr: "2↑0.5", hint: "指数 1/2 的幂" },
    { expr: "2↓2", hint: "2 的平方根" },
  ] },
  { type: "challenge", title: "放射性衰变", description: "有些物质会慢慢衰变。碳-14 是其中之一：每过 5730 年，大约剩一半。一开始是 100%。减半一次后，剩 0.5（= 50%）。减半两次：0.5 × 0.5 = 0.5 ↑ 2 = 0.25（= 25%）。减半 n 次后，剩下 0.5 ↑ n。问题：减半多少次后，只剩 1%（= 0.01）？也就是求 n，使 0.5 ↑ n = 0.01。↑ 右边的 n 未知，所以用 ⇓：", items: [
    { expr: "0.01⇓0.5", hint: "≈ 6.6 次减半，约 3.8 万年" },
  ] },
  { type: "collapsible", title: "附录：一个更容易看懂的证明", blocks: [
    { type: "text", content: "说明：这一段给数学老师、数学爱好者，以及想深挖的同学。欢迎转给他们——这套记号常常让有经验的老师也眼前一亮，这个证明也很适合拿来讨论。" },
    { type: "text", content: "维基百科有“[嵌套根式](https://en.wikipedia.org/wiki/Nested_radical)”条目——根号里还套着根号的那种式子。那一页整体很难，我们只取其中一个很小的角落，尽量保持简单。" },
    { type: "formula", lines: ["√(3 + 2√2) = 1 + √2"], label: "维基百科会说：这两边“并不显然”相等" },
    { type: "text", content: "用学校写法证明，往往要先背一堆关于根号的技巧。换成我们的记号，它更像一道拼图。我们只需要一件你很可能已经会的东西：" },
    { type: "formula", lines: ["(a + b) ↑ 2 = a ↑ 2 + 2 × a × b + b ↑ 2"], label: "和的平方公式，在任何记号里都成立" },

    { type: "heading3", content: "翻译成我们的记号" },
    { type: "text", content: "平方根写成 ↓2。两边逐段翻译。" },
    { type: "text", content: "右边简单：1 + √2。只要把 √2 翻译掉：" },
    { type: "formula", lines: ["√2  →  2 ↓ 2"], label: "读作“2 下 2”：第一个 2 是被开方数，第二个 2 表示平方根" },
    { type: "text", content: "所以右边变成：1 + 2 ↓ 2。" },
    { type: "text", content: "左边是 √(3 + 2√2)：整体是一个根号，里面又夹着另一个根号。从内往外翻：" },
    { type: "formula", lines: [
      "最内层 √2               →  2 ↓ 2",
      "2 × √2                 →  2 × (2 ↓ 2)",
      "3 + 2 × √2             →  3 + 2 × (2 ↓ 2)",
      "√(3 + 2 × √2)          →  (3 + 2 × (2 ↓ 2)) ↓ 2",
    ], label: "最外层的 √ 最后变成 ↓2——对根号里的整体开平方" },
    { type: "formula", lines: [
      "左边:   (3 + 2 × (2 ↓ 2)) ↓ 2",
      "右边:   1 + 2 ↓ 2",
    ], label: "要证：左边 = 右边" },

    { type: "heading3", content: "思路" },
    { type: "text", content: "左边是“(某式) ↓ 2”，意思是“根号里面的东西再开平方”。里面的某式是 3 + 2 × (2 ↓ 2)。" },
    { type: "text", content: "如果我们把右边平方（↑2），正好得到 3 + 2 × (2 ↓ 2)，那就说明左右相等。为什么？因为 ↑2 与 ↓2 互为逆运算，会互相抵消。" },

    { type: "heading3", content: "逐步计算" },
    { type: "text", content: "先把右边平方：" },
    { type: "formula", lines: ["(1 + 2 ↓ 2) ↑ 2"], label: "用和的平方公式，a = 1，b = 2 ↓ 2" },
    { type: "try", expr: "(1+2↓2)↑2" },
    { type: "text", content: "展开后得到三块：" },
    { type: "formula", lines: ["1 ↑ 2 + 2 × (2 ↓ 2) + (2 ↓ 2) ↑ 2"], label: "a ↑ 2 + 2 × a × b + b ↑ 2" },
    { type: "try", expr: "1↑2+2×(2↓2)+(2↓2)↑2" },
    { type: "text", content: "关键看最后一项 (2 ↓ 2) ↑ 2：先 ↓ 再 ↑，同一个 2——互逆，抵消！所以 (2 ↓ 2) ↑ 2 = 2。又 1 ↑ 2 = 1。于是：" },
    { type: "formula", lines: ["1 + 2 × (2 ↓ 2) + 2"], label: "逆运算抵消：(2 ↓ 2) ↑ 2 变成 2" },
    { type: "try", expr: "1+2×(2↓2)+2" },
    { type: "text", content: "整理 1 + 2 = 3：" },
    { type: "formula", lines: ["3 + 2 × (2 ↓ 2)"], label: "这正是左边 ↓2 根号里的内容" },
    { type: "try", expr: "3+2×(2↓2)" },
    { type: "text", content: "右边平方后，正好等于左边根号里的部分。因此：" },
    { type: "formula", lines: ["(3 + 2 × (2 ↓ 2)) ↓ 2 = 1 + 2 ↓ 2  ✓"], label: "两边相等，证毕" },
    { type: "try", expr: "(3+2×(2↓2))↓2" },

    { type: "heading3", content: "为什么这很重要" },
    { type: "text", content: "整段证明最关键的一步，是看出 (2 ↓ 2) ↑ 2 = 2：↓ 与 ↑ 互消。学校写法会写成 (√2)² = 2——你能从符号上“看见”互消吗？√ 和 ² 长得不像。但 ↓ 和 ↑？同一支箭头，方向相反，互消就在眼前。" },
    { type: "text", content: "这也是全文的主旨：更好的记号不只是好看，而是让难事变容易看见。" },
    { type: "text", content: "好了，你们都可以坐下了。" },
  ] },

  { type: "heading", content: "这种写法来自哪里" },
  { type: "text", content: "这套记号由阿姆斯特丹 CWI 的计算机科学家 Steven Pemberton 发展出来。他的《Numbers》从最基础开始——用木棍数数——一路搭到加法、乘法、幂，并说明每一层都重复同一种结构。记号不是随意画的，而是为了让这个结构显形。" },
  { type: "text", content: "如果这套写法让你豁然开朗，或者你想把它分享给同学、老师，Steven Pemberton 的完整著作可以在这里下载：[Numbers（PDF）](https://homepages.cwi.nl/~steven/Talks/2019/11-21-dijkstra/Numbers.pdf)。" },
];

/* ── Page ── */

const heroEn = {
  title: "Why Powers, Roots, and Logarithms Are Really the Same Pattern",
  byline: "An interactive article about powers, roots, and logarithms — and why they're secretly the same thing",
  audience: "For students, teachers, and the simply curious. No prior knowledge of logarithms needed — if you can do 3 + 5, you can follow this to the end.",
  time: "15 min read",
};
const heroNl = {
  title: "Waarom machten, wortels en logaritmen eigenlijk hetzelfde patroon zijn",
  byline: "Een interactief artikel over machten, wortels en logaritmen — en waarom ze stiekem hetzelfde zijn",
  audience: "Voor leerlingen, docenten en iedereen die gewoon nieuwsgierig is. Geen voorkennis van logaritmen nodig — als je 3 + 5 kunt uitrekenen, kun je dit artikel tot het einde volgen.",
  time: "15 min lezen",
};
const heroZh = {
  title: "为什么幂、根和对数里藏着同一个模式",
  byline: "一篇关于幂、根和对数的互动文章：它们其实在讲同一件事",
  audience: "给学生、老师和好奇的人。你不需要先学过对数——会算 3 + 5 就可以读到最后。",
  time: "15 分钟阅读",
};

export function InteractiveBlogPage({ initialLanguage }: { initialLanguage: Language }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    language,
    theme,
    setTheme,
    mobileCalc,
    setMobileCalc,
    fabPulsed,
    hero,
    blocks,
    toc,
  } = useInteractiveArticleModel({
    initialLanguage,
    heroEn,
    heroNl,
    heroZh,
    enBlocks: en,
    nlBlocks: nl,
    zhBlocks: zh,
  });
  const calcModel = useCalculatorModel();
  const [showLanguageCue, setShowLanguageCue] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const languageChosen = window.localStorage.getItem(LANGUAGE_CHOICE_KEY) === "1";
    if (languageChosen) return;
    const showId = window.setTimeout(() => setShowLanguageCue(true), 300);
    const timeoutId = window.setTimeout(() => {
      setShowLanguageCue(false);
    }, 2600);
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const selectLanguage = (next: Language) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      segments[0] = next;
      router.push(`/${segments.join("/")}`);
    } else {
      router.push(`/${next}`);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_CHOICE_KEY, "1");
      window.localStorage.setItem(LANGUAGE_CUE_KEY, "1");
    }
    if (showLanguageCue) {
      setShowLanguageCue(false);
    }
  };

  return (
    <article className="storyPage">
      <ProgressBar />
      <header className="storyHero">
        <div className="heroMeta">
          <span className="readMeta">{hero.time}</span>
          <div className="heroControls">
            <div className={`langToggle${showLanguageCue ? " langToggleFlash" : ""}`}>
              <button className={language === "nl" ? "primaryBtn" : "secondaryBtn"} onClick={() => selectLanguage("nl")}>NL</button>
              <button className={language === "en" ? "primaryBtn" : "secondaryBtn"} onClick={() => selectLanguage("en")}>EN</button>
              <button className={language === "zh" ? "primaryBtn" : "secondaryBtn"} onClick={() => selectLanguage("zh")}>中文</button>
            </div>
            <button
              className="themeToggle"
              onClick={() => setTheme((t) => t === "light" ? "dark" : "light")}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? "☾" : "☀"}
            </button>
          </div>
        </div>
        <h1 className="heroTitle">{mathFormat(hero.title)}</h1>
        <p className="heroDek">{hero.byline}</p>
        <p className="heroAudience">{hero.audience}</p>
        <nav className="tocNav" aria-label="Table of contents">
          {toc.map((item, i) => (
            <a key={item.id} href={`#${item.id}`} className="tocChip"
              style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
              <span className="tocChipNum">{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <div className="storyBody">
        <div className="storyArticle">
          {blocks.map((block, i) => (
            <RevealBlock key={i}>
              <RenderBlock block={block} lang={language} />
            </RevealBlock>
          ))}
        </div>
        <aside className="storySidebar">
          <div className="stickyCalc">
            <FullCalc lang={language} model={calcModel} />
          </div>
        </aside>
      </div>
      <button
        className={`calcFab${fabPulsed && !mobileCalc ? " calcFabPulse" : ""}`}
        onClick={() => setMobileCalc((s) => !s)}
        aria-label="Calculator"
      >
        {mobileCalc ? "✕" : "⌘"}
      </button>
      <div className={`calcDrawer${mobileCalc ? " calcDrawerOpen" : ""}`}>
        <FullCalc lang={language} model={calcModel} />
      </div>
    </article>
  );
}
