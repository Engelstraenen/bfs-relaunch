#!/usr/bin/env python3
"""4K-Rohbilder (assets-roh/<name>.jpg|png) -> site/assets/img/<name>-{1800,3840}.webp + manifest.js.
Nie hochskalieren: Breiten nur bis zur Originalbreite."""
import json, os, subprocess, glob
from PIL import Image, ImageFilter
R='assets-roh'; O='site/assets/img'; os.makedirs(O,exist_ok=True)
man={'img':{},'video':{}}
for f in sorted(glob.glob(f'{R}/*')):
    n,ext=os.path.splitext(os.path.basename(f))
    if ext.lower() not in ('.jpg','.jpeg','.png','.webp'): continue
    im=Image.open(f).convert('RGB'); W,H=im.size; sizes=[]
    im=im.filter(ImageFilter.UnsharpMask(radius=1.6,percent=70,threshold=2))  # V2.65 nachschärfen
    for w in (1800,2560,3840):
        if w>W: continue
        out=f'{O}/{n}-{w}.webp'
        if not os.path.exists(out) or os.path.getmtime(out)<os.path.getmtime(f):
            im.resize((w,round(H*w/W)),Image.LANCZOS).save(out,'WEBP',quality=84 if w>2000 else 82,method=6)
        sizes.append(w)
    man['img'][n]={'sizes':sizes,'w':W,'h':H}
for v in glob.glob('site/assets/video/*-desktop.mp4'):
    n=os.path.basename(v).replace('-desktop.mp4','')
    e={'desktop':f'assets/video/{n}-desktop.mp4'}
    if os.path.exists(f'site/assets/video/{n}-mobile.mp4'): e['mobile']=f'assets/video/{n}-mobile.mp4'
    man['video'][n]=e
open('site/assets/manifest.js','w').write('window.ASSETS='+json.dumps(man)+';\n')
print(json.dumps(man,indent=0)[:800])
