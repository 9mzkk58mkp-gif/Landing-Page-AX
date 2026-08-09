#!/usr/bin/env python3
"""AutomateX-HUB — objective checks for audit /1000.

Prints a human report + JSON block. Exit 0 always (scoring, not CI gate)
unless --strict and blockers found (exit 1).
"""
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIR = {".git", "node_modules", "lighthouse-reports", ".cursor"}
SKIP_FILES = {"Landing AutomateX-HUB.dc.html", "support.js"}

FORBIDDEN = [
    (r"D[ÉE]CLIC|SYST[ÈE]ME|PILOTE", "grille tarifaire 3 offres"),
    (r"diagnostiqueur", "cible hors bâtiment"),
    (r"\bcourtiers?\b", "cible hors bâtiment"),
    (r"fonts\.googleapis\.com", "Google Fonts CDN"),
    (r"cdn\.simpleicons\.org", "Simple Icons CDN"),
]
REFUND_RX = re.compile(
    r"(?:30\s*(?:&nbsp;)?\s*j(?:ours)?\s*rembours|satisfait\s+ou\s+rembours)",
    re.I,
)
REFUND_DENIAL_RX = re.compile(
    r"(?:pas de garantie|aucune garantie|pas de\s*[«\"].{0,30}30)",
    re.I,
)
SOFT_FLAGS = [
    (r"ex-couvreur", "identité: ex-couvreur"),
    (r"ancien\s+menuisier(?!\s+devenu)", "identité: ancien menuisier"),
]
REQUIRED_SNIPPETS = [
    ("390", "prix 390"),
    ("99", "prix 99/mois"),
    ("Démo gratuite 20 min sur ton cas", "CTA exact"),
    ("menuisier devenu développeur", "identité fondateur"),
    ("50 rue de l'Équerre", "NAP rue"),
    ("ax_cookie_consent", "clé consent cookies"),
]


@dataclass
class Finding:
    level: str  # blocker | warn | ok | info
    code: str
    message: str
    path: str = ""


@dataclass
class Report:
    findings: list[Finding] = field(default_factory=list)
    auto_points: dict[str, int] = field(default_factory=dict)
    auto_max: dict[str, int] = field(default_factory=dict)
    stats: dict = field(default_factory=dict)

    def add(self, level: str, code: str, message: str, path: str = "") -> None:
        self.findings.append(Finding(level, code, message, path))

    def award(self, bucket: str, points: int, maximum: int) -> None:
        self.auto_points[bucket] = max(0, min(points, maximum))
        self.auto_max[bucket] = maximum


def iter_html() -> list[Path]:
    out = []
    for p in ROOT.rglob("*.html"):
        if any(s in p.parts for s in SKIP_DIR):
            continue
        if p.name in SKIP_FILES or p.name.startswith("Landing"):
            continue
        out.append(p)
    return out


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="replace")


def check_forbidden(rep: Report) -> None:
    hits = 0
    soft = 0
    files = list(iter_html()) + [ROOT / "script.js"]
    for path in files:
        if not path.is_file():
            continue
        text = read(path)
        rel = str(path.relative_to(ROOT))
        for rx, label in FORBIDDEN:
            if re.search(rx, text, re.I):
                hits += 1
                rep.add("blocker", "forbidden", f"{label}", rel)
        for m in REFUND_RX.finditer(text):
            start = max(0, m.start() - 80)
            window = text[start : m.end() + 20]
            if REFUND_DENIAL_RX.search(window):
                continue
            hits += 1
            rep.add("blocker", "forbidden", "garantie remboursement affirmative", rel)
        for rx, label in SOFT_FLAGS:
            if re.search(rx, text, re.I):
                soft += 1
                rep.add("warn", "identity-soft", label, rel)
    # copy bucket auto: 80 max from forbidden/identity
    pts = 80
    pts -= min(80, hits * 20)
    pts -= min(20, soft * 5)
    rep.award("copy_auto", pts, 80)
    if hits == 0:
        rep.add("ok", "forbidden", "aucun motif interdit produit")


