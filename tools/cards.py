#!/usr/bin/env python3
"""Je Haltepunkt der Haus-Fahrt: passt die Karte ganz rein? (Wert >0 = Inhalt läuft unten raus)"""
import asyncio,sys
from playwright.async_api import async_playwright
OUT=(sys.argv[1] if len(sys.argv)>1 else '/tmp')+'/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for w,h,mob in ((360,740,True),(390,844,True),(430,932,True),(844,390,True),(1280,800,False),(1440,900,False)):
      pg=await b.new_page(viewport={'width':w,'height':h},is_mobile=mob,has_touch=mob,reduced_motion='reduce')
      await pg.goto('http://127.0.0.1:4370/',wait_until='networkidle'); await pg.wait_for_timeout(1200)
      se=await pg.evaluate("(()=>{const t=ScrollTrigger.getAll().find(t=>t.pin);return [t.start,t.end]})()")
      at=await pg.evaluate("window.__at"); bad=[]
      for k,v in sorted(at.items(),key=lambda x:x[1]):
        await pg.evaluate(f"scrollTo(0,{se[0]+(se[1]-se[0])*v})"); await pg.wait_for_timeout(600)
        r=await pg.evaluate("[...document.querySelectorAll('.sc')].filter(e=>+getComputedStyle(e).opacity>.5).map(e=>{const c=[...e.children].filter(x=>getComputedStyle(x).display!='none');return Math.round(c[c.length-1].getBoundingClientRect().bottom-e.getBoundingClientRect().bottom)})")
        bad.append(f"{k}:{r}")
        await pg.screenshot(path=f'{OUT}{w}x{h}-{k}.jpg',type='jpeg',quality=65)
      print(w,h,' '.join(bad)); await pg.close()
    await b.close()
asyncio.run(main())
