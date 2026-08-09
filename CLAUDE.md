# CLAUDE.md — AutomateX-HUB

Brief projet pour Claude (ou tout agent). **Source de vérité opérationnelle :** `AGENTS.md` + `.cursor/rules/automatex-hub.mdc`. Ce fichier décrit le produit, la stack et les garde-fous.

---

## En une phrase

Site marketing **statique** pour **AutomateX-HUB** : automatisation devis / relances / mails pour **artisans du bâtiment** (Flers / Orne). Objectif unique = prendre un appel Calendly **20 min**.

**Prod :** https://automatex-hub.com · **Hébergeur :** Netlify · **Repo :** HTML/CSS/JS, pas d’app.

---

## Qui / quoi

| | |
|---|---|
| Marque | AutomateX-HUB / Automatex |
| Fondateur | Nolan Hermand — **menuisier devenu développeur** (jamais « ex-couvreur », jamais « ancien menuisier » seul) |
| NAP | 50 rue de l’Équerre, 61100 Saint-Georges-des-Groseillers · 06 45 38 42 33 · nolan.hermand@automatex-hub.com |
| SIRET | 103 208 054 00017 · TVA art. 293 B |
| Prix public | **À partir de 390 € + 99 €/mois** — **pas** de grille DÉCLIC / SYSTÈME / PILOTE |
| Métiers cibles | Couvreurs, menuisiers, plombiers, plaquistes, électriciens **uniquement** |
| Interdit | Diagnostiqueurs, courtiers, faux avis, logos clients fictifs, « 30 jours remboursé » |
| CTA | « Démo gratuite 20 min sur ton cas » (bouton terracotta `#F26419`) |
| Calendly | URL dans `script.js` → `CALENDLY_URL` (event `/30min` tant que `/20min` n’existe pas) |

Promesse produit : on **branche** les outils déjà utilisés (Obat, Gmail, etc.) et on les **regroupe dans une application métier** — coup d’œil le soir sur devis / relances / mails.

---

## Stack (immuable)

- HTML statique + `styles.css` (source) → `styles.min.css` (servi) + `script.js`
- Pas de Next.js, React, Vue, bundler, SSR, SPA — **jamais**, même « pour la maintenabilité »
- Fonts self-host Manrope (`/assets/fonts/`) — pas de Google Fonts CDN
- GA4 `G-GZG5DWRGKF` derrière consentement `localStorage` clé `ax_cookie_consent`
- Deploy : `netlify.toml` (publish `.`, headers cache fonts/CSS/JS)

### Workflow CSS obligatoire
1. Éditer `styles.css`
2. `python3 scripts/minify-css.py`
3. Pages HTML pointent vers `styles.min.css?v=N` (bumper `?v=` après change)

### Preview / perf
```bash
python3 scripts/serve.py          # http://127.0.0.1:8765/ (gzip)
python3 scripts/minify-css.py
npx lighthouse http://127.0.0.1:8765/ --only-categories=performance --form-factor=mobile --chrome-flags="--headless=new"
```
Objectif Lighthouse mobile Performance **≥ 95**.

---

## Design

- Identité : **dossier papier / plan de bâtiment** (fond grille `#c5ced8`, ink `#1F2428`, CTA `#F26419`)
- **Grille 8px** pour margin, padding, gap, offsets, chips — bordures 2px et font-size peuvent déroger
- Mobile-first ; sticky CTA ; Calendly en **popup** (pas nouvel onglet)
- Home : navbar pilule flottante (Accueil · Outils · Démarche · Moi · FAQ) + chatbot FAQ local (pas d’IA externe)
- `404.html` : même look, bouton **« Revenir au site »**, chemins **absolus** (`/styles.min.css`…)

Ne pas remplacer par un template générique (SaaS violet, cream+serif terracotta générique, etc.).

---

## Carte des pages

| URL | Fichier | Rôle |
|-----|---------|------|
| `/` | `index.html` | Landing conversion |
| `/couvreurs/` … `/electriciens/` | dossiers métier | SEO / GEO métier |
| `/outils/` | `outils/index.html` | 30 nœuds n8n + pages usage |
| `/outils/gmail-relances-devis/` etc. | sous-dossiers | Outil × usage artisan (Gmail, WhatsApp, Outlook, Sheets) |
| `/automatisation-artisans-flers-orne/` | zone locale | SEO Flers / Orne |
| `/articles/` + slugs | hub + guides intention | SEO contenu |
| `/mentions-legales/` `/confidentialite/` | légal / RGPD | |
| (404) | `404.html` | Erreur Netlify branded |

Autres fichiers clés : `sitemap.xml`, `robots.txt`, `uploads/` (WebP), `assets/icons/n8n/`, `assets/fonts/`.

### Ignorer (pas du produit)
- `Landing AutomateX-HUB.dc.html`, `support.js` — artefacts design
- `lighthouse-reports/`
- PNG sources lourdes dans `uploads/` — servir les WebP

---

## SEO / GEO

- 1 H1 / page ; FAQ citables ; JSON-LD : Organization + LocalBusiness + Service + **une seule** FAQPage
- Canonical / OG / sitemap sur `automatex-hub.com`
- Maillage : home ↔ métiers ↔ articles ↔ zone ↔ légal ↔ outils
- Réassurance autorisée : **Sans engagement · 1 mail pour résilier · RGPD France** — **jamais** « 30 j remboursé / satisfait ou remboursé »

---

## Audit qualité /1000

Pour noter le site : lire `.cursor/skills/ax-audit-1000/SKILL.md`, lancer `python3 scripts/ax-score.py`, puis les agents `.cursor/agents/ax-audit-*.md`.

Domaines : Copy 150 · Design 100 · SEO 150 · Perf 200 · Conversion 150 · Intégrité 150 · Légal 100 = **1000**.

---

## Comment travailler sur ce repo

1. Lire `AGENTS.md` puis `.cursor/rules/automatex-hub.mdc` (et `html-pages.mdc` si HTML)
2. Lister les fichiers touchés (1 ligne / fichier) avant de coder
3. Éditer l’existant — **ne pas reconstruire** le site
4. Après CSS → minify ; après JS → bumper `script.js?v=`
5. Nouvelle URL → `sitemap.xml` + footer / maillage
6. **Pas de commit / push** sauf demande explicite du fondateur

### Definition of done
- Copy conforme (prix, métiers, CTA, identité)
- Pas de faux témoignages
- Pas de régression perf évidente
- `styles.min.css` à jour si CSS touché

### Refuser explicitement
- Migration framework
- Cibles hors bâtiment (diagnostiqueurs, courtiers…)
- Grille tarifaire 3 offres
- Inventer RC Pro / clients / avis

---

## Contexte business (pour le copy)

- Ton : conseiller terrain, tutoiement OK pour artisans
- Douleur → conséquence → solution → résultat (temps gagné, devis partis, soirées récupérées)
- Preuve : légitimité menuisier → développeur + ancrage Flers / Orne
- 0 client affiché aujourd’hui → **aucune** preuve sociale inventée