def check_required(rep: Report) -> None:
    blob = "\n".join(read(p) for p in iter_html() if p.name == "index.html")
    blob += "\n" + read(ROOT / "script.js") if (ROOT / "script.js").is_file() else ""
    # also scan all html for CTA/prix presence rates
    all_html = "\n".join(read(p) for p in iter_html())
    pts = 40
    for needle, label in REQUIRED_SNIPPETS:
        where = all_html if needle not in ("ax_cookie_consent",) else (read(ROOT / "script.js") if (ROOT / "script.js").is_file() else "")
        if needle == "ax_cookie_consent":
            ok = needle in where
        elif needle in ("390", "99"):
            ok = needle in all_html
        else:
            ok = needle in all_html
        if ok:
            rep.add("ok", "required", label)
        else:
            pts -= 8
            rep.add("blocker", "required", f"manque: {label}")
    rep.award("required_auto", max(0, pts), 40)


def exists_path(path: str) -> bool:
    path = path.split("?")[0].split("#")[0]
    if not path or path == "/":
        return (ROOT / "index.html").is_file()
    rel = unquote(path.lstrip("/"))
    fp = ROOT / rel
    if fp.is_file():
        return True
    if (ROOT / rel / "index.html").is_file():
        return True
    if rel.endswith("/") and (ROOT / rel / "index.html").is_file():
        return True
    return False


def check_links(rep: Report) -> None:
    attr_re = re.compile(r"""\b(?:href|src|data-defer-src)=["']([^"']+)["']""", re.I)
    broken = []
    checked = 0
    for html in iter_html():
        for raw in attr_re.findall(read(html)):
            raw = raw.strip()
            if not raw or raw.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                continue
            if raw.startswith("http://") or raw.startswith("https://"):
                p = urlparse(raw)
                if p.netloc not in ("automatex-hub.com", "www.automatex-hub.com"):
                    continue
                path = p.path or "/"
            elif raw.startswith("//"):
                continue
            elif raw.startswith("/"):
                path = urlparse(raw).path
            else:
                try:
                    path = "/" + str((html.parent / raw).resolve().relative_to(ROOT)).replace("\\", "/")
                except ValueError:
                    continue
            checked += 1
            if not exists_path(path):
                broken.append((str(html.relative_to(ROOT)), raw, path))
    rep.stats["links_checked"] = checked
    rep.stats["links_broken"] = len(broken)
    pts = 40
    if broken:
        pts = max(0, 40 - len(broken) * 8)
        for src, raw, path in broken[:15]:
            rep.add("blocker", "broken-link", f"{raw} → {path}", src)
    else:
        rep.add("ok", "broken-link", f"0 cassé ({checked} liens internes)")
    rep.award("links_auto", pts, 40)


def check_sitemap(rep: Report) -> None:
    sm = ROOT / "sitemap.xml"
    if not sm.is_file():
        rep.add("blocker", "sitemap", "sitemap.xml manquant")
        rep.award("sitemap_auto", 0, 25)
        return
    locs = re.findall(r"<loc>([^<]+)</loc>", read(sm))
    missing = []
    for loc in locs:
        path = urlparse(loc).path or "/"
        if not exists_path(path):
            missing.append(loc)
    # outils + 404 presence
    if not (ROOT / "outils" / "index.html").is_file():
        rep.add("warn", "sitemap", "page /outils/ absente")
    if not (ROOT / "404.html").is_file():
        rep.add("blocker", "404", "404.html manquant")
        miss404 = True
    else:
        miss404 = False
        t = read(ROOT / "404.html")
        if "Revenir au site" not in t:
            rep.add("warn", "404", "bouton Revenir au site manquant")
        if 'href="/styles.min.css' not in t and "href='/styles.min.css" not in t:
            rep.add("warn", "404", "CSS 404 devrait être en chemin absolu")
        else:
            rep.add("ok", "404", "404.html branded OK")
    pts = 25
    pts -= min(25, len(missing) * 5)
    if miss404:
        pts = max(0, pts - 10)
    for loc in missing:
        rep.add("blocker", "sitemap", f"URL sitemap absente: {loc}")
    if not missing:
        rep.add("ok", "sitemap", f"{len(locs)} URLs OK")
    rep.stats["sitemap_urls"] = len(locs)
    rep.award("sitemap_auto", max(0, pts), 25)


