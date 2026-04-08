"use client";
import { useCallback, useRef, useState } from "react";
import type { Language } from "./types";

export function InterestChart({ lang }: { lang: Language }) {
  const years = Array.from({ length: 26 }, (_, i) => i);
  const amounts = years.map((y) => 100 * 1.03 ** y);
  const w = 520,
    h = 240,
    pL = 50,
    pR = 15,
    pT = 20,
    pB = 35;
  const plotW = w - pL - pR;
  const plotH = h - pT - pB;
  const maxA = 220;
  const x = (yr: number) => pL + (yr / 25) * plotW;
  const y = (a: number) => pT + plotH - ((a - 80) / (maxA - 80)) * plotH;

  const line = years
    .map((yr, i) => `${i === 0 ? "M" : "L"}${x(yr)},${y(amounts[i])}`)
    .join(" ");
  const area = `${line} L${x(25)},${y(80)} L${x(0)},${y(80)} Z`;

  const doubleYr = Math.log(2) / Math.log(1.03);

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={lang === "en" ? "Growth of 100 euros at 3% interest over 25 years" : "Groei van 100 euro bij 3% rente over 25 jaar"}>
        <path d={area} fill="var(--accent-light)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <line x1={pL} y1={y(80)} x2={pL + plotW} y2={y(80)} stroke="var(--border)" />
        <line x1={pL} y1={pT} x2={pL} y2={y(80)} stroke="var(--border)" />
        {[0, 5, 10, 15, 20, 25].map((yr) => (
          <text key={yr} x={x(yr)} y={h - 10} textAnchor="middle" fontSize="12" fill="#78716c">{yr}</text>
        ))}
        {[100, 150, 200].map((a) => (
          <g key={a}>
            <line x1={pL} y1={y(a)} x2={pL + plotW} y2={y(a)} stroke="var(--border)" strokeDasharray={a === 200 ? "none" : "3,3"} strokeWidth={a === 200 ? 1.5 : 0.5} />
            <text x={pL - 6} y={y(a) + 4} textAnchor="end" fontSize="12" fill="#78716c">€{a}</text>
          </g>
        ))}
        <line x1={pL} y1={y(200)} x2={pL + plotW} y2={y(200)} stroke="#e11d48" strokeDasharray="5,4" strokeWidth="1.5" />
        <circle cx={x(doubleYr)} cy={y(200)} r="5" fill="#e11d48" />
        <text x={x(doubleYr)} y={y(200) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#e11d48">
          ≈ {Math.round(doubleYr)} {lang === "en" ? "years" : "jaar"}
        </text>
        <circle cx={x(0)} cy={y(100)} r="4" fill="var(--accent)" />
        <text x={pL + plotW / 2} y={h - 0} textAnchor="middle" fontSize="12" fill="#78716c">
          {lang === "en" ? "years →" : "jaren →"}
        </text>
      </svg>
      <p className="vizCaption muted">
        {lang === "en"
          ? "€100 at 3% interest. The money doubles after about 23 years."
          : "€100 bij 3% rente. Het geld verdubbelt na ongeveer 23 jaar."}
      </p>
    </div>
  );
}

