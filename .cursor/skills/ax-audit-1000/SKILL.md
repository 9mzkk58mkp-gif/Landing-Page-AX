---
name: ax-audit-1000
description: >-
  Orchestrates AutomateX-HUB site audit scored out of 1000. Use when the user
  asks to noter le site, audit 1000, score AutomateX, vérifier le site, or run
  ax-audit agents.
---

# Audit AutomateX-HUB — /1000

## Goal

Produce a single score **X/1000** with domain breakdowns, evidence, and top fixes.

## Mandatory first step

```bash
python3 scripts/ax-score.py
```

Use the JSON/stdout as factual baseline. Do not invent broken links if the script says none.

## Parallel domain agents

Launch **in parallel** (Task tool or equivalent) these project agents / prompts. Each returns `Score: N/MAX` + bullets.

| Agent file | Max | Domain |
|------------|-----|--------|
| `.cursor/agents/ax-audit-copy.md` | 150 | Copy / identité / interdits |
| `.cursor/agents/ax-audit-design.md` | 100 | Design dossier / grille 8px |
| `.cursor/agents/ax-audit-seo.md` | 150 | SEO + GEO |
| `.cursor/agents/ax-audit-perf.md` | 200 | Perf mobile / assets |
| `.cursor/agents/ax-audit-conversion.md` | 150 | Conversion UX |
| `.cursor/agents/ax-audit-integrity.md` | 150 | Liens / stack / hygiène |
| `.cursor/agents/ax-audit-legal.md` | 100 | Légal / RGPD / cookies |

Read each agent file and follow its rubric. If Task subagents cannot load custom agents, run the same rubrics yourself as parallel explores — still one score per domain.

Full criteria: [rubric.md](rubric.md)

## Aggregation

```
TOTAL = sum(domain scores)
```

Clamp each domain to `[0, max]`. Prefer specific numbers (e.g. 137/150), not round tens only.

## Final report format

```markdown
# Score AutomateX-HUB : TOTAL/1000

| Domaine | Score | Max |
|---------|------:|----:|
| Copy / identité | | 150 |
| Design | | 100 |
| SEO / GEO | | 150 |
| Perf / assets | | 200 |
| Conversion | | 150 |
| Intégrité | | 150 |
| Légal / RGPD | | 100 |
| **Total** | **TOTAL** | **1000** |

## Verdict
1–2 phrases.

## Top 5 corrections (impact)
1. …

## Preuves script
(summary of ax-score.py)

## Détail par domaine
…
```

## Rules

- Align with `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/automatex-hub.mdc`
- No fake testimonials as “proof”
- Do not propose Next.js / React migration
- Do not commit/push unless asked
