#!/usr/bin/env python3
"""Korrektur 24.11.2026: Start (Schlüssel), Haus-Größe, fehlendes Nachher-Bild sauber ausblenden."""
import os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'site'))
t = open('styles.css').read()
rep = [
    ('.stage{position:relative;height:520vh;background:radial-gradient(120% 80% at 70% 40%,#fff 0%,#f4f1ec 70%,#ece7df 100%)}',
     '.stage{position:relative;height:520vh;background:#fff}'),
    ('.stage__title{position:absolute;left:var(--pad);top:50%;transform:translateY(-50%);z-index:3;max-width:min(900px,92vw)}',
     '.stage__title{position:absolute;left:var(--pad);top:50%;transform:translateY(-50%);z-index:3;max-width:92vw}\n@media (min-width:1025px){.stage h1 .t1{white-space:nowrap}}'),
    ('.keys{position:absolute;right:-4vw;top:50%;width:min(64vw,1150px);transform:translateY(-50%);z-index:4;pointer-events:none}\n.keys__img{width:100%;mix-blend-mode:multiply}',
     '.keys{position:absolute;right:-2vw;top:50%;width:min(50vw,94vh);transform:translateY(-50%);z-index:4;pointer-events:none;mix-blend-mode:multiply}\n.keys__img{width:100%}'),
    ('.house{position:absolute;inset:0;z-index:2;pointer-events:none}\n.house__img{position:absolute;left:50%;top:52%;width:min(92vw,1500px);transform:translate(-50%,-50%);mix-blend-mode:multiply;opacity:0}',
     '.house{position:absolute;inset:0;pointer-events:none}\n.house__img{position:absolute;left:46%;top:53%;height:min(84vh,52vw);width:auto;max-width:none;transform:translate(-50%,-50%);opacity:0}'),
    ('  .keys{width:120vw;right:-38vw;top:30%}\n  .house__img{width:150vw;top:42%}',
     '  .keys{width:96vw;right:-22vw;top:28%}\n  .house__img{height:58vh;height:58svh;left:50%;top:40%}'),
    ('  .keys{width:52vw;top:52%}',
     '  .keys{width:44vw;top:50%}\n  .house__img{height:80vh}'),
]
for a, b in rep:
    if b in t:
        continue
    assert a in t, a[:70]
    t = t.replace(a, b)
open('styles.css', 'w').write(t)

j = open('main.js').read()
rep_js = [
    ("if (!A.img['room-before'] && !A.video.renovation) $('#vorher-nachher')?.classList.add('is-missing');",
     "if (!A.img['room-before'] && !A.video.renovation) $('#vorher-nachher')?.classList.add('is-missing');\n    if (!A.img['room-after']) { $('.film__wipe')?.classList.add('is-missing'); $('.f-after')?.classList.add('is-missing'); $$('.film__label').forEach((l) => l.classList.add('is-missing')); }"),
    ("const sw = seg(p, .45, .6); fb.style.opacity = 1 - sw; fa.style.opacity = sw;",
     "const sw = A.img['room-after'] ? seg(p, .45, .6) : 0; fb.style.opacity = 1 - sw; fa.style.opacity = sw;"),
    ("    } else x = 1 - seg(p, .08, .9);",
     "    } else x = A.img['room-after'] ? 1 - seg(p, .08, .9) : 1;"),
]
for a, b in rep_js:
    if b in j:
        continue
    assert a in j, a[:70]
    j = j.replace(a, b)
open('main.js', 'w').write(j)
print('ok')
