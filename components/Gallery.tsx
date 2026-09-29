"use client";

/* ════════════════════════════════════════════════════════════════
   GALLERY → "Step inside" — a bento contact sheet

   · bento mosaic driven by GALLERY_GRID `span` (f 2×2 · w 2×1 ·
     t 1×2), closed out by an Instagram tile so the grid is square
   · spotlight filter — matching photos stay lit, the rest drop into
     the dark, so the layout never jumps
   · a warm light follows the pointer across each tile
   · immersive lightbox: arrow keys, swipe, thumbnail rail, Esc

   Dynamic state rides on data-* attributes, never className, so the
   scroll-reveal "in" class can't be wiped by a re-render.
   ════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY_GRID, SITE } from "@/lib/data";
import { grow, shrink } from "@/lib/hooks";
import { Arrow } from "@/components/Chrome";
import { Label } from "@/components/Kit";

const ITEMS = GALLERY_GRID;
const N = ITEMS.length;
const TAGS = ["All", ...Array.from(new Set(ITEMS.map((g) => g.tag)))];
const countOf = (t: string) => (t === "All" ? N : ITEMS.filter((g) => g.tag === t).length);
const pad = (n: number) => String(n).padStart(2, "0");

/* warm light follows the pointer */
const light = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((delta: number) => {
    setDir(delta > 0 ? 1 : -1);
    setOpen((o) => (o === null ? o : (o + delta + N) % N));
  }, []);

  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, go]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const lb = open !== null ? ITEMS[open] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Inside Café de Bangkok, Kochi",
    description: "The dining room, the pass and the plates at Café de Bangkok, Kadavanthra.",
    image: ITEMS.map((g) => g.img),
  };

  return (
    <section id="gallery" className="gx nm" aria-labelledby="gx-title">
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="shell">
        <header className="gx-head">
          <div>
            <Label no="03" className="reveal">The Room</Label>
            <h2 className="nm-h2 reveal d1" id="gx-title">Step <em>inside</em></h2>
          </div>
          <div className="gx-side reveal d2">
            <p className="nm-lede">Lanterns, long shadows, and a room built to gather.</p>
            <div className="gx-chips" role="group" aria-label="Highlight photos by theme">
              {TAGS.map((t) => (
                <button
                  key={t}
                  className="gx-chip"
                  aria-pressed={filter === t}
                  onClick={() => setFilter(t)}
                  onMouseEnter={grow()}
                  onMouseLeave={shrink}
                >
                  {t}<em>{countOf(t)}</em>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="gx-grid" data-filter={filter}>
          {ITEMS.map((g, i) => (
            <div key={g.cap} className={`gx-cell s-${g.span || "n"} reveal d${(i % 4) + 1}`}>
              <button
                className="gx-tile"
                data-match={filter === "All" || g.tag === filter}
                onClick={() => { setDir(1); setOpen(i); }}
                onMouseMove={light}
                onMouseEnter={grow("view")}
                onMouseLeave={shrink}
                aria-label={`Open photo: ${g.cap}`}
              >
                <img src={g.img} alt={`${g.cap} — ${g.note} Café de Bangkok, Kochi`} loading="lazy" draggable={false} />
                <span className="gx-light" aria-hidden />
                <span className="gx-no" aria-hidden>{pad(i + 1)}</span>
                <span className="gx-cap" aria-hidden>
                  <em>{g.tag}</em>
                  <b>{g.cap}</b>
                </span>
              </button>
            </div>
          ))}

          <div className="gx-cell s-n reveal d4">
            <a
              className="gx-tile gx-ig"
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={grow()}
              onMouseLeave={shrink}
            >
              <span className="gx-ig-top">More from the room</span>
              <b>@cafedebangkok<wbr />.kochi</b>
              <span className="gx-ig-go">Instagram <Arrow /></span>
            </a>
          </div>
        </div>
      </div>

      {/* ════ lightbox ════ */}
      {lb && open !== null && (
        <div className="gx-lb" role="dialog" aria-modal="true" aria-label={lb.cap} onClick={close}>
          <div className="gx-lb-bg" key={`bg-${open}`} style={{ backgroundImage: `url(${lb.img})` }} aria-hidden />

          <div className="gx-lb-bar" onClick={(e) => e.stopPropagation()}>
            <span className="gx-lb-count">{pad(open + 1)} <em>/ {pad(N)}</em></span>
            <button ref={closeRef} className="gx-lb-x" onClick={close} aria-label="Close" onMouseEnter={grow()} onMouseLeave={shrink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            </button>
          </div>

          <button className="gx-lb-nav prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="gx-lb-nav next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <figure className="gx-lb-stage" onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className={`gx-lb-img ${dir > 0 ? "fwd" : "back"}`} key={open}>
              <img src={lb.img} alt={`${lb.cap} — ${lb.note}`} draggable={false} />
            </div>
            <figcaption className="gx-lb-cap">
              <em>{lb.tag}</em>
              <b>{lb.cap}</b>
              <small>{lb.note}</small>
            </figcaption>
          </figure>

          <div className="gx-lb-rail" onClick={(e) => e.stopPropagation()}>
            {ITEMS.map((g, i) => (
              <button
                key={g.cap}
                className="gx-lb-thumb"
                data-on={i === open}
                onClick={() => { setDir(i > open ? 1 : -1); setOpen(i); }}
                aria-label={`View ${g.cap}`}
                aria-current={i === open ? "true" : undefined}
              >
                <img src={g.img} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.gx { position:relative; padding:clamp(90px,11vw,160px) 0; }

/* head */
.gx-head { display:flex; justify-content:space-between; align-items:flex-end; gap:30px; flex-wrap:wrap;
  margin-bottom:clamp(34px,4vw,56px); }
.gx-head .nm-h2 { margin-top:22px; }
.gx-side { display:flex; flex-direction:column; align-items:flex-start; gap:20px; max-width:580px; }
.gx-chips { display:flex; flex-wrap:wrap; gap:8px; }
.gx-chip { display:inline-flex; align-items:center; gap:8px; padding:9px 14px; border-radius:100px;
  border:1px solid var(--hair); font-family:var(--nm-mono); font-size:.7rem; letter-spacing:.1em;
  text-transform:uppercase; color:var(--ash);
  transition:color .35s, border-color .35s, background .35s, transform .35s var(--ease); }
.gx-chip em { font-style:normal; font-size:.62rem; color:var(--amber); }
.gx-chip:hover { color:var(--bone); border-color:var(--hair-2); transform:translateY(-2px); }
.gx-chip[aria-pressed="true"] { color:var(--void); background:var(--bone); border-color:var(--bone); }
.gx-chip[aria-pressed="true"] em { color:var(--ember); }
.gx-chip:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }

/* ════ bento ════ */
.gx-grid { display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:clamp(170px,17vw,250px);
  grid-auto-flow:dense; gap:12px; }
.gx-cell.s-f { grid-column:span 2; grid-row:span 2; }
.gx-cell.s-w { grid-column:span 2; }
.gx-cell.s-t { grid-row:span 2; }

.gx-tile { position:relative; display:block; width:100%; height:100%; overflow:hidden; border-radius:18px;
  text-align:left; border:1px solid var(--hair); background:var(--coal);
  transition:opacity .7s var(--ease), box-shadow .7s var(--ease), border-color .5s; }
.gx-tile img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  transition:transform 1.3s var(--ease), filter .8s var(--ease); }
.gx-tile:hover img { transform:scale(1.07); }
.gx-tile::after { content:""; position:absolute; inset:0; z-index:1; pointer-events:none;
  background:linear-gradient(to top, rgba(6,5,5,.78) 0%, rgba(6,5,5,.1) 45%, transparent 65%); }
.gx-tile:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }
.gx-light { position:absolute; inset:0; z-index:2; pointer-events:none; opacity:0; mix-blend-mode:screen;
  background:radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(255,179,33,.26), transparent 70%);
  transition:opacity .45s; }
.gx-tile:hover .gx-light { opacity:1; }
.gx-no { position:absolute; z-index:3; top:14px; right:16px; font-family:var(--nm-mono); font-size:.64rem;
  letter-spacing:.1em; color:rgba(245,239,230,.75); padding:4px 7px; border-radius:5px;
  background:rgba(6,5,5,.4); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); }
.gx-cap { position:absolute; z-index:3; left:18px; right:18px; bottom:16px; display:flex; flex-direction:column; gap:3px;
  transform:translateY(6px); transition:transform .6s var(--ease); }
.gx-tile:hover .gx-cap { transform:none; }
.gx-cap em { font-style:normal; font-family:var(--nm-mono); font-size:.6rem; letter-spacing:.18em;
  text-transform:uppercase; color:var(--amber); }
.gx-cap b { font-family:var(--nm-serif); font-style:italic; font-weight:500; line-height:1.08; color:var(--bone);
  font-size:clamp(1.1rem,1.5vw,1.45rem); }
.s-f .gx-cap b { font-size:clamp(1.7rem,3vw,2.8rem); }
.s-f .gx-cap { left:26px; bottom:22px; }

/* spotlight filter */
.gx-tile[data-match="false"] { opacity:.38; }
.gx-tile[data-match="false"] img { filter:grayscale(1) brightness(.45); }
.gx-grid:not([data-filter="All"]) .gx-tile[data-match="true"] { border-color:rgba(255,179,33,.7);
  box-shadow:0 0 0 1px rgba(255,179,33,.5), 0 20px 60px rgba(255,140,33,.18); }

/* instagram tile */
.gx-ig { display:flex; flex-direction:column; justify-content:space-between; padding:20px 20px 18px;
  background:var(--amber); color:var(--void); border-color:transparent; isolation:isolate; }
.gx-ig::after { display:none; }
.gx-ig::before { content:""; position:absolute; inset:0; z-index:-1; opacity:0;
  background:linear-gradient(140deg, var(--amber), var(--ember)); transition:opacity .5s; }
.gx-ig:hover::before { opacity:1; }
.gx-ig-top, .gx-ig-go { font-family:var(--nm-mono); font-size:.64rem; letter-spacing:.16em; text-transform:uppercase; }
.gx-ig b { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(1.1rem,1.9vw,2rem); line-height:.95; overflow-wrap:break-word; }
.gx-ig-go { display:flex; align-items:center; gap:8px; }
.gx-ig-go svg { width:14px; height:14px; transition:transform .5s var(--ease); }
.gx-ig:hover .gx-ig-go svg { transform:translateX(5px) rotate(-45deg); }

@media (max-width:760px){
  .gx-grid { grid-template-columns:1fr 1fr; grid-auto-rows:44vw; gap:8px; }
  .gx-tile { border-radius:14px; }
  .gx-no { display:none; }
  .gx-cap { left:12px; right:12px; bottom:10px; transform:none; }
  .s-f .gx-cap { left:16px; bottom:14px; }
  .gx-ig { padding:14px; }
}

/* ════ lightbox ════ */
.gx-lb { position:fixed; inset:0; z-index:5000; display:grid; place-items:center;
  padding:clamp(70px,9vh,90px) clamp(16px,6vw,90px) clamp(80px,12vh,110px);
  background:rgba(4,3,3,.72); animation:gx-fade .4s ease both; }
@keyframes gx-fade { from { opacity:0; } to { opacity:1; } }
.gx-lb-bg { position:absolute; inset:0; background-size:cover; background-position:center;
  filter:blur(50px) brightness(.3) saturate(1.15); transform:scale(1.2); animation:gx-fade .6s ease both; }
.gx-lb-bar { position:absolute; z-index:3; top:0; left:0; right:0; display:flex; justify-content:space-between;
  align-items:center; padding:clamp(14px,3vw,26px) clamp(16px,3vw,30px); }
.gx-lb-count { font-family:var(--nm-mono); font-size:.8rem; letter-spacing:.14em; color:var(--bone); }
.gx-lb-count em { font-style:normal; color:rgba(245,239,230,.4); }
.gx-lb-x, .gx-lb-nav { display:grid; place-items:center; border-radius:50%; color:var(--bone);
  background:rgba(245,239,230,.08); border:1px solid rgba(245,239,230,.2);
  backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  transition:background .3s, color .3s, transform .4s var(--ease); }
.gx-lb-x { width:48px; height:48px; }
.gx-lb-x:hover { background:var(--amber); color:var(--void); transform:rotate(90deg); }
.gx-lb-x:focus-visible, .gx-lb-nav:focus-visible, .gx-lb-thumb:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }
.gx-lb-x svg { width:18px; height:18px; }
.gx-lb-nav { position:absolute; z-index:3; top:50%; width:54px; height:54px; transform:translateY(-50%); }
.gx-lb-nav.prev { left:clamp(10px,2.4vw,30px); } .gx-lb-nav.next { right:clamp(10px,2.4vw,30px); }
.gx-lb-nav:hover { background:var(--amber); color:var(--void); }
.gx-lb-nav svg { width:22px; height:22px; }

.gx-lb-stage { position:relative; z-index:2; margin:0; width:100%; max-width:min(1080px,100%);
  display:flex; flex-direction:column; align-items:center; gap:18px; }
.gx-lb-img { width:100%; border-radius:16px; overflow:hidden; border:1px solid rgba(245,239,230,.12);
  box-shadow:0 44px 130px rgba(0,0,0,.65); }
.gx-lb-img.fwd { animation:gx-in-f .55s var(--ease) both; }
.gx-lb-img.back { animation:gx-in-b .55s var(--ease) both; }
@keyframes gx-in-f { from { opacity:0; transform:translateX(44px) scale(.96); } to { opacity:1; transform:none; } }
@keyframes gx-in-b { from { opacity:0; transform:translateX(-44px) scale(.96); } to { opacity:1; transform:none; } }
.gx-lb-img img { display:block; width:100%; max-height:62vh; object-fit:contain; background:#0a0807; }
.gx-lb-cap { display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; max-width:60ch; }
.gx-lb-cap em { font-style:normal; font-family:var(--nm-mono); font-size:.62rem; letter-spacing:.2em;
  text-transform:uppercase; color:var(--amber); }
.gx-lb-cap b { font-family:var(--nm-serif); font-style:italic; font-weight:500;
  font-size:clamp(1.5rem,3vw,2.3rem); line-height:1.1; color:var(--bone); }
.gx-lb-cap small { color:var(--ash); font-size:.95rem; line-height:1.5; }

.gx-lb-rail { position:absolute; z-index:3; left:50%; bottom:clamp(12px,3vh,26px); transform:translateX(-50%);
  display:flex; gap:8px; max-width:92vw; overflow-x:auto; padding:6px; scrollbar-width:none; }
.gx-lb-rail::-webkit-scrollbar { display:none; }
.gx-lb-thumb { flex:none; width:54px; height:38px; border-radius:7px; overflow:hidden; opacity:.5;
  border:1px solid rgba(245,239,230,.2); transition:opacity .35s, width .4s var(--ease), border-color .35s; }
.gx-lb-thumb img { width:100%; height:100%; object-fit:cover; }
.gx-lb-thumb:hover { opacity:.85; }
.gx-lb-thumb[data-on="true"] { opacity:1; width:74px; border-color:var(--amber); }
@media (max-width:560px){
  .gx-lb-rail { display:none; }
  .gx-lb-nav { top:auto; bottom:22px; transform:none; width:46px; height:46px; }
}

/* ════ reduced motion ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .gx-lb-img.fwd,
  html:not(.force-motion) .gx-lb-img.back { animation:none !important; }
}
`;
