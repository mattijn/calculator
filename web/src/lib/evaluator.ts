import { parse } from "./generated/parser";

type NumberNode = { type: "number"; value: number };
type UnaryNode = {
  type: "unary";
  operator: "+" | "-" | "/" | "÷";
  argument: AstNode;
};
type BinaryNode = {
  type: "binary";
  operator: "+" | "-" | "*" | "x" | "×" | "/" | "÷" | "↑" | "↓" | "⇓";
  left: AstNode;
  right: AstNode;
};

type AstNode = NumberNode | UnaryNode | BinaryNode;

const normalizeExpression = (expression: string) =>
  expression
    .replaceAll(" ", "")
    .replaceAll("X", "x");

const evaluateAst = (node: AstNode): number => {
  if (node.type === "number") {
    return node.value;
  }

  if (node.type === "unary") {
    const value = evaluateAst(node.argument);
    if (node.operator === "+") return +value;
    if (node.operator === "-") return -value;
    return 1 / value;
  }

  const left = evaluateAst(node.left);
  const right = evaluateAst(node.right);

  switch (node.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
    case "x":
    case "×":
      return left * right;
    case "/":
    case "÷":
      return left / right;
    case "↑":
      return left ** right;
    case "↓":
      return left ** (1 / right);
    case "⇓":
      return Math.log(left) / Math.log(right);
    default:
      throw new Error("Unsupported operator");
  }
};

export const evaluateExpression = (rawExpression: string): number => {
  const expression = normalizeExpression(rawExpression);
  if (!expression) {
    throw new Error("Enter an expression");
  }

  const ast = parse(expression) as AstNode;
  const result = evaluateAst(ast);
  if (!Number.isFinite(result)) {
    throw new Error("Expression evaluates to a non-finite value");
  }
  return result;
};
