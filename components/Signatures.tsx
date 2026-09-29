"use client";

/* ════════════════════════════════════════════════════════════════
   SIGNATURES → "A menu told in six chapters" — a stack of tickets

   Each signature is a ticket: photograph + price stamp on one side,
   a perforated tear line, then the story (roman numeral, origin,
   prose, key elements, a guest's words).

   DESKTOP (≥1000px wide, ≥700px tall) — tickets are sticky and pile
   up as you scroll; the one underneath eases back and dims as the
   next slides over it. One rAF per scroll event writes a single
   custom property (--p) per card; CSS does the rest.
   ELSEWHERE — the same tickets simply flow and reveal on scroll.

   SEO — every chapter is real <article> markup + JSON-LD ItemList.
   ════════════════════════════════════════════════════════════════ */

import { Fragment, useCallback, useEffect, useRef } from "react";
import { STORY_CHAPTERS, SITE } from "@/lib/data";
import { grow, shrink, prefersReducedMotion } from "@/lib/hooks";
import { Arrow } from "@/components/Chrome";
import { Label } from "@/components/Kit";

const N = STORY_CHAPTERS.length;
const STACK = "(min-width: 1000px) and (min-height: 700px)";
const pad = (n: number) => String(n).padStart(2, "0");

export default function Signatures() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const anchorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* how far the next ticket has slid over each one → --p (0…1) */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mq = window.matchMedia(STACK);
    let raf = 0;
    const update = () => {
      raf = 0;
      const cards = cardRefs.current;
      cards.forEach((card, i) => {
        if (!card) return;
        const next = cards[i + 1];
        let p = 0;
        if (mq.matches && next) {
          const a = card.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          p = Math.min(Math.max((a.bottom - b.top) / a.height, 0), 1);
        }
        card.style.setProperty("--p", p.toFixed(3));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* chapter index → scroll so that ticket sits at its resting place */
  const jump = useCallback((i: number) => {
    const anchor = anchorRefs.current[i];
    const card = cardRefs.current[i];
    if (!anchor || !card) return;
    const rest = window.matchMedia(STACK).matches ? parseFloat(getComputedStyle(card).top) || 0 : 96;
    window.scrollTo({
      top: anchor.getBoundingClientRect().top + window.scrollY - rest,
      behavior: "smooth",
    });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Signature dishes — Café de Bangkok, Kochi",
    itemListElement: STORY_CHAPTERS.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "MenuItem", name: x.name, description: x.story },
    })),
  };

  return (
    <section id="signatures" className="sx nm" aria-labelledby="sx-title">
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="shell">
        <header className="sx-head">
          <div>
            <Label no="02" className="reveal">The Signatures</Label>
            <h2 className="nm-h2 reveal d1" id="sx-title">
              A menu told in <em>six chapters</em>
            </h2>
          </div>
          <div className="sx-side reveal d2">
            <p className="nm-lede">
              Every signature has an origin. Scroll through the stories our{" "}
              {SITE.reviewCount} guests keep retelling.
            </p>
            <ol className="sx-index">
              {STORY_CHAPTERS.map((c, i) => (
                <li key={c.name}>
                  <button onClick={() => jump(i)} onMouseEnter={grow()} onMouseLeave={shrink}>
                    <em>{c.n}</em>
                    {c.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </header>

        <div className="sx-stack">
          {STORY_CHAPTERS.map((c, i) => (
            <Fragment key={c.name}>
              <span className="sx-anchor" ref={(el) => { anchorRefs.current[i] = el; }} aria-hidden />
              <article
                className="sx-card reveal"
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{ "--i": i } as React.CSSProperties}
                aria-labelledby={`sx-n-${i}`}
              >
                <div className="sx-inner">
                  <figure className="sx-media">
                    <img src={c.img} alt={c.alt} loading="lazy" draggable={false} />
                    <span className="sx-th nm-thai" lang="th" aria-hidden>{c.th}</span>
                    <span className="sx-stamp">
                      <b>{c.price}</b>
                      <small>Signature</small>
                    </span>
                  </figure>

                  <div className="sx-copy">
                    <i className="sx-perf" aria-hidden />
                    <span className="sx-roman" aria-hidden>{c.n}</span>
                    <p className="nm-label">
                      <b>{pad(i + 1)} / {pad(N)}</b>
                      {c.eyebrow}
                    </p>
                    <h3 className="sx-name" id={`sx-n-${i}`}>{c.name}</h3>
                    <p className="sx-origin"><i aria-hidden />{c.origin}</p>
                    <p className="sx-story">{c.story}</p>
                    <ul className="sx-els" aria-label="Key elements">
                      {c.elements.map((e) => <li key={e}>{e}</li>)}
                    </ul>
                    <blockquote className="sx-quote">“{c.quote}”</blockquote>
                    <a className="sx-cta" href={SITE.phoneHref} onMouseEnter={grow("call")} onMouseLeave={shrink}>
                      Reserve to taste <Arrow />
                    </a>
                  </div>
                </div>
              </article>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.sx { position:relative; padding:clamp(90px,11vw,160px) 0 clamp(50px,6vw,90px); }

/* head */
.sx-head { display:grid; grid-template-columns:1.15fr .85fr; gap:clamp(28px,5vw,80px); align-items:end;
  margin-bottom:clamp(44px,6vw,80px); }
.sx-head .nm-h2 { margin-top:22px; }
.sx-side .nm-lede { margin-bottom:22px; }
.sx-index { list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:0 20px; border-top:1px solid var(--hair); }
.sx-index button { width:100%; display:flex; align-items:baseline; gap:10px; padding:11px 0; text-align:left;
  border-bottom:1px solid var(--hair); font-size:.95rem; line-height:1.3; color:var(--ash);
  transition:color .3s, padding .45s var(--ease); }
.sx-index button:hover { color:var(--bone); padding-left:8px; }
.sx-index em { flex:none; min-width:2.4em; font-style:normal; font-family:var(--nm-mono); font-size:.7rem; color:var(--amber); }

/* ════ tickets ════ */
.sx-stack { position:relative; }
.sx-card { position:relative; margin-bottom:24px; }
.sx-card:last-child { margin-bottom:0; }
.sx-inner { position:relative; display:grid; grid-template-columns:1fr 1.12fr; border-radius:26px; overflow:hidden;
  background:
    radial-gradient(70% 55% at 100% 0%, rgba(255,140,33,.11), transparent 62%),
    linear-gradient(155deg, #19130d 0%, #0e0b09 55%, #0a0807 100%);
  border:1px solid rgba(245,239,230,.1);
  box-shadow:0 -26px 70px rgba(0,0,0,.55), 0 30px 80px rgba(0,0,0,.35);
  transform-origin:50% 0; transform:scale(calc(1 - var(--p, 0) * .075)); }
.sx-inner::after { content:""; position:absolute; inset:0; z-index:6; pointer-events:none;
  background:#050404; opacity:calc(var(--p, 0) * .68); }

/* photograph + stamp */
.sx-media { position:relative; margin:0; min-height:300px; overflow:hidden; }
.sx-media img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform 1.6s var(--ease); }
.sx-card:hover .sx-media img { transform:scale(1.05); }
.sx-media::after { content:""; position:absolute; inset:0;
  background:linear-gradient(to top, rgba(6,5,5,.72), transparent 50%), linear-gradient(90deg, transparent 72%, rgba(14,11,9,.55)); }
.sx-th { position:absolute; z-index:2; left:26px; bottom:10px; font-size:clamp(2.6rem,4.4vw,4.2rem); line-height:1.35;
  color:var(--amber); text-shadow:0 0 30px rgba(255,179,33,.5), 0 2px 14px rgba(6,5,5,.85); }
.sx-stamp { position:absolute; z-index:3; top:22px; right:22px; width:112px; aspect-ratio:1; border-radius:50%;
  display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
  background:var(--amber); color:var(--void); transform:rotate(-12deg);
  box-shadow:0 16px 40px rgba(0,0,0,.45), 0 0 0 5px rgba(255,179,33,.18); }
.sx-card:nth-child(4n) .sx-stamp { background:var(--blush); }
.sx-stamp::before { content:""; position:absolute; inset:7px; border-radius:50%;
  border:1.5px dashed rgba(6,5,5,.4); animation:orbit 20s linear infinite; }
.sx-stamp b { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; font-size:2rem; line-height:1; }
.sx-stamp small { margin-top:5px; font-family:var(--nm-mono); font-size:.5rem; letter-spacing:.2em; text-transform:uppercase; }

/* story side */
.sx-copy { position:relative; min-width:0; display:flex; flex-direction:column; justify-content:center; align-items:flex-start;
  gap:14px; padding:clamp(30px,3.6vw,56px); }
.sx-perf { position:absolute; left:-1px; top:0; bottom:0; border-left:2px dashed rgba(245,239,230,.16); }
.sx-perf::before, .sx-perf::after { content:""; position:absolute; left:-15px; width:28px; height:28px;
  border-radius:50%; background:var(--void); }
.sx-perf::before { top:-14px; } .sx-perf::after { bottom:-14px; }
.sx-roman { position:absolute; top:clamp(12px,2vw,24px); right:clamp(20px,2.6vw,40px);
  font-family:var(--nm-serif); font-style:italic; font-weight:500; font-size:clamp(4.4rem,7.6vw,7.4rem); line-height:1;
  color:transparent; -webkit-text-stroke:1px rgba(255,179,33,.42); pointer-events:none; }
.sx-name { max-width:12ch; margin-top:4px; font-family:var(--nm-disp); font-weight:800; font-stretch:75%;
  text-transform:uppercase; font-size:clamp(2.3rem,3.8vw,3.5rem); line-height:.9; color:var(--bone); }
.sx-origin { display:flex; align-items:center; gap:10px; font-family:var(--nm-serif); font-style:italic;
  font-size:1.08rem; color:var(--amber); }
.sx-origin i { width:28px; height:1px; background:currentColor; }
.sx-story { max-width:52ch; color:rgba(245,239,230,.78); font-size:1rem; line-height:1.62; }
.sx-els { display:flex; flex-wrap:wrap; gap:6px; list-style:none; }
.sx-els li { font-family:var(--nm-mono); font-size:.64rem; letter-spacing:.08em; text-transform:uppercase;
  color:var(--bone); padding:6px 10px; border-radius:6px; border:1px dashed rgba(255,179,33,.38);
  background:rgba(255,179,33,.05); }
.sx-quote { max-width:44ch; padding-left:16px; border-left:2px solid var(--amber);
  font-family:var(--nm-serif); font-style:italic; font-size:1.08rem; line-height:1.4; color:var(--bone); }
.sx-cta { display:inline-flex; align-items:center; gap:10px; margin-top:4px; padding-bottom:5px;
  border-bottom:1px solid rgba(255,179,33,.4); font-family:var(--nm-mono); font-size:.72rem; letter-spacing:.14em;
  text-transform:uppercase; color:var(--amber); transition:gap .4s var(--ease), color .3s; }
.sx-cta svg { width:15px; height:15px; }
.sx-cta:hover { gap:16px; color:var(--bone); }

/* ════ desktop: sticky pile ════ */
@media (min-width:1000px) and (min-height:700px){
  .sx-card { position:sticky; top:calc(clamp(76px,10vh,100px) + var(--i) * 14px); margin-bottom:14vh; }
  .sx-card:last-child { margin-bottom:0; }
  .sx-inner { height:clamp(500px, calc(100svh - 230px), 640px); }
}
/* short screens: keep every ticket inside the viewport */
@media (min-width:1000px) and (max-height:860px){
  .sx-quote { display:none; }
}
@media (min-width:1000px) and (max-height:760px){
  .sx-story { font-size:.93rem; line-height:1.52; }
  .sx-els { display:none; }
}

/* ════ tablet / mobile: flowing tickets ════ */
@media (max-width:999px){
  .sx-head { grid-template-columns:1fr; }
  .sx-inner { grid-template-columns:1fr; }
  .sx-media { min-height:0; aspect-ratio:16/11; }
  .sx-perf { left:0; right:0; top:-1px; bottom:auto; border-left:0; border-top:2px dashed rgba(245,239,230,.16); }
  .sx-perf::before { left:-14px; top:-15px; }
  .sx-perf::after { left:auto; right:-14px; top:-15px; bottom:auto; }
}
@media (max-width:560px){
  .sx-index { grid-template-columns:1fr; }
  .sx-stamp { width:92px; top:16px; right:16px; }
  .sx-stamp b { font-size:1.6rem; }
  .sx-copy { padding:28px 22px 30px; }
  .sx-roman { font-size:3.6rem; }
  .sx-name { font-size:2.3rem; max-width:none; padding-right:3.2rem; }
}

/* ════ reduced motion ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .sx-card { position:relative !important; top:auto !important; }
}
`;
