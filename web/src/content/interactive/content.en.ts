import { InteractiveContent } from "./types";

export const contentEn: InteractiveContent = {
  languageName: "English",
  title: "A Better Way To Read Powers, Roots, and Logs",
  subtitle:
    "This interactive article teaches the notation step by step, then lets you test every idea directly in the calculator.",
  sections: {
    hookTitle: "Why does this feel harder than it should?",
    hookBody:
      "Many people feel that powers, roots, and logarithms are taught as disconnected tricks. The goal here is to make them look and behave like one coherent arithmetic family.",
    intuitionTitle: "Notation intuition in one minute",
    intuitionBody:
      "Read ↑ as power up, ↓ as power down (root), and ⇓ as double down (log base). The symbols are designed to look related because the operations are related.",
    guidedTitle: "Guided examples: old notation vs new notation",
    proofTitle: "Proof theater: difficult-looking radical, simple steps",
    practiceTitle: "Practice freely with the full calculator",
    reflectionTitle: "Reflection",
    reflectionBody:
      "If notation helps you think faster, the notation is doing real work. Use the calculator to compare forms until this starts to feel natural.",
  },
  labels: {
    traditional: "Traditional notation",
    notation: "Alternative notation",
    runInCalculator: "Run in calculator",
    runStep: "Run this step",
  },
  examples: [
    {
      id: "principal",
      title: "Required principal after 10 years",
      context: "How much do I need now to end with 1000 at 3% for 10 years?",
      traditional: "m = 1000 / 1.03^10",
      notation: "m = 1000 ÷ 1.03↑10",
      expression: "1000÷1.03↑10",
    },
    {
      id: "rate",
      title: "Rate that doubles money in 10 years",
      context: "Solve r in r^10 = 2",
      traditional: "r = 2^(1/10)",
      notation: "r = 2↓10",
      expression: "2↓10",
    },
    {
      id: "time",
      title: "Years to double at 3%",
      context: "Solve y in 1.03^y = 2",
      traditional: "y = log(2) / log(1.03)",
      notation: "y = 2⇓1.03",
      expression: "2⇓1.03",
    },
  ],
  proof: {
    title: "Nested radical identity",
    intro:
      "We walk through a classic radical statement by expressing each move with notation that keeps inverse relationships visible.",
    steps: [
      { id: "s1", label: "Start from the target form", expression: "(3+2×2↓2)↓2" },
      { id: "s2", label: "Square the right-hand side", expression: "(1+2↓2)↑2" },
      { id: "s3", label: "Expand (a+b)↑2", expression: "1↑2+2×2↓2+(2↓2)↑2" },
      { id: "s4", label: "Simplify 1↑2 and (2↓2)↑2", expression: "1+2×2↓2+2" },
      { id: "s5", label: "Reorder", expression: "3+2×2↓2" },
      { id: "s6", label: "Take square root", expression: "(3+2×2↓2)↓2" },
    ],
  },
};
