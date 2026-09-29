"use client";

/* ════════════════════════════════════════════════════════════════
   HERO — "Atelier". Fully self-contained (styles embedded below,
   so component + CSS can never desync). Needs public/hero.png.

   VISUAL LAYERS, back → front
     1  slideshow photographs — frame-open intro, direction-aware
        clip wipes with image parallax, slow Ken Burns settle
     2  readability stack — veil · gradient-masked backdrop blur ·
        bottom-weighted duotone gradient
     3  ember particles — faint amber sparks drifting upward
     4  giant ghost numeral of the current slide (outlined, right)
     5  drawn corner frames — thin lines that sketch themselves in
     6  vertical side rail — rotated establishment line, left edge
     7  caption — word-by-word 3-D rises; the accent word gets a
        hand-drawn underline that strokes itself in
     8  thumbnail navigation — live previews with progress fill
   ════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { IMAGES, SITE } from "@/lib/data";
import { useMagnetic, grow, shrink, prefersReducedMotion } from "@/lib/hooks";
import { Arrow } from "@/components/Chrome";

type Slide = {
  img: string; kicker: string;
  line1: string; line2: string; accent: string; sub: string;
};

const SLIDES: Slide[] = [
  {
    img: "/hero.png",
    kicker: "The Welcome",
    line1: "Where Bangkok",
    line2: "comes to",
    accent: "Kochi",
    sub: "Three kitchens under one lantern-lit roof in Kadavanthra.",
  },
  {
    img: IMAGES.courses[1],
    kicker: "The Craft",
    line1: "Folded by hand,",
    line2: "steamed to",
    accent: "order",
    sub: "Har gao, wontons and baos — pleated fresh every afternoon.",
  },
  {
    img: IMAGES.courses[2],
    kicker: "The Fire",
    line1: "Cooked over",
    line2: "living",
    accent: "flame",
    sub: "Wok hei you can taste — charred, smoky, unmistakably Thai.",
  },
  {
    img: IMAGES.courses[3],
    kicker: "The Finish",
    line1: "Ended with",
    line2: "quiet",
    accent: "precision",
    sub: "Glassy salmon maki and a mountain of strawberry bingsu.",
  },
];

const HOLD = 7000;
const INTRO_DELAY = 1150; // overlaps the loader's iris exit

/* word-by-word 3-D rise */
function Words({ text, startMs, stepMs = 70 }: { text: string; startMs: number; stepMs?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className="hx-wm" key={`${w}-${i}`}>
          <span className="hx-w" style={{ animationDelay: `${startMs + i * stepMs}ms` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const [go, setGo] = useState(false);
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [dir, setDir] = useState<"n" | "p">("n");
  const [tick, setTick] = useState(0);

  const stackRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const m1 = useMagnetic<HTMLSpanElement>(0.24);
  const m2 = useMagnetic<HTMLSpanElement>(0.24);

  useEffect(() => {
    const t = setTimeout(() => setGo(true), prefersReducedMotion() ? 0 : INTRO_DELAY);
    return () => clearTimeout(t);
  }, []);

  const goSlide = useCallback(
    (n: number, d: "n" | "p") => {
      const target = ((n % SLIDES.length) + SLIDES.length) % SLIDES.length;
      if (target === idx) return;
      setDir(d);
      setPrevIdx(idx);
      setIdx(target);
      setTick((t) => t + 1);
    },
    [idx]
  );
  const next = useCallback(() => goSlide(idx + 1, "n"), [idx, goSlide]);
  const prev = useCallback(() => goSlide(idx - 1, "p"), [idx, goSlide]);

  useEffect(() => {
    if (!go) return;
    const t = setTimeout(next, HOLD);
    return () => clearTimeout(t);
  }, [go, idx, tick, next]);

  useEffect(() => {
    if (prevIdx === null) return;
    const t = setTimeout(() => setPrevIdx(null), 1500);
    return () => clearTimeout(t);
  }, [prevIdx, tick]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [next, prev]);

  /* mouse parallax + scroll fade */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = !window.matchMedia("(pointer: coarse)").matches;
    const mouse = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let scrollY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => { scrollY = window.scrollY; };

    const loop = () => {
      cur.x += (mouse.x - cur.x) * 0.05;
      cur.y += (mouse.y - cur.y) * 0.05;
      const sp = Math.min(scrollY / window.innerHeight, 1);

      if (stackRef.current)
        stackRef.current.style.transform =
          `translate3d(${cur.x * -16}px, ${cur.y * -10 + sp * 85}px, 0)`;
      if (fgRef.current) {
        fgRef.current.style.transform =
          `translate3d(${cur.x * 7}px, ${cur.y * 5 - sp * 44}px, 0)`;
        fgRef.current.style.opacity = String(Math.max(1 - sp * 1.25, 0));
      }
      if (ghostRef.current)
        ghostRef.current.style.transform =
          `translate3d(${cur.x * 26}px, ${cur.y * 18 - sp * 120}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    if (fine) window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      if (fine) window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  const goTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const s = SLIDES[idx];

  return (
    <section
      id="home"
      className={`hx dir-${dir}${go ? " go" : ""}`}
      aria-label="Welcome to Café de Bangkok"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{css}</style>

      {/* L1 — slideshow inside the opening frame */}
      <div className="hx-frame">
        <div className="hx-stack" ref={stackRef} aria-hidden>
          {SLIDES.map((sl, i) => (
            <div
              key={sl.img + i}
              className={["hx-slide", i === idx ? "on" : "", i === prevIdx ? "was" : ""]
                .filter(Boolean).join(" ")}
            >
              <img
                src={sl.img}
                alt=""
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
          <i className="hx-sheen" key={`sheen-${idx}-${tick}`} aria-hidden />
        </div>

        {/* L2 — readability */}
        <div className="hx-veil" aria-hidden />
        <div className="hx-blurpane" aria-hidden />
        <div className="hx-grad" aria-hidden />

        {/* L3 — ember particles */}
        <div className="hx-embers" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => <i key={i} />)}
        </div>
      </div>

      {/* L4 — giant ghost numeral */}
      <div className="hx-ghostno" ref={ghostRef} aria-hidden>
        <span key={`g-${idx}`}>{String(idx + 1).padStart(2, "0")}</span>
      </div>

      {/* L5 — drawn corner frames */}
      <i className="hx-corner tl" aria-hidden />
      <i className="hx-corner br" aria-hidden />

      {/* L6 — vertical side rail */}
      <p className="hx-rail" aria-hidden>
        EST. KOCHI&nbsp;&nbsp;—&nbsp;&nbsp;THAI · CHINESE · JAPANESE
      </p>

      {/* L7 — content */}
      <div className="shell hx-fg" ref={fgRef}>
        <div className="hx-caption" key={`cap-${idx}-${tick}`} aria-live="polite">
          <p className="hx-kicker">
            <i className="a" />
            {s.kicker}
            <i className="b" />
          </p>

          <h1 className="hx-title">
            <span className="hx-row"><Words text={s.line1} startMs={240} /></span>
            <span className="hx-row">
              <Words text={s.line2} startMs={380} />
              <span className="hx-wm">
                <span
                  className="hx-w"
                  style={{ animationDelay: `${380 + s.line2.split(" ").length * 70}ms` }}
                >
                  <span className="hx-accent">
                    <em className="hx-em">{s.accent}</em>
                    {/* hand-drawn underline */}
                    <svg className="hx-stroke" viewBox="0 0 220 22" preserveAspectRatio="none" aria-hidden>
                      <path d="M4 15 C 50 7, 90 19, 132 12 S 200 8, 216 13" />
                    </svg>
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <p className="hx-sub">{s.sub}</p>
        </div>

        <div className="hx-fixed">
          <div className="hx-acts">
            <span ref={m1} className="magnet">
              <button className="btn btn-solid" onClick={goTo("signatures")} onMouseEnter={grow("taste")} onMouseLeave={shrink}>
                The Signatures <Arrow />
              </button>
            </span>
            <span ref={m2} className="magnet">
              <a className="btn btn-hollow hx-glass" href={SITE.phoneHref} onMouseEnter={grow("call")} onMouseLeave={shrink}>
                Reserve a Table
              </a>
            </span>
          </div>
          <p className="hx-proof">
            <span className="hx-cert">{SITE.certification}</span>
            <span className="hx-stars" aria-hidden>★★★★★</span>
            <b>{SITE.rating}</b> · {SITE.reviewCount} guest reviews
            <i aria-hidden />
            open daily 11:30 — 23:00
          </p>
        </div>
      </div>

      {/* L8 — thumbnail navigation */}
      <nav className="hx-thumbs" aria-label="Slides">
        {SLIDES.map((sl, i) => (
          <button
            key={i}
            className={`hx-thumb${i === idx ? " on" : ""}`}
            onClick={() => goSlide(i, i > idx ? "n" : "p")}
            aria-label={`Slide ${i + 1}: ${sl.kicker}`}
            aria-current={i === idx ? "true" : undefined}
            onMouseEnter={grow()}
            onMouseLeave={shrink}
          >
            <img src={sl.img} alt="" loading="lazy" draggable={false} />
            <i key={i === idx ? `p-${tick}` : `s-${i}`} />
          </button>
        ))}
        <div className="hx-arrows">
          <button onClick={prev} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ticker (styles live in globals) */}
      <div className="ticker hx-ticker" aria-hidden>
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {["Tom Yum", "Hand-folded Dim Sum", "Wok Fire", "Salmon Maki", "Green Curry", "Thai Iced Tea", "Bingsu"].map((t, i) => (
                <span key={t} style={{ display: "flex", alignItems: "center" }}>
                  <span className={`tk${i % 2 ? " ghost" : ""}`}>{t}</span>
                  <span className="tk-dot" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.hx { position:relative; min-height:100svh; display:flex; flex-direction:column;
  justify-content:flex-end; overflow:hidden; isolation:isolate; background:#020202; }

/* ─── L1 · frame-open + slides ─── */
.hx-frame { position:absolute; inset:0; z-index:1;
  clip-path:inset(32% 36% 28% 36% round 24px);
  transition:clip-path 1.45s cubic-bezier(.83,0,.17,1) .4s; }
.hx.go .hx-frame { clip-path:inset(0% 0% 0% 0% round 0px); }

.hx-stack { position:absolute; inset:-4%; will-change:transform;
  filter:blur(12px) brightness(.5); scale:1.12;
  transition:filter 1.9s cubic-bezier(.22,1,.36,1) .5s, scale 2.4s cubic-bezier(.22,1,.36,1) .4s; }
.hx.go .hx-stack { filter:blur(0) brightness(1); scale:1; }

.hx-slide { position:absolute; inset:0; z-index:1; opacity:0; pointer-events:none; }
.hx-slide img { width:100%; height:100%; object-fit:cover; object-position:center 42%; will-change:transform; }
.hx:not(.go) .hx-slide.on { opacity:1; }
.hx:not(.go) .hx-slide.on img { transform:scale(1.12); }

.hx-slide.on { opacity:1; z-index:3; }
.hx.dir-n .hx-slide.on { animation:hxw-n 1.3s cubic-bezier(.83,0,.17,1) both; }
.hx.dir-p .hx-slide.on { animation:hxw-p 1.3s cubic-bezier(.83,0,.17,1) both; }
@keyframes hxw-n { from { clip-path:inset(0 0 0 100%); } to { clip-path:inset(0 0 0 0); } }
@keyframes hxw-p { from { clip-path:inset(0 100% 0 0); } to { clip-path:inset(0 0 0 0); } }

.hx.dir-n .hx-slide.on img { animation:hxp-n 1.3s cubic-bezier(.83,0,.17,1) both, hxkb 9s cubic-bezier(.22,1,.36,1) 1.1s forwards; }
.hx.dir-p .hx-slide.on img { animation:hxp-p 1.3s cubic-bezier(.83,0,.17,1) both, hxkb 9s cubic-bezier(.22,1,.36,1) 1.1s forwards; }
@keyframes hxp-n { from { transform:translateX(7%) scale(1.16); } to { transform:translateX(0) scale(1.12); } }
@keyframes hxp-p { from { transform:translateX(-7%) scale(1.16); } to { transform:translateX(0) scale(1.12); } }
@keyframes hxkb  { from { scale:1; } to { scale:.93; } }

.hx-slide.was { opacity:1; z-index:2; animation:hxout 1.3s cubic-bezier(.22,1,.36,1) both; }
@keyframes hxout { to { opacity:.2; filter:blur(6px) brightness(.5); transform:scale(1.07); } }

.hx-sheen { position:absolute; inset:0; z-index:4; pointer-events:none; mix-blend-mode:screen;
  background:linear-gradient(105deg, transparent 28%, rgba(255,196,87,.2) 44%,
    rgba(255,255,255,.13) 50%, rgba(255,179,33,.17) 56%, transparent 72%);
  background-size:280% 100%; background-position:130% 0;
  animation:hxsheen 1.5s cubic-bezier(.22,1,.36,1) .1s both; }
@keyframes hxsheen { from { background-position:130% 0; opacity:1; } to { background-position:-130% 0; opacity:0; } }

/* ─── L2 · readability ─── */
.hx-veil { position:absolute; inset:0; z-index:5; background:rgba(5,4,4,.44); }
.hx-blurpane { position:absolute; inset:0; z-index:5; pointer-events:none;
  backdrop-filter:blur(20px) saturate(1.05); -webkit-backdrop-filter:blur(20px) saturate(1.05);
  mask-image:linear-gradient(to top, rgba(0,0,0,.96) 0%, rgba(0,0,0,.85) 28%, transparent 60%);
  -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,.96) 0%, rgba(0,0,0,.85) 28%, transparent 60%); }
.hx-grad { position:absolute; inset:0; z-index:5;
  background:
    linear-gradient(to top, rgba(5,4,4,.95) 0%, rgba(5,4,4,.46) 34%, rgba(10,6,4,.14) 60%, rgba(5,4,4,.5) 100%),
    linear-gradient(98deg, rgba(5,4,4,.55) 0%, transparent 55%); }

/* ─── L3 · embers ─── */
.hx-embers { position:absolute; inset:0; z-index:5; pointer-events:none; overflow:hidden; }
.hx-embers i { position:absolute; bottom:-10px; width:4px; height:4px; border-radius:50%;
  background:var(--amber); filter:blur(.5px);
  box-shadow:0 0 10px rgba(255,179,33,.8); opacity:0;
  animation:ember 9s linear infinite; }
.hx-embers i:nth-child(1){ left:8%;  animation-delay:0s;    scale:.7; }
.hx-embers i:nth-child(2){ left:18%; animation-delay:2.2s;  scale:1; }
.hx-embers i:nth-child(3){ left:31%; animation-delay:4.8s;  scale:.6; }
.hx-embers i:nth-child(4){ left:44%; animation-delay:1.4s;  scale:.85; }
.hx-embers i:nth-child(5){ left:57%; animation-delay:6.1s;  scale:.7; }
.hx-embers i:nth-child(6){ left:68%; animation-delay:3.3s;  scale:1.05; }
.hx-embers i:nth-child(7){ left:78%; animation-delay:7.4s;  scale:.6; }
.hx-embers i:nth-child(8){ left:87%; animation-delay:.9s;   scale:.8; }
.hx-embers i:nth-child(9){ left:95%; animation-delay:5.2s;  scale:.7; }
@keyframes ember {
  0%   { transform:translateY(0) translateX(0); opacity:0; }
  8%   { opacity:.85; }
  55%  { opacity:.5; transform:translateY(-46vh) translateX(14px); }
  100% { transform:translateY(-92vh) translateX(-10px); opacity:0; }
}

/* ─── L4 · ghost numeral ─── */
.hx-ghostno { position:absolute; right:clamp(8px,4vw,60px); top:14%; z-index:5;
  pointer-events:none; will-change:transform; }
.hx-ghostno span { display:block; font-family:'Italiana', var(--serif);
  font-size:clamp(9rem,24vw,22rem); line-height:1;
  color:transparent; -webkit-text-stroke:1px rgba(245,239,230,.13);
  animation:ghost-in 1.1s cubic-bezier(.22,1,.36,1) both; }
@keyframes ghost-in { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:none; } }

/* ─── L5 · drawn corners ─── */
.hx-corner { position:absolute; z-index:6; width:clamp(60px,8vw,110px); aspect-ratio:1; pointer-events:none; }
.hx-corner::before, .hx-corner::after { content:""; position:absolute; background:rgba(255,179,33,.55);
  box-shadow:0 0 12px rgba(255,179,33,.35); }
.hx-corner::before { height:1px; width:100%; transform:scaleX(0); transition:transform 1s cubic-bezier(.83,0,.17,1) 2s; }
.hx-corner::after  { width:1px; height:100%; transform:scaleY(0); transition:transform 1s cubic-bezier(.83,0,.17,1) 2.15s; }
.hx.go .hx-corner::before { transform:scaleX(1); }
.hx.go .hx-corner::after  { transform:scaleY(1); }
.hx-corner.tl { top:clamp(96px,12vh,130px); left:clamp(16px,3vw,44px); }
.hx-corner.tl::before { top:0; left:0; transform-origin:left; }
.hx-corner.tl::after  { top:0; left:0; transform-origin:top; }
.hx-corner.br { bottom:clamp(120px,15vh,170px); right:clamp(16px,3vw,44px); }
.hx-corner.br::before { bottom:0; right:0; transform-origin:right; }
.hx-corner.br::after  { bottom:0; right:0; transform-origin:bottom; }

/* ─── L6 · side rail ─── */
.hx-rail { position:absolute; left:clamp(10px,2vw,28px); top:50%; z-index:6;
  transform:translateY(-50%) rotate(180deg); writing-mode:vertical-rl;
  font-size:.6rem; letter-spacing:.5em; text-transform:uppercase;
  color:rgba(245,239,230,.4); pointer-events:none; white-space:nowrap;
  opacity:0; transition:opacity 1s var(--ease) 2.4s; }
.hx.go .hx-rail { opacity:1; }

/* ─── L7 · caption ─── */
.hx-fg { position:relative; z-index:7; display:flex; flex-direction:column; gap:28px;
  padding-top:max(112px,12vh); padding-bottom:clamp(118px,14vh,168px);
  will-change:transform,opacity; }
.hx-caption { max-width:min(840px,94%); perspective:900px; }

.hx-kicker { display:flex; align-items:center; gap:14px;
  font-size:.66rem; font-weight:500; letter-spacing:.42em; text-transform:uppercase;
  color:var(--amber); animation:hxkick .95s var(--ease) .2s both; }
.hx-kicker .a { width:44px; height:1px; background:linear-gradient(90deg,transparent,var(--amber)); }
.hx-kicker .b { width:44px; height:1px; background:linear-gradient(90deg,var(--amber),transparent); }
@keyframes hxkick { from { opacity:0; letter-spacing:.7em; transform:translateY(12px); }
  to { opacity:1; letter-spacing:.42em; transform:none; } }

.hx-title { margin:clamp(16px,2.6vh,26px) 0 0; }
.hx-row { display:block; }
.hx-wm { display:inline-block; overflow:hidden; vertical-align:bottom;
  padding-bottom:.1em; margin-bottom:-.1em; }
.hx-w { display:inline-block; font-family:'Italiana', var(--serif); font-weight:400;
  font-size:clamp(2.8rem,8vw,6.6rem); line-height:1.04; letter-spacing:.005em;
  color:#fdfaf4; text-shadow:0 4px 38px rgba(5,4,4,.85);
  transform:translateY(118%) rotateX(38deg); transform-origin:bottom center;
  filter:blur(7px); opacity:0;
  animation:hxword .95s cubic-bezier(.83,0,.17,1) forwards;
  will-change:transform,filter,opacity; }
@keyframes hxword { 60% { filter:blur(0); } to { transform:none; filter:blur(0); opacity:1; } }

.hx-accent { position:relative; display:inline-block; }
.hx-em { font-family:var(--serif); font-style:italic; font-weight:400;
  background:linear-gradient(100deg, var(--amber) 20%, #ffe9b8 40%, #fff3d6 47%, var(--amber) 62%);
  background-size:240% 100%; background-position:118% 0;
  -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 0 30px rgba(255,179,33,.4)) drop-shadow(0 4px 22px rgba(5,4,4,.8));
  animation:hxshine 2s cubic-bezier(.22,1,.36,1) 1s both; }
@keyframes hxshine { from { background-position:118% 0; } to { background-position:-118% 0; } }

/* hand-drawn underline strokes itself in */
.hx-stroke { position:absolute; left:-2%; right:-4%; bottom:-.08em; width:104%; height:.3em;
  overflow:visible; }
.hx-stroke path { fill:none; stroke:var(--ember); stroke-width:3; stroke-linecap:round;
  filter:drop-shadow(0 0 8px rgba(255,77,28,.5));
  stroke-dasharray:300; stroke-dashoffset:300;
  animation:hxdraw .9s cubic-bezier(.65,0,.35,1) 1.25s forwards; }
@keyframes hxdraw { to { stroke-dashoffset:0; } }

.hx-sub { margin-top:clamp(14px,2.2vh,22px); max-width:46ch;
  color:rgba(245,239,230,.86); font-size:clamp(.95rem,1.25vw,1.08rem);
  text-shadow:0 2px 16px rgba(5,4,4,.9);
  animation:hxsub 1.05s cubic-bezier(.83,0,.17,1) .8s both; }
@keyframes hxsub { from { opacity:0; clip-path:inset(0 100% 0 0); transform:translateY(10px); }
  to { opacity:1; clip-path:inset(0 -2% 0 0); transform:none; } }

.hx-fixed { display:flex; flex-direction:column; gap:20px;
  opacity:0; transform:translateY(24px);
  transition:opacity 1s var(--ease) 2.2s, transform 1s var(--ease) 2.2s; }
.hx.go .hx-fixed { opacity:1; transform:none; }
.hx-acts { display:flex; gap:14px; flex-wrap:wrap; }
.hx-glass { box-shadow:inset 0 0 0 1px rgba(245,239,230,.32); background:rgba(5,4,4,.32);
  backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); }
.hx-proof { display:flex; align-items:center; gap:11px; flex-wrap:wrap;
  color:rgba(245,239,230,.72); font-size:.8rem; }
.hx-proof b { color:var(--bone); font-weight:600; }
.hx-proof i { width:24px; height:1px; background:rgba(245,239,230,.28); }
.hx-stars { color:var(--amber); letter-spacing:4px; filter:drop-shadow(0 0 10px rgba(255,179,33,.5)); }
.hx-cert { display:inline-flex; align-items:center; padding:5px 12px; border-radius:100px;
  border:1px solid rgba(255,179,33,.4); background:rgba(255,179,33,.09);
  font-family:var(--head); font-size:.54rem; font-weight:500; letter-spacing:.22em;
  text-transform:uppercase; color:var(--amber); white-space:nowrap; }

/* ─── L8 · thumbnail navigation ─── */
.hx-thumbs { position:absolute; right:clamp(16px,3.2vw,44px); bottom:clamp(116px,15vh,176px);
  z-index:7; display:flex; align-items:center; gap:10px;
  opacity:0; transform:translateY(20px);
  transition:opacity 1s var(--ease) 2.4s, transform 1s var(--ease) 2.4s; }
.hx.go .hx-thumbs { opacity:1; transform:none; }

.hx-thumb { position:relative; width:64px; height:42px; border-radius:10px; overflow:hidden;
  border:1px solid rgba(245,239,230,.2); opacity:.55; flex:none;
  transition:opacity .4s, transform .45s var(--ease), border-color .4s, width .45s var(--ease); }
.hx-thumb img { width:100%; height:100%; object-fit:cover; }
.hx-thumb:hover { opacity:.9; transform:translateY(-3px); }
.hx-thumb.on { opacity:1; width:84px; border-color:rgba(255,179,33,.7);
  box-shadow:0 8px 26px rgba(255,140,33,.25); }
.hx-thumb i { position:absolute; left:0; right:0; bottom:0; height:3px;
  background:var(--amber); transform:scaleX(0); transform-origin:left; }
.hx-thumb.on i { animation:hxprog 7000ms linear forwards; box-shadow:0 0 10px rgba(255,179,33,.8); }
@keyframes hxprog { to { transform:scaleX(1); } }

.hx-arrows { display:flex; gap:8px; margin-left:8px; }
.hx-arrows button { width:46px; height:46px; border-radius:50%; display:grid; place-items:center;
  color:var(--bone); border:1px solid rgba(245,239,230,.25);
  background:rgba(5,4,4,.35); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  transition:background .4s, border-color .4s, color .4s, transform .45s var(--ease); }
.hx-arrows button:hover { background:var(--amber); border-color:var(--amber); color:#050404;
  transform:translateY(-3px) scale(1.05); }
.hx-arrows button:active { transform:scale(.95); }
.hx-arrows svg { width:18px; height:18px; }

.hx-ticker { position:relative; z-index:8; }

/* ─── responsive ─── */
@media (max-width:1100px){
  .hx-ghostno { display:none; }
}
@media (max-width:900px){
  .hx-frame { clip-path:inset(28% 12% 26% 12% round 20px); }
  .hx-rail, .hx-corner { display:none; }
  .hx-thumbs { position:static; order:3; width:calc(100% - 40px);
    margin:0 auto 16px; justify-content:center; }
  .hx-fg { padding-bottom:22px; }
  .hx-slide img { object-position:56% 42%; }
  .hx-blurpane { backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
  .hx-embers i { display:none; }
  .hx-embers i:nth-child(-n+5){ display:block; }
}
@media (max-width:560px){
  .hx-w { font-size:clamp(2.3rem,10.8vw,3.3rem); }
  .hx-kicker { font-size:.56rem; letter-spacing:.3em; }
  .hx-acts { width:100%; }
  .hx-acts .magnet { flex:1; }
  .hx-acts .btn { width:100%; justify-content:center; }
  .hx-proof { font-size:.74rem; gap:7px; }
  .hx-proof i { width:3px; height:3px; border-radius:50%; background:rgba(245,239,230,.45); }
  /* two cramped half-width pills force the label to wrap — stack instead */
  .hx-acts { flex-direction:column; align-items:stretch; }
  .hx-acts .magnet { flex:none; width:100%; }
  .hx-thumb { width:54px; height:36px; }
  .hx-thumb.on { width:70px; }
  .hx-arrows button { width:42px; height:42px; }
}

/* ─── reduced motion (respects force-motion) ─── */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .hx-frame { clip-path:none !important; transition:none !important; }
  html:not(.force-motion) .hx-stack { filter:none !important; scale:1 !important; transition:none !important; }
  html:not(.force-motion) .hx-slide.on { animation:none !important; clip-path:inset(0) !important; opacity:1 !important; }
  html:not(.force-motion) .hx-slide.on img,
  html:not(.force-motion) .hx-slide.was,
  html:not(.force-motion) .hx-sheen,
  html:not(.force-motion) .hx-embers i,
  html:not(.force-motion) .hx-ghostno span { animation:none !important; }
  html:not(.force-motion) .hx-w,
  html:not(.force-motion) .hx-kicker,
  html:not(.force-motion) .hx-sub { animation:none !important; transform:none !important;
    filter:none !important; opacity:1 !important; clip-path:none !important; }
  html:not(.force-motion) .hx-em { animation:none !important; background:none !important;
    color:var(--amber) !important; -webkit-text-fill-color:var(--amber); }
  html:not(.force-motion) .hx-stroke path { animation:none !important; stroke-dashoffset:0; }
  html:not(.force-motion) .hx-fixed,
  html:not(.force-motion) .hx-thumbs,
  html:not(.force-motion) .hx-rail { opacity:1 !important; transform:none !important; transition:none !important; }
  html:not(.force-motion) .hx-corner::before,
  html:not(.force-motion) .hx-corner::after { transform:none !important; transition:none !important; }
  html:not(.force-motion) .hx-thumb.on i { animation:none !important; transform:scaleX(1); }
}
`;