def check_stack(rep: Report) -> None:
    pts = 25
    smells = [
        (ROOT / "package.json", "package.json présent — vérifier pas d’app Next"),
        (ROOT / "next.config.js", "next.config.js"),
        (ROOT / "next.config.mjs", "next.config.mjs"),
        (ROOT / "app" / "layout.tsx", "App Router détecté"),
        (ROOT / "vite.config.ts", "Vite détecté"),
    ]
    for path, label in smells:
        if path.exists():
            # package.json may exist for lighthouse only — warn not full deduct
            if path.name == "package.json":
                rep.add("info", "stack", label, str(path.relative_to(ROOT)))
            else:
                pts -= 15
                rep.add("blocker", "stack", label, str(path.relative_to(ROOT)))
    if (ROOT / "styles.css").is_file() and (ROOT / "styles.min.css").is_file():
        rep.add("ok", "css", "styles.css + styles.min.css présents")
    else:
        pts -= 10
        rep.add("blocker", "css", "paire styles.css / styles.min.css incomplète")
    robots = ROOT / "robots.txt"
    if robots.is_file() and "sitemap.xml" in read(robots).lower():
        rep.add("ok", "robots", "robots.txt pointe le sitemap")
    else:
        pts -= 5
        rep.add("warn", "robots", "robots.txt / sitemap")
    rep.award("stack_auto", max(0, pts), 25)


def check_perf_heuristics(rep: Report) -> None:
    pts = 50
    html_js = "\n".join(read(p) for p in iter_html())
    html_js += "\n" + (read(ROOT / "script.js") if (ROOT / "script.js").is_file() else "")
    css = read(ROOT / "styles.css") if (ROOT / "styles.css").is_file() else ""
    if re.search(r"fonts\.googleapis|fonts\.gstatic", html_js + css, re.I):
        pts -= 20
        rep.add("blocker", "perf", "Google Fonts CDN")
    else:
        rep.add("ok", "perf", "pas de Google Fonts CDN")
    if "/assets/fonts/" in html_js or "assets/fonts/" in html_js:
        rep.add("ok", "perf", "fonts self-host référencées")
    else:
        pts -= 10
        rep.add("warn", "perf", "fonts self-host non détectées dans HTML")
    if "data-defer-src" in html_js or 'loading="lazy"' in html_js:
        rep.add("ok", "perf", "lazy/defer images détecté")
    else:
        pts -= 10
        rep.add("warn", "perf", "peu de lazy/defer images")
    nt = ROOT / "netlify.toml"
    if nt.is_file():
        t = read(nt)
        if "woff2" in t and "Cache-Control" in t:
            rep.add("ok", "perf", "headers cache fonts Netlify")
        else:
            pts -= 8
            rep.add("warn", "perf", "headers cache fonts incomplets")
    else:
        pts -= 8
        rep.add("warn", "perf", "netlify.toml manquant")
    # GA consent
    js = read(ROOT / "script.js") if (ROOT / "script.js").is_file() else ""
    if "G-GZG5DWRGKF" in js and "ax_cookie_consent" in js:
        rep.add("ok", "perf", "GA derrière consent")
    else:
        pts -= 10
        rep.add("warn", "perf", "GA/consent à vérifier")
    rep.award("perf_auto", max(0, pts), 50)


