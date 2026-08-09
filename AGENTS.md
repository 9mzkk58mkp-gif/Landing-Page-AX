# AGENTS.md — AutomateX-HUB

Point d’entrée pour tout agent IA (Cursor ou autre) qui travaille sur ce dépôt.

## Design
- Look « dossier papier / plan de bâtiment » — préserver l’identité
- **Grille 8px** pour espacements UI (voir `.cursor/rules/automatex-hub.mdc`)
- Mobile-first ; sticky CTA ; Calendly popup
- Couleurs : ink / terracotta CTA / fond plan

## Mission
Site marketing statique pour **AutomateX-HUB** : automatisation devis / relances / mails pour artisans du bâtiment (Flers / Orne). Conversion → appel Calendly 20 min.

## Lire dans cet ordre
1. Ce fichier
2. `CLAUDE.md` (brief produit pour Claude — même contenu utile à tout agent)
3. `.cursor/rules/automatex-hub.mdc` (règles toujours actives)
4. `.cursor/rules/html-pages.mdc` si tu touches du HTML
5. `README.md` (preview, build CSS, deploy)

## Carte du repo

| Chemin | Rôle |
|--------|------|
| `404.html` | Page erreur Netlify (dossier papier + « Revenir au site ») |
| `index.html` | Landing conversion (sticky CTA, lightbox OS) |
| `couvreurs/` `menuisiers/` `plombiers/` `plaquistes/` `electriciens/` | Pages métier SEO/GEO |
| `outils/` | Mur 30 nœuds n8n + 4 pages usage (Gmail, WhatsApp, Outlook, Sheets) |
| `automatisation-artisans-flers-orne/` | Page zone |
| `articles/` | Hub + articles intention |
| `mentions-legales/` `confidentialite/` | Légal / RGPD |
| `styles.css` | **Source CSS** (éditer ici) |
| `styles.min.css` | CSS servi en prod (régénérer après edit) |
| `script.js` | Calendly popup, cookies/GA, sticky, lightbox, defer images |
| `assets/fonts/` | Manrope woff2 + `fonts.min.css` |
| `uploads/` | Images WebP (dashboard, nolan) |
| `sitemap.xml` `robots.txt` | Crawl |
| `netlify.toml` | Hosting + cache headers |
| `scripts/minify-css.py` | Build CSS |
| `scripts/serve.py` | Preview local **avec gzip** (mesure perf fidèle) |

## Ignorer (ne pas « réparer » comme du produit)
- `Landing AutomateX-HUB.dc.html`, `support.js` — artefacts design Claude
- `lighthouse-reports/` — sorties d’audit
- `uploads/photos-*.png`, `automatex-os-dashboard-full.png` — sources lourdes ; servir les WebP

## Constantes runtime (`script.js`)
- `CALENDLY_URL` — lien réservation (popup)
- `GA_ID` = `G-GZG5DWRGKF` — chargé seulement si consentement `granted`
- Consent key localStorage : `ax_cookie_consent`

## Commandes agent
```bash
# Preview (gzip, port 8765)
python3 scripts/serve.py

# Après toute modif CSS
python3 scripts/minify-css.py

# Audit objectif (base pour score /1000)
python3 scripts/ax-score.py

# Perf mobile (serveur gzip requis)
npx lighthouse http://127.0.0.1:8765/ --only-categories=performance --form-factor=mobile --chrome-flags="--headless=new"
```

## Audit score /1000
- Skill : `.cursor/skills/ax-audit-1000/` (dire « note le site » / « audit 1000 »)
- Agents : `.cursor/agents/ax-audit-*.md` (orchestrateur + 7 domaines)
- Rubrique : `.cursor/skills/ax-audit-1000/rubric.md`
- Script : `python3 scripts/ax-score.py`
## Definition of done (changement typique)
- [ ] Fichiers listés en tête de réponse
- [ ] Copy conforme (prix, métiers, CTA, pas de faux témoignages)
- [ ] `styles.min.css` à jour si CSS touché
- [ ] Liens footer / sitemap si nouvelle URL
- [ ] Pas de régression perf évidente (pas de CDN fonts, pas d’image HD au load)
- [ ] Pas de commit/push sauf demande user

## Interdits
- Réintroduire diagnostiqueurs / courtiers / grille tarifaire 3 offres
- Inventer clients, avis, logos
- Remplacer le design dossier par un template générique
- Transformer le site en app (Next.js, React, Vue, SSR, SPA) — **jamais**
- Proposer une migration framework « pour la maintenabilité » : refuser, éditer l’HTML existant