export function RepeatedMultViz({ lang }: { lang: Language }) {
  const n = 13;
  const w = 520, h = 80, padX = 35;
  const dotY = 25;
  const sp = (w - 2 * padX) / 12;
  const en = lang === "en";

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={en ? "r multiplied 12 times equals 2" : "r 12 keer vermenigvuldigd is 2"}>
        <line x1={padX} y1={dotY} x2={w - padX} y2={dotY} stroke="var(--border)" strokeWidth="2" />
        {Array.from({ length: n }, (_, i) => {
          const x = padX + i * sp;
          const isEnd = i === 0 || i === 12;
          return (
            <circle key={i} cx={x} cy={dotY} r={isEnd ? 7 : 3.5}
              fill={isEnd ? "var(--accent)" : "#a8a29e"} />
          );
        })}
        {[0, 1, 2].map((i) => (
          <text key={i} x={padX + i * sp + sp / 2} y={dotY - 10} textAnchor="middle" fontSize="10" fill="var(--accent)" fontWeight="600">×r</text>
        ))}
        <text x={padX + 5 * sp + sp / 2} y={dotY - 10} textAnchor="middle" fontSize="13" fill="#a8a29e">···</text>
        {[10, 11].map((i) => (
          <text key={i} x={padX + i * sp + sp / 2} y={dotY - 10} textAnchor="middle" fontSize="10" fill="var(--accent)" fontWeight="600">×r</text>
        ))}
        <text x={padX} y={dotY + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">1</text>
        <text x={w - padX} y={dotY + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">2</text>
        <line x1={padX + 12} y1={dotY + 35} x2={w - padX - 12} y2={dotY + 35} stroke="var(--accent)" strokeWidth="1.5" />
        <line x1={padX + 12} y1={dotY + 31} x2={padX + 12} y2={dotY + 35} stroke="var(--accent)" strokeWidth="1.5" />
        <line x1={w - padX - 12} y1={dotY + 31} x2={w - padX - 12} y2={dotY + 35} stroke="var(--accent)" strokeWidth="1.5" />
        <text x={w / 2} y={dotY + 50} textAnchor="middle" fontSize="11" fill="var(--accent)" fontWeight="600">
          {en ? "12 × multiply by r  =  ×2" : "12 × vermenigvuldigen met r  =  ×2"}
        </text>
      </svg>
    </div>
  );
}

export function PianoChainViz({ lang }: { lang: Language }) {
  const n = 13;
  const w = 520, h = 105, padX = 35;
  const dotY = 30;
  const sp = (w - 2 * padX) / 12;

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={lang === "en" ? "12 steps of ×r from C4 to C5" : "12 stappen van ×r van C4 naar C5"}>
        <line x1={padX} y1={dotY} x2={w - padX} y2={dotY} stroke="var(--border)" strokeWidth="2" />
        {Array.from({ length: n }, (_, i) => {
          const x = padX + i * sp;
          const isEnd = i === 0 || i === 12;
          return (
            <circle key={i} cx={x} cy={dotY} r={isEnd ? 7 : 3.5}
              fill={isEnd ? "var(--accent)" : "#a8a29e"} />
          );
        })}
        {[0, 1, 2].map((i) => (
          <text key={i} x={padX + i * sp + sp / 2} y={dotY - 12} textAnchor="middle" fontSize="10" fill="var(--accent)" fontWeight="600">×r</text>
        ))}
        <text x={padX + 5 * sp + sp / 2} y={dotY - 12} textAnchor="middle" fontSize="13" fill="#a8a29e">···</text>
        {[10, 11].map((i) => (
          <text key={i} x={padX + i * sp + sp / 2} y={dotY - 12} textAnchor="middle" fontSize="10" fill="var(--accent)" fontWeight="600">×r</text>
        ))}
        <text x={padX} y={dotY + 20} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--foreground)">C₄</text>
        <text x={padX} y={dotY + 33} textAnchor="middle" fontSize="10" fill="#78716c">262 Hz</text>
        <text x={w - padX} y={dotY + 20} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--foreground)">C₅</text>
        <text x={w - padX} y={dotY + 33} textAnchor="middle" fontSize="10" fill="#78716c">524 Hz</text>
        <line x1={padX + 12} y1={dotY + 48} x2={w - padX - 12} y2={dotY + 48} stroke="var(--accent)" strokeWidth="1.5" />
        <line x1={padX + 12} y1={dotY + 44} x2={padX + 12} y2={dotY + 48} stroke="var(--accent)" strokeWidth="1.5" />
        <line x1={w - padX - 12} y1={dotY + 44} x2={w - padX - 12} y2={dotY + 48} stroke="var(--accent)" strokeWidth="1.5" />
        <text x={w / 2} y={dotY + 62} textAnchor="middle" fontSize="11" fill="var(--accent)" fontWeight="600">
          {lang === "en" ? "12 steps of ×r  =  ×2 (one octave)" : "12 stappen van ×r  =  ×2 (één octaaf)"}
        </text>
      </svg>
    </div>
  );
}

