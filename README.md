# AutomateX-HUB — Landing

Site marketing statique (HTML/CSS/JS) pour artisans du bâtiment — Flers / Orne.  
Déploiement prévu : **Netlify** → `https://automatex-hub.com`.

## Pour les humains
```bash
python3 scripts/serve.py
# → http://127.0.0.1:8765/
```

Éditer le CSS dans `styles.css`, puis :
```bash
python3 scripts/minify-css.py
```

## Pour les agents IA
Lire **[AGENTS.md](./AGENTS.md)** et `.cursor/rules/` avant toute modification.

## Stack
- Pages HTML (App-like folders avec `index.html`)
- `styles.min.css` + `script.js`
- Calendly popup · GA4 derrière consentement · sticky CTA mobile

## Déployer
1. Connecter ce dossier à Netlify (`netlify.toml` déjà là)
2. DNS Squarespace → Netlify
3. Search Console + sitemap `https://automatex-hub.com/sitemap.xml`
