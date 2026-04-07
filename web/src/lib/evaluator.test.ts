import { describe, expect, it } from "vitest";
import { evaluateExpression } from "./evaluator";

describe("evaluator compatibility", () => {
  it("matches known legacy outcomes", () => {
    expect(evaluateExpression("1+2*3")).toBe(9);
    expect(evaluateExpression("1+2/3")).toBe(1);
    expect(evaluateExpression("2↑3+1")).toBe(9);
    expect(evaluateExpression("8↓3+1")).toBe(3);
    expect(evaluateExpression("8⇓2+1")).toBe(4);
    expect(evaluateExpression("--2")).toBe(2);
  });

  it("supports reciprocal unary chaining", () => {
    expect(evaluateExpression("÷2")).toBe(0.5);
    expect(evaluateExpression("÷÷2")).toBe(2);
  });
});
