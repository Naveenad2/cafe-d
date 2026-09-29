"use client";

/* ════════════════════════════════════════════════════════════════
   REVIEWS → "2,900+ plates, remembered"
   A score block (the fifth star lit only as far as the rating
   goes), then two lanes of receipt-style cards — paper and night,
   alternating — drifting in opposite directions, paused on hover.
   The first pass of the top lane is the accessible list; every loop
   copy is aria-hidden. Reduced motion → a static, scrollable lane.
   ════════════════════════════════════════════════════════════════ */

import { REVIEWS, SITE } from "@/lib/data";
import { Label } from "@/components/Kit";

type Entry = { r: (typeof REVIEWS)[number]; n: number };

const TOP: Entry[] = REVIEWS.map((r, n) => ({ r, n }));
const BOTTOM: Entry[] = [...TOP].reverse();
const LOOPS = [0, 1, 2];
const pad = (n: number) => String(n).padStart(2, "0");

function Receipt({ r, n, paper }: Entry & { paper: boolean }) {
  return (
    <figure className="rv-card" data-paper={paper}>
      <div className="rv-card-top">
        <span className="rv-qm" aria-hidden>“</span>
        <span>No. {pad(n + 1)}</span>
      </div>
      <blockquote>
        <p>{r.q}</p>
      </blockquote>
      <figcaption>
        <b>{r.who}</b>
        <span>{r.src}</span>
      </figcaption>
    </figure>
  );
}

