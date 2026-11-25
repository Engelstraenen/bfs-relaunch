#!/usr/bin/env python3
"""Screenshot je Kapitel (Abschnittsanfang + Mitte des Pins) in mehreren Größen."""
import sys, asyncio, os
from playwright.async_api import async_playwright
URL=sys.argv[1]; OUT=os.environ.get('SHOTS'); os.makedirs(OUT,exist_ok=True)
SIZES=[tuple(map(int,s.split('x'))) for s in os.environ.get('SIZES','1440x900,390x844').split(',')]
IDS=['gemeldet','geplant','vor-ort','arbeit','erledigt','dokumentiert','karriere','objekt','kontakt']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w,h in SIZES:
            pg=await b.new_page(viewport={'width':w,'height':h},is_mobile=w<700,has_touch=w<700)
            errs=[]; pg.on('pageerror',lambda e: errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1500)
            for i in IDS:
                for frac in (0.0,0.5):
                    y=await pg.evaluate(f"""(()=>{{const s=document.getElementById('{i}');const st=(window.ScrollTrigger&&ScrollTrigger.getAll().find(t=>t.pin===s));if(st)return st.start+(st.end-st.start)*{frac};return s.getBoundingClientRect().top+scrollY}})()""")
                    await pg.evaluate(f'window.scrollTo(0,{int(y)})'); await pg.wait_for_timeout(700)
                    await pg.screenshot(path=f'{OUT}/{w}x{h}_{i}_{int(frac*100)}.jpg',type='jpeg',quality=60)
            print(w,h,'errs',errs[:3]); await pg.close()
        await b.close()
asyncio.run(main())
