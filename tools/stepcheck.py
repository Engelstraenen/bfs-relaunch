#!/usr/bin/env python3
"""Prüft, welcher Status in der Leiste je Kapitel aktiv ist."""
import asyncio, sys
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4370/'
IDS = ['gemeldet', 'geplant', 'vor-ort', 'arbeit', 'erledigt', 'dokumentiert', 'karriere']
JS = """(id)=>{const s=document.getElementById(id);const st=ScrollTrigger.getAll().find(t=>t.pin===s);return st?st.start+(st.end-st.start)*.5:s.getBoundingClientRect().top+scrollY}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for w, h in ((1440, 900), (390, 844)):
            pg = await b.new_page(viewport={'width': w, 'height': h})
            await pg.goto(URL, wait_until='networkidle'); await pg.wait_for_timeout(1200)
            out = []
            for i in IDS:
                y = await pg.evaluate(JS, i)
                await pg.evaluate('y=>scrollTo(0,y)', int(y)); await pg.wait_for_timeout(500)
                out.append(i + '=' + str(await pg.evaluate("(document.querySelector('.status a.on span')||{}).textContent")))
            print(w, ' '.join(out)); await pg.close()
        await b.close()
asyncio.run(main())
