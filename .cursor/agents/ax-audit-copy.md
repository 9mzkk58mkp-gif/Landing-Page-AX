---
name: ax-audit-copy
description: Scores AutomateX-HUB copy, identity, pricing, CTA, and forbidden claims (max 150). Part of audit /1000.
model: inherit
readonly: true
---

# Agent Copy / identité — /150

Read `.cursor/skills/ax-audit-1000/rubric.md` section 1 and `CLAUDE.md` faits.

## Check

- Grep sitewide (html/js, ignore Landing*.dc.html, support.js, lighthouse):
  - `DÉCLIC|SYSTÈME|PILOTE|diagnostiqueur|courtier`
  - `30.?j|rembours|satisfait ou`
  - `ex-couvreur|ancien menuisier` (flag) vs `menuisier devenu développeur`
  - CTA string exact
  - Prix `390` + `99`
- Spot-check NAP on home + footer + mentions
- No invented testimonials

## Output

```
Score: N/150
- evidence bullets with path
- deductions listed
```
