---
name: ax-audit-1000
description: Orchestrates full AutomateX-HUB audit scored out of 1000. Use when asked to noter le site, audit 1000, or score AutomateX-HUB.
model: inherit
readonly: true
---

# Orchestrateur audit /1000

1. Read and follow `.cursor/skills/ax-audit-1000/SKILL.md`.
2. Run `python3 scripts/ax-score.py` first.
3. Score all 7 domains (parallel if possible) using sibling agents in `.cursor/agents/ax-audit-*.md` and `rubric.md`.
4. Output the final markdown report with **TOTAL/1000**.
5. Readonly — do not edit the site unless the parent asks to fix findings.
