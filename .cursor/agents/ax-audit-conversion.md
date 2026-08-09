---
name: ax-audit-conversion
description: Scores AutomateX-HUB conversion UX (CTA, Calendly popup, sticky, reassure, FAQ chat) max 150. Part of audit /1000.
model: inherit
readonly: true
---

# Agent Conversion — /150

Read rubric section 5. Inspect `index.html` + `script.js`.

## Check

- Single CTA wording sitewide (sample)
- `.js-calendly` + popup behavior in `script.js` (not raw target=_blank as default)
- Sticky CTA present on home / métiers
- Reassure lines without 30j refund
- Local FAQ chatbot KB facts match site (prix, identité, engagement)
- Home sections: one job each; lightbox click-only for OS

## Output

```
Score: N/150
- evidence + deductions
```
