#!/usr/bin/env python3
"""Kamerafahrt prüfen: Haus-Skalierung über den ganzen Pin-Weg + Screens je Haltepunkt."""
import asyncio, sys, json
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4370/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/ride/'
async def run(b, tag, w, h, mob):
    pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=mob, has_touch=mob, reduced_motion='reduce')
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    await pg.goto(URL, wait_until='networkidle'); await pg.wait_for_timeout(1500)
    se = await pg.evaluate("(()=>{const t=ScrollTrigger.getAll().find(t=>t.pin);return [t.start,t.end]})()")
    rows = []
    for i in range(0, 101):
        p = i / 100; await pg.evaluate(f'scrollTo(0,{se[0] + (se[1]-se[0])*p})'); await pg.wait_for_timeout(60)
        r = await pg.evaluate("(()=>{const m=new DOMMatrix(getComputedStyle(document.querySelector('#house')).transform);const v=[...document.querySelectorAll('.sc')].filter(e=>+getComputedStyle(e).opacity>.5).map(e=>e.id);return [m.a,v]})()")
        rows.append((p, round(r[0], 3), r[1]))
    at = await pg.evaluate("window.__at")
    for name, p in [('0intro', .05)] + sorted(at.items(), key=lambda x: x[1]):
        await pg.evaluate(f'scrollTo(0,{se[0] + (se[1]-se[0])*p})'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'{OUT}{tag}-{int(p*100):02d}-{name}.jpg', type='jpeg', quality=70)
    over = await pg.evaluate("document.documentElement.scrollWidth>innerWidth")
    await pg.close(); return rows, errs, over
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for tag, w, h, mob in (('laptop', 1440, 900, False), ('handy', 390, 844, True)):
            rows, errs, over = await run(b, tag, w, h, mob)
            print(tag, 'Fehler:', errs[:3], 'Querscroll:', over)
            print(' '.join(f"{int(p*100)}:{s}{'['+','.join(c.replace('c-','') for c in v)+']' if v else ''}" for p, s, v in rows[::3]))
        await b.close()
asyncio.run(main())