export function PianoFreqViz({ lang }: { lang: Language }) {
  const factor = 2 ** (1 / 12);
  const baseFreq = 261.63;
  const names = ["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B","C"];
  const freqs = names.map((_, i) => baseFreq * factor ** i);
  const w = 520, h = 200, pL = 15, pR = 15, pT = 10, pB = 45;
  const barW = (w - pL - pR - 12 * 4) / 13;
  const maxH = h - pT - pB;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeRef = useRef<number | null>(null);

  const playTone = useCallback((freq: number, index: number) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
    setTimeout(() => {
      if (activeRef.current === index) activeRef.current = null;
    }, 300);
  }, []);

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={lang === "en" ? "Piano octave frequencies — click a bar to hear the note" : "Piano-octaaf frequenties — klik op een balk om de noot te horen"}>
        {freqs.map((freq, i) => {
          const barH = 30 + (i / 12) * (maxH - 30);
          const xPos = pL + i * (barW + 4);
          const isSharp = names[i].includes("♯");
          return (
            <g key={i} className="pianoBar" onClick={() => playTone(freq, i)} style={{ cursor: "pointer" }}>
              <rect x={xPos} y={pT + maxH - barH} width={barW} height={barH}
                fill={isSharp ? "#1e293b" : "var(--accent)"} opacity={isSharp ? 0.8 : 0.15 + 0.06 * i}
                stroke="var(--accent)" strokeWidth="1" rx="3" />
              <text x={xPos + barW / 2} y={pT + maxH + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)">{names[i]}</text>
              <text x={xPos + barW / 2} y={pT + maxH + 30} textAnchor="middle" fontSize="9" fill="#78716c">{Math.round(freq)}</text>
            </g>
          );
        })}
        <text x={w / 2} y={h - 2} textAnchor="middle" fontSize="11" fill="#78716c">
          {lang === "en"
            ? "Click a bar to hear the note — each is ×1.0595 higher in pitch"
            : "Klik op een balk om de noot te horen — elke is ×1.0595 hoger"}
        </text>
      </svg>
    </div>
  );
}

export function EarthquakeViz({ lang }: { lang: Language }) {
  const mags = [
    { m: "5.0", e: 1 },
    { m: "5.2", e: 2 },
    { m: "5.4", e: 4 },
    { m: "5.6", e: 8 },
    { m: "5.8", e: 16 },
    { m: "6.0", e: 32 },
  ];
  const w = 520, h = 230, pL = 40, pR = 20, pT = 15, pB = 45;
  const plotH = h - pT - pB;
  const barW = (w - pL - pR - 5 * 16) / 6;
  const maxE = 32;
  const wrapRef = useRef<HTMLDivElement>(null);

  const triggerShake = useCallback((intensity: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const article = el.closest(".storyArticle") || el.parentElement;
    if (!article) return;
    const px = 2 + intensity * 1.5;
    const dur = 300 + intensity * 60;
    const steps = Math.ceil(dur / 25);
    let step = 0;
    const target = article as HTMLElement;
    const original = target.style.transform;
    const shake = () => {
      if (step >= steps) {
        target.style.transform = original;
        return;
      }
      const progress = step / steps;
      const decay = 1 - progress * progress;
      const dx = (Math.random() - 0.5) * 2 * px * decay;
      const dy = (Math.random() - 0.5) * 2 * px * decay;
      const rot = (Math.random() - 0.5) * 0.4 * (intensity / 32) * decay;
      target.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      step++;
      requestAnimationFrame(shake);
    };
    requestAnimationFrame(shake);
  }, []);

  return (
    <div className="vizWrap" ref={wrapRef}>
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={lang === "en" ? "Earthquake energy comparison — click a bar to feel the quake" : "Aardbevingsenergie vergelijking — klik op een balk om de beving te voelen"}>
        {mags.map(({ m, e }, i) => {
          const barH = Math.max(4, (e / maxE) * plotH);
          const xPos = pL + i * (barW + 16);
          return (
            <g key={m} style={{ cursor: "pointer" }} onClick={() => triggerShake(e)}>
              <rect
                x={xPos} y={pT + plotH - barH} width={barW} height={barH}
                fill="var(--accent)" opacity={0.3 + 0.14 * i} rx="3"
              />
              <text x={xPos + barW / 2} y={pT + plotH - barH - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)">
                {e}×
              </text>
              <text x={xPos + barW / 2} y={pT + plotH + 16} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)">
                M {m}
              </text>
              {i < mags.length - 1 && (
                <text x={xPos + barW + 8} y={pT + plotH - barH / 2} textAnchor="middle" fontSize="10" fill="#e11d48" fontWeight="600">
                  ×2
                </text>
              )}
            </g>
          );
        })}
        <line x1={pL} y1={pT + plotH} x2={w - pR} y2={pT + plotH} stroke="var(--border)" />
        <text x={w / 2} y={h - 5} textAnchor="middle" fontSize="11" fill="#78716c">
          {lang === "en"
            ? "Click a bar to feel the quake — each +0.2 = double the energy"
            : "Klik op een balk om de beving te voelen — elke +0.2 = dubbele energie"}
        </text>
      </svg>
    </div>
  );
}

