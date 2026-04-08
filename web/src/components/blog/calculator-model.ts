import { useCallback, useMemo, useState } from "react";
import { evaluateExpression } from "../../lib/evaluator";

const OP_SET = new Set(["+", "-", "×", "÷", "↑", "↓", "⇓"]);

function formatNumber(value: number, digits: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}

export type CalcEvaluation =
  | { ok: true; value: number; formatted: string }
  | { ok: false; error: string };

export function evaluateCalcExpression(expr: string, digits = 8): CalcEvaluation {
  try {
    const value = evaluateExpression(expr);
    return { ok: true, value, formatted: formatNumber(value, digits) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid" };
  }
}

export function evaluateTryExpression(expr: string): string {
  const evaluation = evaluateCalcExpression(expr, 6);
  return evaluation.ok ? evaluation.formatted : "error";
}

export function appendToExpression(current: string, value: string): string {
  return OP_SET.has(value) ? `${current} ${value} ` : current + value;
}

export function backspaceExpression(current: string): string {
  return current.slice(0, -1);
}

export type CalculatorViewModel = {
  expr: string;
  result: string;
  error: string;
  setExpr: (value: string) => void;
  evaluate: () => void;
  append: (value: string) => void;
  backspace: () => void;
  clear: () => void;
};

export function useCalculatorModel(): CalculatorViewModel {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const evaluate = useCallback(() => {
    const evaluation = evaluateCalcExpression(expr, 8);
    if (evaluation.ok) {
      setResult(evaluation.formatted);
      setError("");
      return;
    }
    setError(evaluation.error);
    setResult("");
  }, [expr]);

  const append = useCallback((value: string) => {
    setExpr((current) => appendToExpression(current, value));
  }, []);

  const backspace = useCallback(() => {
    setExpr((current) => backspaceExpression(current));
  }, []);

  const clear = useCallback(() => {
    setExpr("");
    setResult("");
    setError("");
  }, []);

  return useMemo(
    () => ({ expr, result, error, setExpr, evaluate, append, backspace, clear }),
    [expr, result, error, evaluate, append, backspace, clear],
  );
}
