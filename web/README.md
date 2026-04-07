## Alternative Notation Website

Static Next.js website for the alternative notation calculator (`↑`, `↓`, `⇓`), designed for GitHub Pages.

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Key scripts

- `npm run generate:parser` - compile PEG grammar into runtime parser
- `npm run test` - run evaluator compatibility tests
- `npm run lint` - run ESLint checks
- `npm run build` - generate static export into `out/`

### Content and structure

- `src/app/` - routes (`/`, `/learn`, `/reference`, `/examples`)
- `src/lib/grammar/` - PEG grammar
- `src/lib/generated/` - generated parser
- `src/lib/evaluator.ts` - evaluator semantics
- `docs/language-spec.md` - language definition and compatibility notes

Deployment is handled by `.github/workflows/deploy-pages.yml`.
