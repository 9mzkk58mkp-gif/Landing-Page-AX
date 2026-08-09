---
name: ax-audit-seo
description: Scores AutomateX-HUB SEO/GEO (H1, meta, canonical, JSON-LD, sitemap, internal links) max 150. Part of audit /1000.
model: inherit
readonly: true
---

# Agent SEO / GEO — /150

Read rubric section 3. Sample ≥5 pages: home, 1 métier, zone, 1 article, outils.

## Check

- Exactly one `<h1>` per sampled page
- title + meta description + canonical `automatex-hub.com`
- JSON-LD: Organization, LocalBusiness, Service; **one** FAQPage max
- `sitemap.xml` vs real folders
- Maillage footer / in-content between hub pages
- FAQ answers self-contained

## Output

```
Score: N/150
- evidence + deductions
```
