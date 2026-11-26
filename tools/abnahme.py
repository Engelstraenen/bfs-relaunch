#!/usr/bin/env python3
"""Abnahme W1: je Kapitel Storyboard-Panel + Seite Laptop + Seite Handy -> abnahme/*.jpg"""
import asyncio, os
from playwright.async_api import async_playwright
from PIL import Image
SB = 'konzepte/v4-1-schnitt.png'; OUT = 'abnahme/'; URL = 'http://127.0.0.1:4370/'
os.makedirs(OUT, exist_ok=True)
# (Kapitel, Art, Wert): pin = Fortschritt der Haus-Fahrt, sel = Abschnitt
CH = [('start', 'sel', '#start'), ('haus', 'pin', .08), ('keller', 'at', 'keller'), ('eg', 'at', 'eg'),
      ('og', 'at', 'og'), ('dach', 'at', 'dach'), ('koord', 'at', 'koordination'), ('team', 'sel', '#team'), ('werte', 'sel', '#werte'),
      ('aussen', 'at', 'aussen'), ('z-planung', 'zpage', '#planung'), ('z-umbau', 'zpage', '#umbau'), ('z-koord', 'zpage', '#koordination'), ('firma', 'firma', 'eg')]
sb = Image.open(SB).convert('RGB'); W, H = sb.size; pw, ph = W / 3, H / 3
for i in range(9):
    r, c = divmod(i, 3)
    sb.crop((int(c * pw + 4), int(r * ph + 4), int((c + 1) * pw - 4), int((r + 1) * ph - 4))).save(f'{OUT}{i+1}-storyboard.jpg', quality=86)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for tag, w, h, mob in (('laptop', 1440, 900, False), ('handy', 390, 844, True)):
            pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob)
            await pg.goto(URL, wait_until='networkidle'); await pg.wait_for_timeout(2500)
            for i, (name, kind, val) in enumerate(CH):
                if kind == 'zpage':
                    if 'zusatz' not in pg.url: await pg.goto(URL + 'zusatzleistungen.html', wait_until='networkidle'); await pg.wait_for_timeout(1500)
                    await pg.evaluate(f"document.querySelector('{val}').scrollIntoView()"); await pg.wait_for_timeout(2600)
                    await pg.screenshot(path=f'{OUT}{i+1}-{tag}.jpg', type='jpeg', quality=78); continue
                if kind == 'firma':
                    await pg.goto(URL + '?anlage=firma', wait_until='networkidle'); await pg.wait_for_timeout(2000)
                    kind = 'at'
                if kind == 'at':
                    y = await pg.evaluate(f"(()=>{{const t=ScrollTrigger.getAll().find(t=>t.pin);return t.start+(t.end-t.start)*window.__at['{val}']}})()")
                elif kind == 'pin':
                    y = await pg.evaluate(f"(()=>{{const t=ScrollTrigger.getAll().find(t=>t.pin);return t.start+(t.end-t.start)*{val}}})()")
                else:
                    y = await pg.evaluate(f"document.querySelector('{val}').getBoundingClientRect().top+scrollY-({0 if val=='#start' else 60})")
                await pg.evaluate(f'scrollTo(0,{int(y)})'); await pg.wait_for_timeout(1600)
                await pg.screenshot(path=f'{OUT}{i+1}-{tag}.jpg', type='jpeg', quality=78)
            await pg.close()
        await b.close()
asyncio.run(main())
print('ok')
