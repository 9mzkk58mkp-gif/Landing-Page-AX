---
name: ax-audit-perf
description: Scores AutomateX-HUB mobile performance and assets (fonts, WebP, minify, Netlify headers, GA consent) max 200. Part of audit /1000.
model: inherit
readonly: true
---

# Agent Perf / assets — /200

Read rubric section 4 and `.cursor/rules/perf-mobile.mdc`. Prefer `python3 scripts/ax-score.py` output.

## Check

- No `fonts.googleapis` / Simple Icons CDN
- Manrope via `/assets/fonts/` deferred
- WebP + `loading` / `data-defer-src`; no full PNG HD on initial home
- `styles.css` edited → `styles.min.css` exists and is referenced
- `netlify.toml` cache for woff2 / css / js
- `script.js` defer; GA only after consent
- Avoid recommending framework rewrites

Optional: if serve.py reachable, note Lighthouse — do not fail solely for not running it.

## Output

```
Score: N/200
- evidence + deductions
```
