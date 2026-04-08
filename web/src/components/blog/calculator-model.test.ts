import { describe, expect, it } from "vitest";
import {
  appendToExpression,
  backspaceExpression,
  evaluateCalcExpression,
  evaluateTryExpression,
} from "./calculator-model";

describe("calculator model", () => {
  it("returns structured success with formatted values", () => {
    const result = evaluateCalcExpression("2↑3");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(8);
      expect(result.formatted).toBe("8");
    }
  });

  it("returns structured error for invalid expressions", () => {
    const result = evaluateCalcExpression("2↑");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });

  it("formats try-expression output for UI", () => {
    expect(evaluateTryExpression("2↓12")).toBe("1.059463");
    expect(evaluateTryExpression("2↑")).toBe("error");
  });

  it("appends operators with spacing for readable input", () => {
    expect(appendToExpression("2", "↑")).toBe("2 ↑ ");
    expect(appendToExpression("2 ↑ ", "3")).toBe("2 ↑ 3");
  });

  it("backspace helper removes one character", () => {
    expect(backspaceExpression("2 ↑ 3")).toBe("2 ↑ ");
  });
});
