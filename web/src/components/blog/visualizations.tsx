"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "./types";

const R = (v: number) => Math.round(v * 100) / 100;

export function InterestChart({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
  const currencySymbol = en ? "$" : zh ? "¥" : "€";
  const principal = zh ? 1000 : 100;
  const years = Array.from({ length: 26 }, (_, i) => i);
  const amounts = years.map((y) => principal * 1.03 ** y);
  const w = 520,
    h = 240,
    pL = 50,
    pR = 15,
    pT = 20,
    pB = 35;
  const plotW = w - pL - pR;
  const plotH = h - pT - pB;
  const minA = principal * 0.8;
  const maxA = principal * 2.2;
  const x = (yr: number) => R(pL + (yr / 25) * plotW);
  const y = (a: number) => R(pT + plotH - ((a - minA) / (maxA - minA)) * plotH);

  const line = years
    .map((yr, i) => `${i === 0 ? "M" : "L"}${x(yr)},${y(amounts[i])}`)
    .join(" ");
  const area = `${line} L${x(25)},${y(minA)} L${x(0)},${y(minA)} Z`;

  const doubleYr = Math.log(2) / Math.log(1.03);

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={en ? "Growth of 100 euros at 3% interest over 25 years" : zh ? "100 欧元在 3% 利率下 25 年的增长" : "Groei van 100 euro bij 3% rente over 25 jaar"}>
        <path d={area} fill="var(--accent-light)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <line x1={pL} y1={y(minA)} x2={pL + plotW} y2={y(minA)} stroke="var(--border)" />
        <line x1={pL} y1={pT} x2={pL} y2={y(minA)} stroke="var(--border)" />
        {[0, 5, 10, 15, 20, 25].map((yr) => (
          <text key={yr} x={x(yr)} y={h - 10} textAnchor="middle" fontSize="12" fill="#78716c">{yr}</text>
        ))}
        {[principal, principal * 1.5, principal * 2].map((a) => (
          <g key={a}>
            <line x1={pL} y1={y(a)} x2={pL + plotW} y2={y(a)} stroke="var(--border)" strokeDasharray={a === principal * 2 ? "none" : "3,3"} strokeWidth={a === principal * 2 ? 1.5 : 0.5} />
            <text x={pL - 6} y={y(a) + 4} textAnchor="end" fontSize="12" fill="#78716c">{currencySymbol}{a}</text>
          </g>
        ))}
        <line x1={pL} y1={y(principal * 2)} x2={pL + plotW} y2={y(principal * 2)} stroke="#e11d48" strokeDasharray="5,4" strokeWidth="1.5" />
        <circle cx={x(doubleYr)} cy={y(principal * 2)} r="5" fill="#e11d48" />
        <text x={x(doubleYr)} y={y(principal * 2) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#e11d48">
          ≈ {Math.round(doubleYr)} {en ? "years" : zh ? "年" : "jaar"}
        </text>
        <circle cx={x(0)} cy={y(principal)} r="4" fill="var(--accent)" />
        <text x={pL + plotW / 2} y={h - 0} textAnchor="middle" fontSize="12" fill="#78716c">
          {en ? "years →" : zh ? "年 →" : "jaren →"}
        </text>
      </svg>
      <p className="vizCaption muted">
        {en
          ? "$100 at 3% interest. The money doubles after about 23 years."
          : zh
            ? "¥1000，年利率 3%。大约 23 年后翻倍。"
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
  const zh = lang === "zh";

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={en ? "r multiplied 12 times equals 2" : zh ? "r 连乘 12 次等于 2" : "r 12 keer vermenigvuldigd is 2"}>
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
          {en ? "12 × multiply by r  =  ×2" : zh ? "12 次 ×r  =  ×2" : "12 × vermenigvuldigen met r  =  ×2"}
        </text>
      </svg>
    </div>
  );
}

export function PianoChainViz({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
  const n = 13;
  const w = 520, h = 105, padX = 35;
  const dotY = 30;
  const sp = (w - 2 * padX) / 12;

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={en ? "12 steps of ×r from C4 to C5" : zh ? "从 C4 到 C5：12 步 ×r" : "12 stappen van ×r van C4 naar C5"}>
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
          {en ? "12 steps of ×r  =  ×2 (one octave)" : zh ? "12 步 ×r  =  ×2（一个八度）" : "12 stappen van ×r  =  ×2 (één octaaf)"}
        </text>
      </svg>
    </div>
  );
}

export function PianoFreqViz({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
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
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={en ? "Piano octave frequencies — click a bar to hear the note" : zh ? "钢琴八度频率图——点击柱子听音符" : "Piano-octaaf frequenties — klik op een balk om de noot te horen"}>
        {freqs.map((freq, i) => {
          const barH = 30 + (i / 12) * (maxH - 30);
          const xPos = pL + i * (barW + 4);
          const isSharp = names[i].includes("♯");
          return (
            <g key={i} className="pianoBar" onClick={() => playTone(freq, i)} style={{ cursor: "pointer" }}>
              <rect x={R(xPos)} y={R(pT + maxH - barH)} width={R(barW)} height={R(barH)}
                fill={isSharp ? "#1e293b" : "var(--accent)"} opacity={R(isSharp ? 0.8 : 0.15 + 0.06 * i)}
                stroke="var(--accent)" strokeWidth="1" rx="3" />
              <text x={xPos + barW / 2} y={pT + maxH + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)">{names[i]}</text>
              <text x={xPos + barW / 2} y={pT + maxH + 30} textAnchor="middle" fontSize="9" fill="#78716c">{Math.round(freq)}</text>
            </g>
          );
        })}
        <text x={w / 2} y={h - 2} textAnchor="middle" fontSize="11" fill="#78716c">
          {en
            ? "Click a bar to hear the note — each is ×1.0595 higher in pitch"
            : zh
              ? "点击柱子听音符——每个音都比前一个高 ×1.0595"
              : "Klik op een balk om de noot te horen — elke is ×1.0595 hoger"}
        </text>
      </svg>
    </div>
  );
}

export function EarthquakeViz({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
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
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playRumble = useCallback((intensity: number) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    const dur = 0.3 + (intensity / 32) * 1.5;
    const noiseVol = Math.min(0.95, 0.35 + (intensity / 16) * 0.3);
    const toneVol = Math.min(0.32, 0.1 + (intensity / 32) * 0.2);

    const bufSize = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const t = i / bufSize;
      const decay = 1 - t * t;
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    // Keep more mid/upper rumble so laptop speakers still reproduce it.
    lp.frequency.value = 260 + (intensity / 32) * 900;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(noiseVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    // Extra low-mid tone to make quakes clearly audible.
    const tone = ctx.createOscillator();
    tone.type = "triangle";
    tone.frequency.value = 140 + (intensity / 32) * 90;
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(toneVol, ctx.currentTime);
    toneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur * 0.85);
    src.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    tone.connect(toneGain);
    toneGain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + dur);
    tone.start();
    tone.stop(ctx.currentTime + dur * 0.85);
  }, []);

  const triggerShake = useCallback((intensity: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const article = el.closest(".storyArticle") || el.parentElement;
    if (!article) return;
    playRumble(intensity);
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
  }, [playRumble]);

  return (
    <div className="vizWrap" ref={wrapRef}>
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={en ? "Earthquake energy comparison — click a bar to feel the quake" : zh ? "地震能量对比图——点击柱子感受震动" : "Aardbevingsenergie vergelijking — klik op een balk om de beving te voelen"}>
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
          {en
            ? "Click a bar to feel the quake — each +0.2 = double the energy"
            : zh
              ? "点击柱子感受地震——每 +0.2 级，能量翻倍"
              : "Klik op een balk om de beving te voelen — elke +0.2 = dubbele energie"}
        </text>
      </svg>
    </div>
  );
}

type SavingsUnknown = "m" | "r" | "n";

export function SavingsExplorer({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
  const locale = en ? "en-US" : zh ? "zh-CN" : "nl-NL";
  const currencySymbol = en ? "$" : zh ? "¥" : "€";
  const goalMin = zh ? 1000 : 200;
  const goalMax = zh ? 50000 : 5000;
  const goalStep = zh ? 500 : 50;
  const startMin = zh ? 100 : 10;
  const startMax = zh ? 20000 : 2000;
  const startStep = zh ? 50 : 10;
  const [unknown, setUnknown] = useState<SavingsUnknown>("m");
  const [startAmount, setStartAmount] = useState(zh ? 1000 : 100);
  const [ratePercent, setRatePercent] = useState(3);
  const [years, setYears] = useState(10);
  const [goal, setGoal] = useState(zh ? 10000 : 1000);
  const [formulaPulse, setFormulaPulse] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fmtInt = useCallback(
    (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value)),
    [locale],
  );
  const fmt1 = useCallback(
    (value: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value),
    [locale],
  );
  const fmt2 = useCallback(
    (value: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    [locale],
  );
  const fmt4 = useCallback(
    (value: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(value),
    [locale],
  );

  useEffect(() => {
    if (zh) {
      setStartAmount(1000);
      setGoal(10000);
    } else {
      setStartAmount(100);
      setGoal(1000);
    }
  }, [zh]);

  const triggerPulse = useCallback(() => {
    setFormulaPulse(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setFormulaPulse(false), 400);
  }, []);

  const r = 1 + ratePercent / 100;

  let solvedM = startAmount;
  let solvedR = ratePercent;
  let solvedN = years;
  let formula = "";

  if (unknown === "m") {
    solvedM = goal / r ** years;
    formula = `m = ${fmtInt(goal)} ÷ ${fmt2(r)} ↑ ${years} = ${fmtInt(solvedM)}`;
  } else if (unknown === "r") {
    const factor = (goal / startAmount) ** (1 / years);
    solvedR = (factor - 1) * 100;
    const ratio = fmt1(goal / startAmount);
    formula = `${ratio} ↓ ${years} = ${fmt4(factor)} → r = ${solvedR >= 0 ? "+" : ""}${fmt1(solvedR)}%`;
  } else {
    solvedN = Math.log(goal / startAmount) / Math.log(r);
    const ratio = fmt1(goal / startAmount);
    formula = `n = ${ratio} ⇓ ${fmt2(r)} = ${fmt1(solvedN)}`;
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
          <span className="savingsLabel">{en ? "Goal ($)" : zh ? "目标（元）" : "Doel (€)"}</span>
          <input type="range" min={goalMin} max={goalMax} step={goalStep} value={goal}
            onChange={(e) => { setGoal(+e.target.value); triggerPulse(); }} className="savingsSlider" />
          <span className="savingsValue">{currencySymbol}{fmtInt(goal)}</span>
        </div>

        <div className={`savingsRow${unknown === "m" ? " savingsUnknown" : ""}`}>
          <button className={`savingsToggle${unknown === "m" ? " savingsToggleActive" : ""}`}
            onClick={() => setUnknown("m")} title={en ? "Solve for start amount" : zh ? "求起始金额" : "Los startbedrag op"}>
            m
          </button>
          {unknown === "m"
            ? <span className="savingsAnswer">= {currencySymbol}{fmtInt(solvedM)}</span>
            : <>
                <input type="range" min={startMin} max={startMax} step={startStep} value={startAmount}
                  onChange={(e) => { setStartAmount(+e.target.value); triggerPulse(); }} className="savingsSlider" />
                <span className="savingsValue">{currencySymbol}{fmtInt(startAmount)}</span>
              </>
          }
        </div>

        <div className={`savingsRow${unknown === "r" ? " savingsUnknown" : ""}`}>
          <button className={`savingsToggle${unknown === "r" ? " savingsToggleActive" : ""}`}
            onClick={() => setUnknown("r")} title={en ? "Solve for interest rate" : zh ? "求利率" : "Los rente op"}>
            r
          </button>
          {unknown === "r"
            ? <span className="savingsAnswer">= {fmt2(solvedR)}%</span>
            : <>
                <input type="range" min={0.5} max={15} step={0.1} value={ratePercent}
                  onChange={(e) => { setRatePercent(+e.target.value); triggerPulse(); }} className="savingsSlider" />
                <span className="savingsValue">{fmt1(ratePercent)}%</span>
              </>
          }
        </div>

        <div className={`savingsRow${unknown === "n" ? " savingsUnknown" : ""}`}>
          <button className={`savingsToggle${unknown === "n" ? " savingsToggleActive" : ""}`}
            onClick={() => setUnknown("n")} title={en ? "Solve for years" : zh ? "求年数" : "Los jaren op"}>
            n
          </button>
          {unknown === "n"
            ? <span className="savingsAnswer">= {fmt1(solvedN)} {en ? "years" : zh ? "年" : "jaar"}</span>
            : <>
                <input type="range" min={1} max={50} step={1} value={years}
                  onChange={(e) => { setYears(+e.target.value); triggerPulse(); }} className="savingsSlider" />
                <span className="savingsValue">{years} {en ? "yr" : zh ? "年" : "jr"}</span>
              </>
          }
        </div>
      </div>

      <div className={`savingsFormula${formulaPulse ? " savingsFormulaPulse" : ""}`}>
        <code>{formula}</code>
        <span className="savingsOperatorHint">
          {unknown === "m" && (en ? "division undoes multiplication" : zh ? "除法可以抵消乘法" : "delen is de inverse van vermenigvuldigen")}
          {unknown === "r" && (en ? "↓ gives the factor, then subtract 1 for the rate" : zh ? "↓ 先求倍率，再减 1 得到利率" : "↓ geeft de factor, dan −1 voor het percentage")}
          {unknown === "n" && (en ? "⇓ finds the right side of ↑" : zh ? "⇓ 用来找 ↑ 右边的数" : "⇓ vindt de rechterkant van ↑")}
        </span>
      </div>

      <svg viewBox="0 0 480 130" className="vizSvg savingsChart">
        {yearData.map((val, i) => {
          const barH = R(Math.max(2, (val / maxVal) * 95));
          const barW = R(Math.max(2, Math.min(16, 400 / (maxYear + 1) - 2)));
          const xPos = R(40 + i * (400 / (maxYear + 1)));
          const atGoal = val >= goal;
          const isLast = i === maxYear;
          const opacity = R(atGoal ? 0.9 : 0.3 + 0.5 * (val / maxVal));
          return (
            <g key={i}>
              <rect x={xPos} y={R(105 - barH)} width={barW} height={barH}
                fill={atGoal ? "#22c55e" : "var(--accent)"}
                opacity={opacity} rx="2"
                style={{ transition: "height 0.3s ease, y 0.3s ease" }} />
              {isLast && (
                <text x={R(xPos + barW / 2)} y={R(105 - barH - 4)} textAnchor="middle" fontSize="8" fontWeight="700"
                  fill={atGoal ? "#22c55e" : "var(--accent)"}>
                  {currencySymbol}{fmtInt(val)}
                </text>
              )}
              {(i === 0 || i === maxYear || (maxYear <= 25 && i % 5 === 0) || (maxYear > 25 && i % 10 === 0)) && (
                <text x={R(xPos + barW / 2)} y={120} textAnchor="middle" fontSize="8" fill="var(--muted-text)">{i}</text>
              )}
            </g>
          );
        })}
        <line x1={40} y1={R(105 - (goal / maxVal) * 95)} x2={440} y2={R(105 - (goal / maxVal) * 95)}
          stroke="#22c55e" strokeDasharray="4,3" strokeWidth="1.2"
          style={{ transition: "y1 0.3s ease, y2 0.3s ease" }} />
        <text x={36} y={R(105 - (goal / maxVal) * 95 + 3)} textAnchor="end" fontSize="8" fill="#22c55e" fontWeight="600">{currencySymbol}{fmtInt(goal)}</text>
        <text x={240} y={10} textAnchor="middle" fontSize="9" fill="var(--muted-text)">
          {en ? "Click m, r, or n to change what you're solving for" : zh ? "点击 m、r 或 n，选择你要解哪个量" : "Klik m, r of n om te kiezen wat je zoekt"}
        </text>
      </svg>
    </div>
  );
}
