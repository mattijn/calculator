# calculator

This repository now contains:

- Legacy Python proof-of-concept (Streamlit + Pascal-interpreter based parser)
- A production-oriented static website in `web/`, deployable to GitHub Pages

## Website (GitHub Pages target)

The new website lives in `web/` and includes:

- Calculator playground with custom operators (`↑`, `↓`, `⇓`, unary `÷`)
- Learn, reference, and examples pages
- Browser-native PEG-based parser/evaluator and compatibility tests

Run locally:

```bash
cd web
npm install
npm run dev
```