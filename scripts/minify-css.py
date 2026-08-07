#!/usr/bin/env python3
"""Régénère styles.min.css depuis styles.css (source lisible)."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / "styles.css"
dst = ROOT / "styles.min.css"

if not src.is_file():
    sys.exit(f"Missing {src}")

css = src.read_text(encoding="utf-8")
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
css = re.sub(r"\s+", " ", css)
css = re.sub(r"\s*([{}:;,>~+])\s*", r"\1", css)
css = css.replace(";}", "}")
dst.write_text(css.strip() + "\n", encoding="utf-8")
print(f"Wrote {dst.relative_to(ROOT)} ({dst.stat().st_size} bytes)")