def check_seo_sample(rep: Report) -> None:
    pts = 40
    samples = [
        ROOT / "index.html",
        ROOT / "couvreurs" / "index.html",
        ROOT / "outils" / "index.html",
        ROOT / "articles" / "index.html",
        ROOT / "automatisation-artisans-flers-orne" / "index.html",
    ]
    for path in samples:
        if not path.is_file():
            pts -= 5
            rep.add("warn", "seo", "page sample manquante", str(path.relative_to(ROOT)))
            continue
        t = read(path)
        rel = str(path.relative_to(ROOT))
        h1 = len(re.findall(r"<h1\b", t, re.I))
        if h1 != 1:
            pts -= 4
            rep.add("warn", "seo", f"{h1} H1 (attendu 1)", rel)
        if 'rel="canonical"' not in t and "rel='canonical'" not in t:
            pts -= 3
            rep.add("warn", "seo", "canonical manquant", rel)
        if "application/ld+json" not in t and path.name:
            # articles hub may still have it
            if path.parent.name != "articles" or path.name == "index.html":
                if path == ROOT / "articles" / "index.html":
                    pass  # soft
                elif "ld+json" not in t:
                    pts -= 2
                    rep.add("info", "seo", "pas de JSON-LD visible", rel)
        faq = len(re.findall(r'"@type"\s*:\s*"FAQPage"', t))
        if faq > 1:
            pts -= 8
            rep.add("blocker", "seo", f"{faq} FAQPage (max 1)", rel)
    rep.award("seo_auto", max(0, pts), 40)


def check_conversion(rep: Report) -> None:
    pts = 30
    home = ROOT / "index.html"
    js = ROOT / "script.js"
    if home.is_file():
        t = read(home)
        if "js-calendly" in t:
            rep.add("ok", "conv", "js-calendly sur home")
        else:
            pts -= 10
            rep.add("warn", "conv", "js-calendly manquant home")
        if "sticky-cta" in t:
            rep.add("ok", "conv", "sticky CTA home")
        else:
            pts -= 8
            rep.add("warn", "conv", "sticky CTA manquant")
    if js.is_file():
        j = read(js)
        if "CALENDLY_URL" in j and "popup" in j.lower() or "Calendly" in j:
            rep.add("ok", "conv", "Calendly géré dans script.js")
        else:
            pts -= 8
            rep.add("warn", "conv", "popup Calendly à vérifier")
    rep.award("conv_auto", max(0, pts), 30)


def main() -> int:
    ap = argparse.ArgumentParser(description="AutomateX-HUB objective audit helpers")
    ap.add_argument("--json", action="store_true", help="print JSON only")
    ap.add_argument("--strict", action="store_true", help="exit 1 if blockers")
    args = ap.parse_args()

    rep = Report()
    check_forbidden(rep)
    check_required(rep)
    check_links(rep)
    check_sitemap(rep)
    check_stack(rep)
    check_perf_heuristics(rep)
    check_seo_sample(rep)
    check_conversion(rep)

    auto_total = sum(rep.auto_points.values())
    auto_max = sum(rep.auto_max.values())
    # Scale objective band into ~330 of the 1000 (agents do the rest qualitatively)
    # Keep raw auto for agents; also provide suggested_floor
    blockers = [f for f in rep.findings if f.level == "blocker"]
    warns = [f for f in rep.findings if f.level == "warn"]

    payload = {
        "auto_points": rep.auto_points,
        "auto_max": rep.auto_max,
        "auto_total": auto_total,
        "auto_max_total": auto_max,
        "suggested_objective_band": f"{auto_total}/{auto_max} (sous-ensemble automatisé — agents complètent jusqu'à /1000)",
        "stats": rep.stats,
        "blocker_count": len(blockers),
        "warn_count": len(warns),
        "findings": [asdict(f) for f in rep.findings],
    }

    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print("=== AutomateX-HUB ax-score (objectif) ===")
        print(f"Auto: {auto_total}/{auto_max}")
        print(f"Blockers: {len(blockers)} · Warns: {len(warns)}")
        print(f"Stats: {rep.stats}")
        print("\n-- Findings --")
        for f in rep.findings:
            loc = f" @ {f.path}" if f.path else ""
            print(f"[{f.level}] {f.code}: {f.message}{loc}")
        print("\n-- Auto buckets --")
        for k, v in rep.auto_points.items():
            print(f"  {k}: {v}/{rep.auto_max[k]}")
        print("\nJSON_START")
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        print("JSON_END")
        print("\nEnsuite: skill ax-audit-1000 → score qualitatif domaines → TOTAL/1000")

    if args.strict and blockers:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
