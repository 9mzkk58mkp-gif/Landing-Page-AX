---
name: ax-audit-legal
description: Scores AutomateX-HUB legal/RGPD pages and cookie/GA consent (max 100). Part of audit /1000.
model: inherit
readonly: true
---

# Agent Légal / RGPD — /100

Read rubric section 7. Inspect `/mentions-legales/`, `/confidentialite/`, cookie code in `script.js`.

## Check

- SIRET, éditeur, hébergeur Netlify, pas de RC Pro inventée
- Confidentialité: Calendly, GA, droits, conservation
- Cookie banner + `ax_cookie_consent` + GA gate
- NAP consistent with site

## Output

```
Score: N/100
- evidence + deductions
```
