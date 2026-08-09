# Rubrique AutomateX-HUB — 1000 points

Source de vérité scoring. Chaque domaine a un plafond. Déduire avec preuve (fichier:ligne ou URL).

---

## 1. Copy / identité — 150

| Critère | Pts | Règle |
|---------|----:|-------|
| Prix « à partir de 390 € + 99 €/mois » cohérent | 25 | Pas de DÉCLIC/SYSTÈME/PILOTE |
| Identité « menuisier devenu développeur » | 20 | Pas « ex-couvreur » / « ancien menuisier » seul |
| NAP exact | 20 | Équerre, 61100, tél, mail |
| CTA exact | 20 | « Démo gratuite 20 min sur ton cas » |
| Métiers bâtiment only | 20 | Pas diagnostiqueurs / courtiers |
| Pas « 30 j remboursé / satisfait ou remboursé » | 20 | Zéro occurrence produit |
| Pas de faux avis / logos clients | 15 | |
| Ton terrain, tutoiement OK, pas jargon creux | 10 | Home + 1 métier + 1 article |

---

## 2. Design — 100

| Critère | Pts | Règle |
|---------|----:|-------|
| Look dossier / plan préservé | 25 | paper, ink, grille fond |
| Couleurs : ink `#1F2428`, CTA `#F26419`, fond `#c5ced8` | 20 | |
| Grille 8px (espacements UI) | 20 | Échantillon home + CSS vars |
| Nav pilule home utile + ordre scroll | 15 | Accueil→Outils→Démarche→Moi→FAQ |
| 404 branded + « Revenir au site » | 10 | `404.html` chemins absolus |
| Pas de template générique / violet SaaS | 10 | |

---

## 3. SEO / GEO — 150

| Critère | Pts | Règle |
|---------|----:|-------|
| 1 H1 / page (échantillon ≥ 5 pages) | 20 | |
| Meta title/description présentes | 20 | |
| Canonical `.com` | 15 | |
| JSON-LD Org + LocalBusiness + Service | 25 | |
| Une seule FAQPage / page | 20 | |
| Sitemap complet vs pages réelles | 20 | |
| Maillage home↔métiers↔articles↔zone↔outils | 20 | |
| FAQ citables (réponses autonomes) | 10 | |

---

## 4. Perf / assets — 200

| Critère | Pts | Règle |
|---------|----:|-------|
| Fonts self-host Manrope, load différé | 35 | Pas Google Fonts CDN |
| Images WebP + lazy / defer hors LCP abusif | 35 | Pas PNG HD au load |
| `styles.min.css` synchro après source | 25 | minify script |
| Pas CDN icônes tiers | 20 | n8n SVG locaux |
| Headers cache Netlify fonts/CSS/JS | 20 | `netlify.toml` |
| Heuristique Lighthouse-ready (pas opacity reveal massif) | 25 | |
| JS non bloquant (defer) + GA derrière consent | 25 | |
| Poids raisonnable home (pas assets lourds inutiles) | 15 | |

---

## 5. Conversion — 150

| Critère | Pts | Règle |
|---------|----:|-------|
| CTA unique répété | 30 | |
| Calendly popup (`js-calendly`) | 30 | Pas nouvel onglet par défaut |
| Sticky CTA mobile | 25 | |
| Réassurance sans faux 30j | 20 | Sans engagement · 1 mail · RGPD |
| Chatbot FAQ local cohérent | 20 | Faits alignés site |
| Hiérarchie 1 idée / section (home) | 15 | |
| Lightbox OS au clic seulement | 10 | |

---

## 6. Intégrité — 150

| Critère | Pts | Règle |
|---------|----:|-------|
| 0 lien interne cassé | 40 | script + spot-check |
| Sitemap URLs existent | 25 | |
| Stack HTML/CSS/JS only | 25 | Pas React/Next imports |
| `robots.txt` → sitemap | 10 | |
| Footer NAP + liens légal | 15 | |
| Cache-bust `?v=` CSS/JS cohérent | 15 | |
| Artefacts ignorés non servis comme produit | 10 | dc.html / support.js |
| AGENTS/CLAUDE à jour vs faits | 10 | |

---

## 7. Légal / RGPD — 100

| Critère | Pts | Règle |
|---------|----:|-------|
| Mentions légales complètes (SIRET, hébergeur) | 25 | |
| Confidentialité (Calendly, GA, droits) | 25 | |
| Bandeau cookies + localStorage | 20 | |
| GA seulement si `granted` | 15 | |
| Pas de RC Pro inventée | 15 | |

---

## Ancres de verdict

| Total | Lecture |
|------:|---------|
| 900–1000 | Prod exemplaire — polish mineur |
| 750–899 | Solide — corrections ciblées |
| 600–749 | Shipable avec dette visible |
| < 600 | Bloquants conversion / compliance / perf |
