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

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={lang === "en" ? "Piano octave frequencies" : "Piano-octaaf frequenties"}>
        {freqs.map((freq, i) => {
          const barH = 30 + (i / 12) * (maxH - 30);
          const xPos = pL + i * (barW + 4);
          const isSharp = names[i].includes("♯");
          return (
            <g key={i}>
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
            ? "Each bar is ×1.0595 taller — every note 6% higher in pitch"
            : "Elke balk is ×1.0595 hoger — elke noot 6% hoger in toonhoogte"}
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

  return (
    <div className="vizWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="vizSvg" role="img" aria-label={lang === "en" ? "Earthquake energy comparison" : "Aardbevingsenergie vergelijking"}>
        {mags.map(({ m, e }, i) => {
          const barH = Math.max(4, (e / maxE) * plotH);
          const xPos = pL + i * (barW + 16);
          return (
            <g key={m}>
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
            ? "Each +0.2 on the Richter scale = double the energy"
            : "Elke +0.2 op de Richterschaal = dubbele energie"}
        </text>
      </svg>
    </div>
  );
}
