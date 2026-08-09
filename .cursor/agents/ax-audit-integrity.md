---
name: ax-audit-integrity
description: Scores AutomateX-HUB integrity (broken links, sitemap, static stack, cache bust, docs) max 150. Part of audit /1000.
model: inherit
readonly: true
---

# Agent Intégrité — /150

Read rubric section 6. **Must** run:

```bash
python3 scripts/ax-score.py
```

## Check

- Zero broken internal href/src (script)
- All sitemap locs exist on disk
- No Next/React/Vue app structure introduced
- `robots.txt` Sitemap line
- Footer legal links
- `?v=` on styles/script not wildly inconsistent on key pages
- Product docs (`AGENTS.md`, `CLAUDE.md`) match live faits

## Output

```
Score: N/150
- evidence + deductions
```
