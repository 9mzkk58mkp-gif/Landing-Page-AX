#!/usr/bin/env python3
"""Serveur local avec gzip — proche de Netlify pour Lighthouse."""
import gzip
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
PORT = 8765


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        if path.endswith("/"):
            path += "index.html"
        fs = (ROOT / path.lstrip("/")).resolve()
        if not str(fs).startswith(str(ROOT)) or not fs.is_file():
            self.send_error(404)
            return
        data = fs.read_bytes()
        ctype = mimetypes.guess_type(str(fs))[0] or "application/octet-stream"
        if fs.suffix == ".woff2":
            ctype = "font/woff2"
        headers = [
            ("Content-Type", ctype),
            ("Cache-Control", "no-cache"),
            ("Connection", "close"),
        ]
        enc = self.headers.get("Accept-Encoding", "")
        if "gzip" in enc and fs.suffix in {
            ".html",
            ".css",
            ".js",
            ".svg",
            ".json",
            ".xml",
            ".txt",
        }:
            data = gzip.compress(data, compresslevel=6)
            headers += [("Content-Encoding", "gzip"), ("Vary", "Accept-Encoding")]
        headers.append(("Content-Length", str(len(data))))
        self.send_response(200)
        for key, value in headers:
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(data)

    do_HEAD = do_GET


if __name__ == "__main__":
    print(f"AutomateX-HUB → http://127.0.0.1:{PORT}/  (root: {ROOT})")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
