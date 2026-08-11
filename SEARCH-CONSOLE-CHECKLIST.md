# Search Console — checklist post-deploy (manuel)

À faire après mise en ligne des changements SEO (cannibalisation Flers / métiers, maillage, geo-answer home, profondeur outils).

## 1. Sitemap

- [ ] Ouvrir [Google Search Console](https://search.google.com/search-console) → propriété `automatex-hub.com`
- [ ] Sitemaps → resoumettre `https://automatex-hub.com/sitemap.xml`
- [ ] Vérifier « Succès » (pas d’erreur de lecture)

## 2. Demande d’indexation (URLs gagnantes + retargetées)

Inspection d’URL → « Demander une indexation » pour :

| Intention | URL |
|-----------|-----|
| Brand / home | `https://automatex-hub.com/` |
| Zone Flers (gagnante) | `https://automatex-hub.com/automatisation-artisans-flers-orne/` |
| Agence France | `https://automatex-hub.com/agence-automatisation-artisans/` |
| Agence n8n | `https://automatex-hub.com/agence-n8n-artisans/` |
| Article Flers retargeté | `https://automatex-hub.com/articles/agence-automatisation-flers-orne/` |
| Couvreurs | `https://automatex-hub.com/couvreurs/` |
| Menuisiers | `https://automatex-hub.com/menuisiers/` |
| How-to couvreur / menuisier / plombier / plaquiste / électricien | `/articles/automatisation-*-devis/` |
| Remplacer admin devis | `https://automatex-hub.com/articles/remplacer-admin-devis-artisan/` |
| Relance (méthode) | `https://automatex-hub.com/articles/relance-devis-automatique/` |
| Obat + Gmail | `https://automatex-hub.com/articles/automatiser-obat-gmail-artisan/` |
| Gmail outil | `https://automatex-hub.com/outils/gmail-relances-devis/` |
| WhatsApp / Outlook / Sheets | les 3 autres `/outils/*/` |
| **llms.txt (GEO)** | `https://automatex-hub.com/llms.txt` (vérifier accessibilité ; pas forcément « indexation » classique) |

## 2b. Citation IA (GEO)

- [ ] Ouvrir `https://automatex-hub.com/llms.txt` en prod (200, markdown lisible)
- [ ] Vérifier `https://automatex-hub.com/ai/facts.md` · `offre.md` · `faq.md`
- [ ] Header `Link: </llms.txt>; rel="describedby"` présent (Netlify)
- [ ] Tester un prompt type : « Quelle agence automatise les devis artisans à Flers ? » / « Prix AutomateX-HUB »

## 3. Surveillance cannibalisation (7–14 jours)

Performances → Filtrer par requête / page :

- [ ] « Flers » / « automatisation Flers » : le trafic doit se concentrer sur `/automatisation-artisans-flers-orne/` (article = preuves / pourquoi local)
- [ ] « devis couvreur » / « automatisation couvreur » : landing `/couvreurs/` vs article how-to — plus de partage 50/50 sur le même intent commercial
- [ ] Idem menuisier

## 4. Impressions à suivre

Créer (ou noter) un suivi sur :

- Flers / Orne / Bocage
- couvreur devis / automatisation couvreur
- menuisier devis
- Obat Gmail
- relance devis

## 5. Hors code (E-E-A-T)

- [ ] Google Business Profile aligné NAP (50 rue de l’Équerre, Saint-Georges-des-Groseillers)
- [ ] Citations locales / annuaires Orne quand possible