function Lane({ items, reverse = false }: { items: Entry[]; reverse?: boolean }) {
  return (
    <div className="rv-lane" data-reverse={reverse}>
      <div className="rv-track">
        {LOOPS.map((k) => (
          /* only the first pass of the top lane is read out */
          <div className="rv-set" key={k} aria-hidden={reverse || k > 0 ? true : undefined}>
            {items.map((e, i) => (
              <Receipt key={e.n} {...e} paper={(i + (reverse ? 1 : 0)) % 2 === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const pct = (parseFloat(SITE.rating) / 5) * 100;

  return (
    <section className="rv nm" aria-labelledby="rv-title">
      <style>{css}</style>

      <div className="shell rv-head">
        <div>
          <Label no="05" className="reveal">The Word</Label>
          <h2 className="nm-h2 reveal d1" id="rv-title">
            {SITE.reviewCount} plates, <em>remembered</em>
          </h2>
        </div>

        <div className="rv-score reveal d2">
          <b className="rv-big">{SITE.rating}</b>
          <div className="rv-score-meta">
            <span className="rv-stars" role="img" aria-label={`Rated ${SITE.rating} out of 5`}>
              <span aria-hidden>★★★★★</span>
              <span className="lit" style={{ width: `${pct}%` }} aria-hidden>★★★★★</span>
            </span>
            <small>Across {SITE.reviewCount} reviews</small>
            <small>Quoted from Google · Zomato · Restaurant Guru</small>
          </div>
        </div>
      </div>

      <div className="rv-lanes reveal">
        <Lane items={TOP} />
        <Lane items={BOTTOM} reverse />
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.rv { position:relative; padding:clamp(80px,10vw,150px) 0 clamp(70px,9vw,130px); overflow:hidden; }

/* head + score */
.rv-head { display:flex; justify-content:space-between; align-items:flex-end; gap:30px; flex-wrap:wrap;
  margin-bottom:clamp(40px,5vw,70px); }
.rv-head .nm-h2 { margin-top:22px; }
.rv-score { display:flex; align-items:center; gap:20px; padding:18px 26px 18px 22px; border-radius:22px;
  border:1px solid var(--hair-2); background:linear-gradient(140deg, rgba(255,179,33,.08), rgba(255,77,28,.02)); }
.rv-big { font-family:var(--nm-serif); font-style:italic; font-weight:600; font-size:clamp(4rem,7vw,6rem);
  line-height:.9; letter-spacing:-.04em; color:var(--amber); text-shadow:0 0 44px rgba(255,179,33,.35); }
.rv-score-meta { display:flex; flex-direction:column; gap:4px; }
.rv-stars { position:relative; display:inline-block; margin-bottom:6px; font-size:1.25rem; line-height:1;
  letter-spacing:4px; white-space:nowrap; color:rgba(245,239,230,.16); }
.rv-stars .lit { position:absolute; left:0; top:0; overflow:hidden; color:var(--amber);
  filter:drop-shadow(0 0 8px rgba(255,179,33,.5)); }
.rv-score-meta small { font-family:var(--nm-mono); font-size:.66rem; letter-spacing:.08em; color:var(--ash); }

/* ════ lanes ════ */
.rv-lanes { display:flex; flex-direction:column; gap:14px;
  -webkit-mask-image:linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image:linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.rv-lane { overflow:hidden; padding:14px 0; }
.rv-track { display:flex; width:max-content; animation:rv-drift 75s linear infinite; }
.rv-lane[data-reverse="true"] .rv-track { animation-direction:reverse; animation-duration:85s; }
.rv-lane:hover .rv-track { animation-play-state:paused; }
.rv-set { display:flex; gap:20px; padding-right:20px; }
@keyframes rv-drift { to { transform:translateX(-33.3333%); } }

/* ════ receipt card ════ */
.rv-card { position:relative; flex:none; margin:0; width:clamp(290px,27vw,400px);
  display:flex; flex-direction:column; gap:18px; padding:28px 26px 24px; border-radius:4px;
  background:linear-gradient(165deg, #17110c, #0c0a08); color:var(--bone);
  border:1px solid rgba(245,239,230,.08); rotate:-1deg;
  transition:rotate .5s var(--ease), transform .5s var(--ease); }
.rv-card:nth-child(even) { rotate:1.2deg; }
.rv-card:hover { rotate:0deg; transform:translateY(-6px); }
.rv-card[data-paper="true"] { background:var(--paper); color:var(--ink); border-color:transparent;
  box-shadow:0 24px 60px rgba(0,0,0,.45); }
/* scalloped, torn-off edges */
.rv-card::before, .rv-card::after { content:""; position:absolute; left:0; right:0; height:9px;
  background:radial-gradient(circle at 50% 0, var(--void) 5px, transparent 5.5px) 0 0/14px 9px repeat-x; }
.rv-card::before { top:-1px; }
.rv-card::after { bottom:-1px; transform:scaleY(-1); }

.rv-card-top { display:flex; justify-content:space-between; align-items:flex-start;
  font-family:var(--nm-mono); font-size:.62rem; letter-spacing:.16em; text-transform:uppercase; opacity:.7; }
.rv-qm { font-family:var(--nm-disp); font-weight:800; font-size:3.4rem; line-height:.75; letter-spacing:0;
  color:var(--amber); opacity:1; }
.rv-card[data-paper="true"] .rv-qm { color:#c2410c; }
.rv-card blockquote { flex:1; }
.rv-card blockquote p { font-family:var(--nm-serif); font-style:italic; font-weight:400;
  font-size:clamp(1.12rem,1.45vw,1.35rem); line-height:1.36; letter-spacing:-.01em; }
.rv-card figcaption { display:flex; justify-content:space-between; align-items:baseline; gap:12px;
  padding-top:14px; border-top:1px dashed rgba(245,239,230,.2);
  font-family:var(--nm-mono); font-size:.62rem; letter-spacing:.1em; text-transform:uppercase; }
.rv-card[data-paper="true"] figcaption { border-top-color:rgba(22,16,11,.25); }
.rv-card figcaption b { font-weight:500; }
.rv-card figcaption span { color:var(--amber); text-align:right; }
.rv-card[data-paper="true"] figcaption span { color:#c2410c; }

@media (max-width:560px){
  .rv-score { width:100%; }
  .rv-lanes { gap:6px; }
  .rv-card { padding:24px 20px 20px; }
}

/* ════ reduced motion: one static, scrollable lane ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .rv-lane { overflow-x:auto; }
  html:not(.force-motion) .rv-lane[data-reverse="true"],
  html:not(.force-motion) .rv-set + .rv-set { display:none; }
}
`;
