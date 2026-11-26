#!/usr/bin/env python3
"""Lädt die per Zwischenablage übergebenen sjinn-Bild-URLs (JSON nach 'HWURLS') nach assets-roh/<id klein>.png, nur neue."""
import json, subprocess, os
t = subprocess.run(['pbpaste'], capture_output=True, text=True).stdout
assert t.startswith('HWURLS'), 'Zwischenablage passt nicht: ' + t[:20]
for k, u in json.loads(t[6:]).items():
    assert u.startswith('https://edit.comfyonline.app/'), u[:40]
    out = f'assets-roh/{k.lower()}.png'
    if os.path.exists(out): continue
    subprocess.run(['curl', '-sL', '-o', out, u], check=True)
    wh = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', out], capture_output=True, text=True).stdout.split()
    print(k, wh[-3], wh[-1])