type SavingsUnknown = "m" | "r" | "n";

export function SavingsExplorer({ lang }: { lang: Language }) {
  const en = lang === "en";
  const [unknown, setUnknown] = useState<SavingsUnknown>("m");
  const [startAmount, setStartAmount] = useState(100);
  const [ratePercent, setRatePercent] = useState(3);
  const [years, setYears] = useState(10);
  const [goal, setGoal] = useState(1000);

  const r = 1 + ratePercent / 100;

  let solvedM = startAmount;
  let solvedR = ratePercent;
  let solvedN = years;
  let formula = "";

  if (unknown === "m") {
    solvedM = goal / r ** years;
    formula = `m = ${goal} ÷ ${r.toFixed(2)} ↑ ${years} = ${solvedM.toFixed(0)}`;
  } else if (unknown === "r") {
    const factor = (goal / startAmount) ** (1 / years);
    solvedR = (factor - 1) * 100;
    const ratio = (goal / startAmount).toFixed(1);
    formula = `${ratio} ↓ ${years} = ${factor.toFixed(4)} → r = ${solvedR >= 0 ? "+" : ""}${solvedR.toFixed(1)}%`;
  } else {
    solvedN = Math.log(goal / startAmount) / Math.log(r);
    const ratio = (goal / startAmount).toFixed(1);
    formula = `n = ${ratio} ⇓ ${r.toFixed(2)} = ${solvedN.toFixed(1)}`;
  }

  const effectiveM = unknown === "m" ? solvedM : startAmount;
  const effectiveR = unknown === "r" ? 1 + solvedR / 100 : r;
  const effectiveN = unknown === "n" ? Math.ceil(solvedN) : years;
  const maxYear = Math.min(effectiveN, 50);
  const yearData = Array.from({ length: maxYear + 1 }, (_, i) => effectiveM * effectiveR ** i);
  const maxVal = Math.max(goal, ...yearData) * 1.1;

  return (
    <div className="savingsExplorer">
      <div className="savingsControls">
        <div className="savingsRow">
          <span className="savingsLabel">{en ? "Goal (€)" : "Doel (€)"}</span>
          <input type="range" min={200} max={5000} step={50} value={goal}
            onChange={(e) => setGoal(+e.target.value)} className="savingsSlider" />
          <span className="savingsValue">€{goal}</span>
        </div>

        <div className={`savingsRow${unknown === "m" ? " savingsUnknown" : ""}`}>
          <button className={`savingsToggle${unknown === "m" ? " savingsToggleActive" : ""}`}
            onClick={() => setUnknown("m")} title={en ? "Solve for start amount" : "Los startbedrag op"}>
            m
          </button>
          {unknown === "m"
            ? <span className="savingsAnswer">= €{solvedM.toFixed(0)}</span>
            : <>
                <input type="range" min={10} max={2000} step={10} value={startAmount}
                  onChange={(e) => setStartAmount(+e.target.value)} className="savingsSlider" />
                <span className="savingsValue">€{startAmount}</span>
              </>
          }
        </div>

        <div className={`savingsRow${unknown === "r" ? " savingsUnknown" : ""}`}>
          <button className={`savingsToggle${unknown === "r" ? " savingsToggleActive" : ""}`}
            onClick={() => setUnknown("r")} title={en ? "Solve for interest rate" : "Los rente op"}>
            r
          </button>
          {unknown === "r"
            ? <span className="savingsAnswer">= {solvedR.toFixed(2)}%</span>
            : <>
                <input type="range" min={0.5} max={15} step={0.1} value={ratePercent}
                  onChange={(e) => setRatePercent(+e.target.value)} className="savingsSlider" />
                <span className="savingsValue">{ratePercent}%</span>
              </>
          }
        </div>

        <div className={`savingsRow${unknown === "n" ? " savingsUnknown" : ""}`}>
          <button className={`savingsToggle${unknown === "n" ? " savingsToggleActive" : ""}`}
            onClick={() => setUnknown("n")} title={en ? "Solve for years" : "Los jaren op"}>
            n
          </button>
          {unknown === "n"
            ? <span className="savingsAnswer">= {solvedN.toFixed(1)} {en ? "years" : "jaar"}</span>
            : <>
                <input type="range" min={1} max={50} step={1} value={years}
                  onChange={(e) => setYears(+e.target.value)} className="savingsSlider" />
                <span className="savingsValue">{years} {en ? "yr" : "jr"}</span>
              </>
          }
        </div>
      </div>

      <div className="savingsFormula">
        <code>{formula}</code>
        <span className="savingsOperatorHint">
          {unknown === "m" && (en ? "division undoes multiplication" : "delen is de inverse van vermenigvuldigen")}
          {unknown === "r" && (en ? "↓ gives the factor, then subtract 1 for the rate" : "↓ geeft de factor, dan −1 voor het percentage")}
          {unknown === "n" && (en ? "⇓ finds the right side of ↑" : "⇓ vindt de rechterkant van ↑")}
        </span>
      </div>

      <svg viewBox="0 0 480 120" className="vizSvg savingsChart">
        {yearData.map((val, i) => {
          const barH = Math.max(2, (val / maxVal) * 90);
          const barW = Math.max(2, Math.min(16, 400 / (maxYear + 1) - 2));
          const xPos = 40 + i * (400 / (maxYear + 1));
          const atGoal = val >= goal;
          return (
            <g key={i}>
              <rect x={xPos} y={100 - barH} width={barW} height={barH}
                fill={atGoal ? "#22c55e" : "var(--accent)"} opacity={atGoal ? 0.9 : 0.3 + 0.5 * (val / maxVal)} rx="2" />
              {(i === 0 || i === maxYear || (maxYear <= 25 && i % 5 === 0) || (maxYear > 25 && i % 10 === 0)) && (
                <text x={xPos + barW / 2} y={115} textAnchor="middle" fontSize="8" fill="var(--muted-text)">{i}</text>
              )}
            </g>
          );
        })}
        <line x1={40} y1={100 - (goal / maxVal) * 90} x2={440} y2={100 - (goal / maxVal) * 90}
          stroke="#22c55e" strokeDasharray="4,3" strokeWidth="1.2" />
        <text x={36} y={100 - (goal / maxVal) * 90 + 3} textAnchor="end" fontSize="8" fill="#22c55e" fontWeight="600">€{goal}</text>
        <text x={240} y={10} textAnchor="middle" fontSize="9" fill="var(--muted-text)">
          {en ? "Click m, r, or n to change what you're solving for" : "Klik m, r of n om te kiezen wat je zoekt"}
        </text>
      </svg>
    </div>
  );
}
