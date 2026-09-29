"use client";

/* ════════════════════════════════════════════════════════════════
   COURSES → "The Signature Collection"
   A showcase of Café de Bangkok's most-loved dishes.

   DESKTOP: a split stage — a large spotlight image on the left that
   crossfades + Ken-Burns drifts, paired with a synced detail panel
   on the right. A vertical index of dishes lets you jump; it also
   auto-advances. Hovering the index previews; clicking commits.

   MOBILE: the stage collapses into a smooth vertical stack of
   editorial dish cards (image + details), each revealing on scroll.

   Self-contained styles (embedded) so it can never desync.
   SEO: semantic <section>/<article>/<h2>/<h3>, real alt text, and an
   inline JSON-LD ItemList / Menu of the dishes.
   ════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { FAMOUS_DISHES, SITE } from "@/lib/data";
import { grow, shrink, prefersReducedMotion } from "@/lib/hooks";

const HOLD = 4800;

function Spice({ level }: { level: number }) {
  if (level <= 0) return <span className="cs-mild">mild</span>;
  return (
    <span className="cs-spice" aria-label={`Spice level ${level} of 3`}>
      {[1, 2, 3].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={i <= level ? "on" : ""} aria-hidden>
          <path d="M14 4c0 3-2 4-2 4s5 1 5 7a6 6 0 0 1-11 3c4 1 6-2 6-4-3 0-5-3-5-6 3 1 4-1 4-3 2 1 3 0 3-3z" />
        </svg>
      ))}
    </span>
  );
}

export default function Courses() {
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useRef(false);

  const select = useCallback(
    (i: number) => {
      if (i === active) return;
      setPrev(active);
      setActive(i);
      setTick((t) => t + 1);
    },
    [active]
  );

  /* auto-advance only while the section is in view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { inView.current = e.isIntersecting; },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (inView.current) select((active + 1) % FAMOUS_DISHES.length);
    }, HOLD);
    return () => clearInterval(t);
  }, [active, select]);

  /* clear the outgoing image after its crossfade */
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 1200);
    return () => clearTimeout(t);
  }, [prev, tick]);

  const d = FAMOUS_DISHES[active];

  /* SEO structured data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Signature dishes — Café de Bangkok, Kochi",
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Signatures",
      hasMenuItem: FAMOUS_DISHES.map((x) => ({
        "@type": "MenuItem",
        name: x.name,
        description: x.desc,
      })),
    },
  };

  return (
    <section id="courses" className="cs" ref={sectionRef} aria-label="Signature dishes">
      <style>{css}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell">
        {/* header */}
        <div className="cs-head">
          <p className="kicker reveal"><i />02 — The Signature Collection</p>
          <h2 className="cs-title reveal d1">
            The dishes that <span className="cs-ital">made our name</span>
          </h2>
          <p className="cs-intro reveal d2">
            Six plates our guests travel for — pulled straight from the reviews,
            plated by Chef Kuan Lai. {SITE.reviewCount} diners, and these are the
            ones they keep coming back for.
          </p>
        </div>

        {/* ── desktop spotlight stage ── */}
        <div className="cs-stage reveal d2">
          {/* image side */}
          <div className="cs-frame" key={`frame-${tick}`}>
            {prev !== null && (
              <img className="cs-img out" src={FAMOUS_DISHES[prev].img} alt="" aria-hidden draggable={false} />
            )}
            <img className="cs-img in" src={d.img} alt={d.alt} draggable={false} />
            <div className="cs-frame-grad" aria-hidden />
            <span className="cs-bigno" aria-hidden>{d.n}</span>
            <span className="cs-th" aria-hidden>{d.th}</span>
          </div>

          {/* detail side */}
          <article className="cs-detail" key={`detail-${tick}`}>
            <div className="cs-detail-top">
              <span className="cs-pill">{d.tag}</span>
              <Spice level={d.spice} />
            </div>
            <h3 className="cs-name">{d.name}</h3>
            <p className="cs-note">{d.note}</p>
            <p className="cs-desc">{d.desc}</p>
            <a className="cs-cta" href={SITE.phoneHref} onMouseEnter={grow("call")} onMouseLeave={shrink}>
              Reserve to taste
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </article>

          {/* vertical index */}
          <nav className="cs-index" aria-label="Choose a dish">
            {FAMOUS_DISHES.map((x, i) => (
              <button
                key={x.name}
                className={`cs-idx${i === active ? " on" : ""}`}
                onClick={() => select(i)}
                onMouseEnter={grow()}
                onMouseLeave={shrink}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="cs-idx-no">{x.n}</span>
                <span className="cs-idx-name">{x.name}</span>
                <span className="cs-idx-bar"><i key={i === active ? `b-${tick}` : `i-${i}`} /></span>
              </button>
            ))}
          </nav>
        </div>

        {/* ── mobile editorial stack ── */}
        <div className="cs-mobile">
          {FAMOUS_DISHES.map((x) => (
            <article className="cs-card reveal" key={x.name}>
              <div className="cs-card-img">
                <img src={x.img} alt={x.alt} loading="lazy" draggable={false} />
                <span className="cs-card-no" aria-hidden>{x.n}</span>
                <span className="cs-card-th" aria-hidden>{x.th}</span>
              </div>
              <div className="cs-card-body">
                <div className="cs-detail-top">
                  <span className="cs-pill">{x.tag}</span>
                  <Spice level={x.spice} />
                </div>
                <h3 className="cs-name">{x.name}</h3>
                <p className="cs-note">{x.note}</p>
                <p className="cs-desc">{x.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.cs { position:relative; padding:clamp(90px,11vw,170px) 0; }

.cs-head { max-width:760px; margin-bottom:clamp(44px,5vw,72px); }
.cs-title { font-family:'Italiana', var(--serif); font-weight:400;
  font-size:clamp(2.1rem,5.2vw,4rem); line-height:1.05; margin:18px 0 18px; color:var(--bone); }
.cs-ital { font-family:var(--serif); font-style:italic; color:var(--amber); }
.cs-intro { color:var(--ash); font-size:1.05rem; max-width:60ch; }

/* ── stage ── */
.cs-stage {
  display:grid; grid-template-columns:1.15fr 1fr auto;
  gap:clamp(24px,3vw,52px); align-items:stretch;
}

/* image frame */
.cs-frame {
  position:relative; border-radius:var(--r); overflow:hidden;
  min-height:clamp(380px,52vh,560px);
  border:1px solid var(--hair); background:var(--coal);
  box-shadow:0 30px 90px rgba(0,0,0,.5);
}
.cs-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.cs-img.in {
  animation:cs-zoom 5.2s cubic-bezier(.22,1,.36,1) forwards,
            cs-fade .9s ease both;
}
.cs-img.out { animation:cs-out .9s ease forwards; z-index:1; }
.cs-img.in { z-index:2; }
@keyframes cs-zoom { from { transform:scale(1.12); } to { transform:scale(1.02); } }
@keyframes cs-fade { from { opacity:0; clip-path:inset(0 0 0 100%); } to { opacity:1; clip-path:inset(0 0 0 0); } }
@keyframes cs-out  { from { opacity:1; } to { opacity:0; } }
.cs-frame-grad { position:absolute; inset:0; z-index:3; pointer-events:none;
  background:linear-gradient(to top, rgba(5,4,4,.75), transparent 45%),
             linear-gradient(115deg, rgba(5,4,4,.5), transparent 50%); }
.cs-bigno { position:absolute; left:24px; bottom:18px; z-index:4;
  font-family:'Italiana', var(--serif); font-size:clamp(3.4rem,7vw,6rem); line-height:.8;
  color:transparent; -webkit-text-stroke:1px rgba(245,239,230,.55); }
.cs-th { position:absolute; right:22px; top:18px; z-index:4;
  font-family:var(--serif); font-style:italic; font-size:1.5rem; color:rgba(255,179,33,.9);
  text-shadow:0 2px 16px rgba(5,4,4,.8); }

/* detail panel */
.cs-detail { display:flex; flex-direction:column; justify-content:center; padding:6px 0;
  animation:cs-slidein .8s var(--ease) both; }
@keyframes cs-slidein { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:none; } }
.cs-detail-top { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.cs-pill { font-family:var(--head); font-size:.62rem; letter-spacing:.22em; text-transform:uppercase;
  color:var(--amber); border:1px solid var(--hair-2); padding:7px 14px; border-radius:100px; }
.cs-spice { display:inline-flex; gap:3px; }
.cs-spice svg { width:16px; height:16px; fill:rgba(245,239,230,.18); transition:fill .3s; }
.cs-spice svg.on { fill:var(--ember); }
.cs-mild { font-size:.7rem; letter-spacing:.16em; text-transform:uppercase; color:#57b893; }

.cs-name { font-family:'Italiana', var(--serif); font-weight:400;
  font-size:clamp(2rem,4vw,3.2rem); line-height:1.05; color:var(--bone); margin-bottom:8px; }
.cs-note { font-family:var(--serif); font-style:italic; font-size:1.15rem;
  color:var(--amber); margin-bottom:18px; }
.cs-desc { color:var(--ash); font-size:1rem; max-width:46ch; }

.cs-cta { display:inline-flex; align-items:center; gap:10px; margin-top:30px;
  font-family:var(--head); font-size:.72rem; letter-spacing:.18em; text-transform:uppercase;
  color:var(--bone); width:fit-content; padding-bottom:6px;
  border-bottom:1px solid var(--hair-2); transition:gap .4s var(--ease), color .3s; }
.cs-cta svg { width:16px; height:16px; transition:transform .4s var(--ease); }
.cs-cta:hover { gap:16px; color:var(--amber); }
.cs-cta:hover svg { transform:translateX(4px); }

/* vertical index */
.cs-index { display:flex; flex-direction:column; gap:2px; min-width:190px; }
.cs-idx { position:relative; display:grid; grid-template-columns:auto 1fr; gap:10px 12px;
  align-items:center; padding:14px 4px; text-align:left; border-top:1px solid var(--hair);
  color:var(--ash); transition:color .35s, padding-left .4s var(--ease); }
.cs-idx:last-child { border-bottom:1px solid var(--hair); }
.cs-idx:hover { color:var(--bone); padding-left:8px; }
.cs-idx.on { color:var(--bone); }
.cs-idx-no { font-family:var(--head); font-size:.66rem; letter-spacing:.12em; color:var(--amber); }
.cs-idx-name { font-family:var(--head); font-size:.82rem; letter-spacing:.04em; white-space:nowrap; }
.cs-idx-bar { grid-column:1 / -1; height:2px; background:var(--hair); border-radius:2px; overflow:hidden; }
.cs-idx-bar i { display:block; height:100%; background:linear-gradient(90deg,var(--amber),var(--ember));
  transform:scaleX(0); transform-origin:left; }
.cs-idx.on .cs-idx-bar i { animation:cs-prog 4800ms linear forwards; box-shadow:0 0 10px rgba(255,179,33,.7); }
@keyframes cs-prog { to { transform:scaleX(1); } }

/* ── mobile stack (hidden on desktop) ── */
.cs-mobile { display:none; }
.cs-card { border-radius:var(--r); overflow:hidden; border:1px solid var(--hair);
  background:var(--coal); margin-bottom:20px; box-shadow:0 16px 48px rgba(0,0,0,.4); }
.cs-card-img { position:relative; aspect-ratio:16/11; }
.cs-card-img img { width:100%; height:100%; object-fit:cover; }
.cs-card-img::after { content:""; position:absolute; inset:0;
  background:linear-gradient(to top, rgba(5,4,4,.7), transparent 50%); }
.cs-card-no { position:absolute; left:18px; bottom:12px; z-index:2;
  font-family:'Italiana', var(--serif); font-size:3rem; line-height:.8;
  color:transparent; -webkit-text-stroke:1px rgba(245,239,230,.5); }
.cs-card-th { position:absolute; right:16px; top:14px; z-index:2;
  font-family:var(--serif); font-style:italic; font-size:1.2rem; color:rgba(255,179,33,.92);
  text-shadow:0 2px 12px rgba(5,4,4,.8); }
.cs-card-body { padding:24px 22px 28px; }
.cs-card-body .cs-desc { max-width:none; }

/* ── responsive ── */
@media (max-width:1024px){
  .cs-stage { display:none; }
  .cs-mobile { display:block; }
}
@media (max-width:560px){
  .cs-card-body { padding:20px 18px 24px; }
}

/* ── reduced motion ── */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .cs-img.in { animation:none !important; opacity:1; clip-path:none; transform:none; }
  html:not(.force-motion) .cs-img.out { display:none; }
  html:not(.force-motion) .cs-detail { animation:none !important; }
  html:not(.force-motion) .cs-idx.on .cs-idx-bar i { animation:none !important; transform:scaleX(1); }
}
`;