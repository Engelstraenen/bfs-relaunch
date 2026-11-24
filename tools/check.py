#!/usr/bin/env python3
"""Headless-Prüfung: Konsolenfehler, Querscroll, Kopfzeile, Screenshots je Größe und Scrollstand."""
import sys, asyncio, os
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4370/'
OUT=os.environ.get('SHOTS','/private/tmp/claude-501/shots'); os.makedirs(OUT,exist_ok=True)
SIZES=[tuple(map(int,s.split('x'))) for s in os.environ.get('SIZES','1440x900,1280x800,390x844,360x740,430x932,844x390').split(',')]
STOPS=[float(x) for x in (sys.argv[2].split(',') if len(sys.argv)>2 else '0,0.03,0.08,0.13,0.17,0.22,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1'.split(','))]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w,h in SIZES:
            pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=1,is_mobile=w<700,has_touch=w<700)
            errs=[]; pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(800)
            H=await pg.evaluate('document.documentElement.scrollHeight')
            res=[]
            for s in STOPS:
                y=int((H-h)*s)
                await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(450)
                ox=await pg.evaluate('document.documentElement.scrollWidth-window.innerWidth')
                nav=await pg.evaluate('Math.max(...[...document.querySelectorAll(".nav > *")].filter(e=>getComputedStyle(e).display!="none").map(e=>e.getBoundingClientRect().right))-window.innerWidth')
                small=await pg.evaluate('''[...document.querySelectorAll("p,li,a,span,label,button,small,time")].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return false;const cs=getComputedStyle(e);return e.innerText&&e.innerText.trim()&&parseFloat(cs.fontSize)<13.5&&cs.visibility!="hidden"&&cs.opacity!="0"}).length''')
                fn=f'{OUT}/{w}x{h}_{int(s*100):03d}.jpg'
                await pg.screenshot(path=fn,type='jpeg',quality=55)
                res.append(f'{s:.2f}:ox{ox} nav{round(nav)} sm{small}')
            print(f'{w}x{h} H={H} errs={len(errs)} {errs[:3]}'); print('  '+' | '.join(res))
            await pg.close()
        await b.close()
asyncio.run(main())
