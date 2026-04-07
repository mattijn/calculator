"use client";

import { useMemo, useState } from "react";
import { evaluateExpression } from "@/lib/evaluator";

const HISTORY_KEY = "calculator-history-v1";

type HistoryItem = {
  expression: string;
  result: string;
};

const readHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
};

const writeHistory = (items: HistoryItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 20)));
};

const symbolButtons = ["+", "-", "×", "÷", "↑", "↓", "⇓", "(", ")"];
const keypadButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

type CalculatorPlaygroundProps = {
  title: string;
  expressionLabel: string;
  placeholder: string;
  evaluateLabel: string;
  clearLabel: string;
  copyLabel: string;
  historyTitle: string;
  emptyHistoryLabel: string;
  resultLabel: string;
  errorLabel: string;
  deleteLabel: string;
  acLabel: string;
  equalsLabel: string;
  presetExpression?: string;
};

export function CalculatorPlayground({
  title,
  expressionLabel,
  placeholder,
  evaluateLabel,
  clearLabel,
  copyLabel,
  historyTitle,
  emptyHistoryLabel,
  resultLabel,
  errorLabel,
  deleteLabel,
  acLabel,
  equalsLabel,
  presetExpression,
}: CalculatorPlaygroundProps) {
  const [expression, setExpression] = useState(() => {
    if (presetExpression) return presetExpression;
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("expr") ?? "";
  });
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(() => readHistory());

  const append = (value: string) => {
    setExpression((current) => `${current}${value}`);
  };

  const removeLast = () => {
    setExpression((current) => current.slice(0, -1));
  };

  const runEvaluation = () => {
    try {
      const value = evaluateExpression(expression);
      const rendered = Number.isInteger(value) ? String(value) : value.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
      setResult(rendered);
      setError("");
      const next = [{ expression, result: rendered }, ...history];
      setHistory(next.slice(0, 20));
      writeHistory(next);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Invalid expression";
      setError(message);
      setResult("");
    }
  };

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("expr", expression);
    return url.toString();
  }, [expression]);

  return (
    <section className="stack">
      <div className="card stack">
        <h2>{title}</h2>
        <label htmlFor="expression">{expressionLabel}</label>
        <input
          id="expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={placeholder}
          className="expressionInput"
        />

        <div className="calcTopActions">
          <button className="secondaryBtn" onClick={removeLast}>
            {deleteLabel}
          </button>
          <button
            className="secondaryBtn"
            onClick={() => {
              setExpression("");
              setResult("");
              setError("");
            }}
          >
            {acLabel}
          </button>
        </div>

        <div className="keypadGrid">
          {keypadButtons.map((value) => (
            <button key={value} className="secondaryBtn" onClick={() => append(value)}>
              {value}
            </button>
          ))}
          <button className="primaryBtn" onClick={runEvaluation}>
            {equalsLabel}
          </button>
        </div>

        <div className="symbolRow">
          {symbolButtons.map((symbol) => (
            <button key={symbol} className="secondaryBtn" onClick={() => append(symbol)}>
              {symbol}
            </button>
          ))}
        </div>

        <div className="calcTopActions">
          <button className="primaryBtn" onClick={runEvaluation}>
            {evaluateLabel}
          </button>
          <button className="secondaryBtn" onClick={() => setExpression("")}>
            {clearLabel}
          </button>
          <button className="secondaryBtn" onClick={() => navigator.clipboard.writeText(shareUrl)}>
            {copyLabel}
          </button>
        </div>
        {result ? (
          <p>
            <strong>{resultLabel}:</strong> {result}
          </p>
        ) : null}
        {error ? (
          <p className="errorText">
            <strong>{errorLabel}:</strong> {error}
          </p>
        ) : null}
      </div>

      <div className="card stack">
        <h3>{historyTitle}</h3>
        {history.length === 0 ? <p className="muted">{emptyHistoryLabel}</p> : null}
        {history.map((item, index) => (
          <button key={`${item.expression}-${index}`} onClick={() => setExpression(item.expression)} className="historyItem">
            <code>{item.expression}</code> = <strong>{item.result}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
