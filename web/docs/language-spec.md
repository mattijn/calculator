# Alternative Notation Language Spec (v1)

## Goal
Define a browser-native grammar and evaluator that preserves legacy behavior while making parsing explicit and testable.

## Lexical Symbols
- Numeric literals: `123`, `1.03`
- Parentheses: `(` and `)`
- Binary operators:
  - `+`, `-`
  - `*`, `x`, `×`
  - `/`, `÷`
  - `↑`, `↓`, `⇓`
- Unary prefix operators:
  - `+` (identity)
  - `-` (negation)
  - `/` or `÷` (reciprocal)

## Grammar Levels
1. Unary expressions (right-associative chain)
2. Power-family operators `↑`, `↓`, `⇓` (left-associative)
3. Arithmetic operators `+`, `-`, `*`, `/` (left-associative)

## Semantics
- `a↑b` = `a ** b`
- `a↓b` = `a ** (1 / b)`
- `a⇓b` = `log(a) / log(b)`
- `÷x` = `1 / x`

## Compatibility Notes
- The operation ordering above intentionally matches existing runtime outcomes in the legacy code for mixed arithmetic expressions.
- Unary reciprocal chaining is supported to align with the notation explanation (`÷÷2`).

## Error Semantics
- Syntax errors are surfaced as parse failures with source position.
- Runtime failures resulting in non-finite values are treated as invalid expression results.
