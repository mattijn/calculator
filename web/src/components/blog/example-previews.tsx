"use client";

import { useCallback, useRef, useState } from "react";
import type { Language } from "./types";
import { triggerEarthquakeFeedback } from "./visualizations";

const R = (v: number) => Math.round(v * 100) / 100;

export function SavingsExamplePreview({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
  const principal = zh ? 1000 : 100;
  const [years, setYears] = useState(10);
  const amount = principal * 1.03 ** years;
  const w = 280;
  const h = 88;
  const pL = 8;
  const pR = 8;
  const pT = 8;
  const pB = 18;
  const plotW = w - pL - pR;
  const plotH = h - pT - pB;
  const pts = Array.from({ length: years + 1 }, (_, i) => principal * 1.03 ** i);
  const maxA = principal * 1.03 ** 25;
  const x = (i: number) => R(pL + (i / 25) * plotW);
  const y = (a: number) => R(pT + plotH - (a / maxA) * plotH);
  const line = pts.map((a, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(a)}`).join(" ");

  return (
    <div className="examplePreviewVizInner" onClick={(e) => e.stopPropagation()}>
      <svg viewBox={`0 0 ${w} ${h}`} className="examplePreviewSvg" aria-hidden="true">
        <path d={`${line} L${x(years)},${pT + plotH} L${x(0)},${pT + plotH} Z`} fill="var(--accent-light)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" />
        <circle cx={x(years)} cy={y(amount)} r="4" fill="var(--accent)" />
      </svg>
      <label className="examplePreviewControl">
        <span className="examplePreviewControlLabel">{en ? "Years" : zh ? "年数" : "Jaren"}</span>
        <input
          type="range"
          min={1}
          max={25}
          value={years}
          onChange={(e) => setYears(+e.target.value)}
          className="examplePreviewSlider"
        />
        <span className="examplePreviewControlValue">{years}</span>
      </label>
      <p className="examplePreviewHint muted">
        {en ? "Slide — watch compound growth" : zh ? "拖动滑块，看复利增长" : "Schuif — zie samengestelde groei"}
      </p>
    </div>
  );
}

export function PianoExamplePreview(_props: { lang: Language }) {
  const factor = 2 ** (1 / 12);
  const baseFreq = 261.63;
  const names = ["C", "D", "E", "F", "G", "A", "B", "C"];
  const semitones = [0, 2, 4, 5, 7, 9, 11, 12];
  const freqs = semitones.map((s) => baseFreq * factor ** s);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  return (
    <div className="examplePreviewVizInner" onClick={(e) => e.stopPropagation()}>
      <div className="examplePreviewPianoKeys">
        {names.map((name, i) => (
          <button
            key={name + i}
            type="button"
            className="examplePreviewPianoKey"
            style={{ height: `${38 + i * 7}%` }}
            onClick={() => playTone(freqs[i])}
            aria-label={name}
          >
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function EarthquakeExamplePreview(_props: { lang: Language }) {
  const bars = [
    { m: "5.0", e: 1, h: 28 },
    { m: "5.2", e: 2, h: 38 },
    { m: "5.4", e: 4, h: 52 },
    { m: "5.6", e: 8, h: 68 },
  ];
  const wrapRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerShake = useCallback((intensity: number) => {
    triggerEarthquakeFeedback(wrapRef.current, intensity, audioCtxRef);
  }, []);

  return (
    <div className="examplePreviewVizInner" ref={wrapRef} onClick={(e) => e.stopPropagation()}>
      <div className="examplePreviewQuakeBars">
        {bars.map(({ m, e, h }) => (
          <div key={m} className="examplePreviewQuakeCol">
            <button
              type="button"
              className="examplePreviewQuakeBar"
              style={{ height: h }}
              onClick={() => triggerShake(e)}
            >
              <span className="examplePreviewQuakeEnergy">{e}×</span>
            </button>
            <span className="examplePreviewQuakeMag">M{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiseaseSpreadExamplePreview({ lang }: { lang: Language }) {
  const en = lang === "en";
  const zh = lang === "zh";
  const w = 280;
  const h = 88;
  const curve = "M 12 72 C 40 70, 55 68, 75 58 S 120 22, 268 14";
  const vaxLine = 118;

  return (
    <div className="examplePreviewVizInner examplePreviewVizSoon" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} className="examplePreviewSvg">
        <line x1="8" y1="76" x2={w - 8} y2="76" stroke="var(--border)" strokeWidth="1" />
        <line x1="8" y1="12" x2="8" y2="76" stroke="var(--border)" strokeWidth="1" />
        <path d={curve} fill="none" stroke="var(--muted-text)" strokeWidth="2" strokeDasharray="4 3" />
        <line x1={vaxLine} y1="12" x2={vaxLine} y2="76" stroke="var(--muted-text)" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={vaxLine + 4} y="22" fontSize="9" fill="var(--muted-text)">
          {en ? "vaccines" : zh ? "疫苗" : "vaccins"}
        </text>
        <circle cx="200" cy="28" r="3" fill="var(--muted-text)" opacity="0.5" />
        <circle cx="230" cy="20" r="3" fill="var(--muted-text)" opacity="0.5" />
        <circle cx="255" cy="15" r="3" fill="var(--muted-text)" opacity="0.5" />
      </svg>
      <p className="examplePreviewHint muted">
        {en
          ? "Outbreak growth, slowed by vaccination — interactive example coming soon"
          : zh
            ? "疫情增长与疫苗接种——互动例题即将推出"
            : "Ziekte-uitbraak en vaccinaties — interactief voorbeeld komt binnenkort"}
      </p>
    </div>
  );
}
