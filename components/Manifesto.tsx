"use client";

/* ════════════════════════════════════════════════════════════════
   PHILOSOPHY → "No compromise." — a night-market poster

     1  poster — giant condensed NO, Bodoni "compromise.", the Thai
        line in calligraphy, a spinning Thai SELECT seal
     2  two taped polaroids beside the scroll-lit manifesto; hot
        words turn Bodoni amber and get an ember marker swipe
     3  crossing tapes — two diagonal marquees running opposite ways
     4  ritual — Pound · Fire · Fold · Serve as expanding panels,
        auto-advancing while on screen (hover / tap / focus to pick)
     5  bento — inverted pull-quote, craft pillars, proof counters
     6  CTA

   Honours force-motion / reduced-motion; transforms + opacity only.
   ════════════════════════════════════════════════════════════════ */

import { Fragment, useEffect, useRef, useState } from "react";
import { PHILOSOPHY, SITE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { Label, RollLink } from "@/components/Kit";

const WORDS = PHILOSOPHY.manifesto.split(/\s+/);
const HOT = new Set<string>(PHILOSOPHY.hotWords);

/* count-up for plain numeric stats ("₹800", "4.5★"); others stay put */
function Stat({ value, sub, n }: { value: string; sub: string; n: number }) {
  const ref = useRef<HTMLElement>(null);
  const [txt, setTxt] = useState(value);

  useEffect(() => {
    const m = value.match(/^(\D?)([\d.]+)(\D?)$/);
    const el = ref.current;
    if (!m || !el || prefersReducedMotion()) return;
    const [, before, num, after] = m;
    const target = parseFloat(num);
    const decimals = (num.split(".")[1] || "").length;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1500, 1);
        setTxt(before + (target * (1 - Math.pow(1 - p, 4))).toFixed(decimals) + after);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return (
    <article className={`ph-tile ph-stat s${n} reveal d${n}`} ref={ref}>
      <b>{txt}</b>
      <span>{sub}</span>
    </article>
  );
}

/* spinning seal with curved text */
function Seal() {
  return (
    <div className="ph-seal" aria-hidden>
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="phSealPath" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <circle cx="100" cy="100" r="97" />
        <text>
          <textPath href="#phSealPath">THAI SELECT · CERTIFIED · KADAVANTHRA · KOCHI ·</textPath>
        </text>
      </svg>
      <span className="nm-thai" lang="th">อร่อย</span>
    </div>
  );
}

/* two diagonal marquee tapes that cross */
function Tapes() {
  const row = (k: number) => (
    <span className="ph-tape-row" key={k}>
      {PHILOSOPHY.marquee.map((w) => (
        <Fragment key={`${k}-${w}`}>
          <span>{w}</span>
          <i />
        </Fragment>
      ))}
    </span>
  );
  return (
    <div className="ph-tapes" aria-hidden>
      <div className="ph-tape a"><div className="ph-tape-track">{[0, 1].map(row)}</div></div>
      <div className="ph-tape b"><div className="ph-tape-track">{[0, 1].map(row)}</div></div>
    </div>
  );
}

/* Pound · Fire · Fold · Serve — expanding panels */
function Ritual() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; }, { threshold: 0.45 });
    io.observe(el);
    if (prefersReducedMotion()) return () => io.disconnect();
    /* advance only while visible and not being handled */
    const t = setInterval(() => {
      if (onScreen.current && !el.matches(":hover") && !el.contains(document.activeElement))
        setStep((s) => (s + 1) % PHILOSOPHY.ritual.length);
    }, 4200);
    return () => { io.disconnect(); clearInterval(t); };
  }, []);

  return (
    <div className="ph-ritual">
      <div className="ph-ritual-head">
        <h3 className="reveal">Four steps, <em>every plate</em></h3>
        <p className="nm-lede reveal d1">No shortcuts hide between them.</p>
      </div>

      <div className="ph-panels reveal d1" ref={ref}>
        {PHILOSOPHY.ritual.map((r, i) => (
          <button
            key={r.t}
            className="ph-panel"
            data-on={i === step}
            aria-current={i === step ? "step" : undefined}
            onClick={() => setStep(i)}
            onMouseEnter={() => setStep(i)}
            onFocus={() => setStep(i)}
          >
            <img src={r.img} alt="" loading="lazy" draggable={false} />
            <span className="ph-panel-no">0{i + 1}</span>
            <span className="ph-panel-th nm-thai" lang="th" aria-hidden>{r.th}</span>
            <span className="ph-panel-v" aria-hidden>{r.t}</span>
            <span className="ph-panel-c">
              <b>{r.t}</b>
              <span>{r.body}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  const leadRef = useRef<HTMLParagraphElement>(null);

  /* scroll word-fill */
  useEffect(() => {
    const el = leadRef.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".ph-w"));
    if (prefersReducedMotion()) { spans.forEach((s) => s.classList.add("lit")); return; }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(Math.max((vh * 0.82 - r.top) / (r.height + vh * 0.18), 0), 1);
        const lit = Math.round(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle("lit", i < lit));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Our Philosophy — Café de Bangkok, Kochi",
    description: PHILOSOPHY.manifesto,
  };

  return (
    <section id="philosophy" className="ph nm" aria-labelledby="ph-title">
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="ph-bg" aria-hidden>
        <span className="ph-water nm-thai" lang="th">เผ็ด</span>
      </div>

      <div className="shell">
        {/* 1 · poster */}
        <header className="ph-poster">
          <div className="ph-poster-top">
            <Label no="01" className="reveal">{PHILOSOPHY.eyebrow}</Label>
            <Seal />
          </div>
          <h2 className="ph-title reveal d1" id="ph-title">
            <span className="ph-no">No</span>
            <em className="ph-comp">compromise.</em>
          </h2>
          <p className="ph-thai reveal d2">
            <span className="nm-thai" lang="th">{PHILOSOPHY.signature}</span>
            <small>“{PHILOSOPHY.signatureEn}” — in Thai</small>
          </p>
        </header>

        {/* 2 · polaroids + manifesto */}
        <div className="ph-body">
          <div className="ph-photos reveal">
            <figure className="ph-pol a">
              <img src={PHILOSOPHY.heroImg} alt="The lantern-lit dining room at Café de Bangkok, Kochi" loading="lazy" draggable={false} />
              <figcaption>The lantern room</figcaption>
              <i className="ph-tape-bit" aria-hidden />
            </figure>
            <figure className="ph-pol b">
              <img src={PHILOSOPHY.pillarImg} alt="Hands at work in the Café de Bangkok kitchen" loading="lazy" draggable={false} />
              <figcaption>In the kitchen, every morning</figcaption>
              <i className="ph-tape-bit" aria-hidden />
            </figure>
          </div>

          <div className="ph-copy">
            <p className="ph-lead" ref={leadRef}>
              {WORDS.map((w, i) => (
                <Fragment key={i}>
                  <span className={`ph-w${HOT.has(w) ? " hot" : ""}`}>{w}</span>{" "}
                </Fragment>
              ))}
            </p>
            <p className="ph-by reveal"><i aria-hidden />The kitchen at {SITE.name}</p>
          </div>
        </div>
      </div>

      {/* 3 · crossing tapes — full bleed */}
      <Tapes />

      <div className="shell">
        {/* 4 · ritual */}
        <Ritual />

        {/* 5 · bento */}
        <div className="ph-bento">
          <blockquote className="ph-tile ph-quote reveal">
            <span className="ph-qmark" aria-hidden>“</span>
            <p>{PHILOSOPHY.pullQuote.text}</p>
            <cite>— {PHILOSOPHY.pullQuote.by}</cite>
          </blockquote>

          {PHILOSOPHY.pillars.map((p, i) => (
            <article className={`ph-tile ph-pillar p${i + 1} reveal d${i + 1}`} key={p.k}>
              <span className="ph-pillar-k">{p.k}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}

          <figure className="ph-tile ph-photo reveal d3">
            <img src={PHILOSOPHY.proofImg} alt="A warmly lit table for two at Café de Bangkok" loading="lazy" draggable={false} />
            <figcaption>Table for two</figcaption>
          </figure>

          {PHILOSOPHY.stats.map((s, i) => (
            <Stat key={s.s} value={s.b} sub={s.s} n={i + 1} />
          ))}
        </div>

        {/* 6 · CTA */}
        <div className="ph-foot reveal">
          <p>Come taste what <em>we mean.</em></p>
          <RollLink href={SITE.phoneHref} label="Reserve a table" cursor="call" />
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.ph { position:relative; padding:clamp(100px,12vw,180px) 0 clamp(90px,10vw,150px); overflow:hidden; }

.ph-bg { position:absolute; inset:0; z-index:0; pointer-events:none;
  background:
    radial-gradient(46% 36% at 88% 6%, rgba(255,77,28,.13), transparent 70%),
    radial-gradient(40% 30% at 6% 48%, rgba(255,179,33,.07), transparent 70%); }
.ph-water { position:absolute; right:-3vw; top:30%; font-size:clamp(12rem,30vw,30rem); line-height:1.3;
  color:transparent; -webkit-text-stroke:1px rgba(255,179,33,.08); }

/* ════ 1 · poster ════ */
.ph-poster { position:relative; margin-bottom:clamp(60px,8vw,120px); }
.ph-poster-top { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; }
.ph-title { display:flex; flex-direction:column; margin-top:clamp(10px,2vw,24px); }
.ph-no { display:block; font-family:var(--nm-disp); font-weight:800; font-stretch:75%;
  text-transform:uppercase; font-size:clamp(8.5rem,29vw,27rem); line-height:.74; letter-spacing:-.025em;
  background:linear-gradient(180deg, var(--bone) 30%, rgba(245,239,230,.12) 96%);
  -webkit-background-clip:text; background-clip:text; color:transparent; }
.ph-comp { position:relative; display:block; font-family:var(--nm-serif); font-style:italic; font-weight:500;
  font-size:clamp(3.4rem,11.8vw,11rem); line-height:.9; letter-spacing:-.04em; color:var(--amber);
  margin:-.34em 0 0 clamp(20px,15vw,250px);
  text-shadow:0 0 60px rgba(255,179,33,.35), 0 10px 40px rgba(6,5,5,.9); }
.ph-thai { position:absolute; right:0; top:44%; display:flex; flex-direction:column; align-items:flex-end; gap:6px;
  padding-left:clamp(20px,4vw,80px); }
.ph-thai span { font-size:clamp(1.5rem,3vw,2.7rem); line-height:1.4; color:rgba(245,239,230,.62); }
.ph-thai small { display:flex; align-items:center; gap:12px; font-family:var(--nm-mono); font-size:.66rem;
  letter-spacing:.16em; text-transform:uppercase; color:var(--ash); }
.ph-thai small::before { content:""; width:36px; height:1px; background:var(--amber); }

.ph-seal { position:relative; flex:none; width:clamp(96px,10vw,136px); aspect-ratio:1;
  display:grid; place-items:center; border-radius:50%;
  background:radial-gradient(circle at 38% 30%, #1b130c, #0a0807 72%); box-shadow:0 18px 50px rgba(0,0,0,.5); }
.ph-seal svg { position:absolute; inset:0; width:100%; height:100%; animation:orbit 24s linear infinite; }
.ph-seal circle { fill:none; stroke:rgba(255,179,33,.35); stroke-width:1; }
.ph-seal text { font-family:var(--nm-mono); font-size:12.6px; letter-spacing:1.6px; fill:var(--amber); }
.ph-seal span { font-size:clamp(1.3rem,1.8vw,1.7rem); line-height:1.2; color:var(--amber);
  text-shadow:0 0 18px rgba(255,179,33,.55); }

/* ════ 2 · polaroids + manifesto ════ */
.ph-body { display:grid; grid-template-columns:.82fr 1.18fr; gap:clamp(40px,7vw,120px); align-items:center; }
.ph-photos { position:relative; aspect-ratio:1/1.08; max-width:520px; }
.ph-pol { position:absolute; width:70%; margin:0; padding:10px 10px 46px; border-radius:3px;
  background:var(--paper); box-shadow:0 34px 80px rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.4) inset;
  transition:transform .9s var(--ease); }
.ph-pol img { width:100%; aspect-ratio:1/1.04; object-fit:cover; border-radius:1px; filter:contrast(1.05) saturate(.95); }
.ph-pol figcaption { position:absolute; left:14px; right:14px; bottom:13px;
  font-family:var(--nm-serif); font-style:italic; font-size:1.02rem; line-height:1.2; color:var(--ink); }
.ph-pol.a { left:0; top:0; transform:rotate(-6deg); }
.ph-pol.b { right:0; bottom:0; transform:rotate(5deg); }
.ph-photos:hover .ph-pol.a { transform:rotate(-9deg) translate(-14px,-10px); }
.ph-photos:hover .ph-pol.b { transform:rotate(8deg) translate(14px,10px); }
.ph-tape-bit { position:absolute; top:-13px; left:50%; width:104px; height:28px;
  transform:translateX(-50%) rotate(-4deg); background:rgba(255,179,33,.62);
  box-shadow:0 3px 10px rgba(0,0,0,.22);
  clip-path:polygon(0 12%,4% 0,8% 10%,12% 0,88% 0,92% 12%,96% 0,100% 10%,100% 88%,96% 100%,92% 90%,88% 100%,12% 100%,8% 88%,4% 100%,0 90%); }
.ph-pol.b .ph-tape-bit { transform:translateX(-50%) rotate(5deg); background:rgba(255,126,95,.6); }

.ph-lead { font-family:var(--nm-disp); font-weight:300; font-size:clamp(1.65rem,3.1vw,2.8rem);
  line-height:1.2; letter-spacing:-.015em; }
.ph-w { color:rgba(245,239,230,.14); transition:color .5s var(--ease); }
.ph-w.lit { color:var(--bone); }
.ph-w.hot { position:relative; isolation:isolate; font-family:var(--nm-serif); font-style:italic;
  font-weight:500; letter-spacing:-.025em; }
.ph-w.hot::after { content:""; position:absolute; z-index:-1; left:-.04em; right:-.04em; bottom:.1em; height:.14em;
  border-radius:2px; background:linear-gradient(90deg, var(--ember), rgba(255,77,28,.35));
  transform:scaleX(0); transform-origin:left; transition:transform .8s var(--ease) .1s; }
.ph-w.hot.lit { color:var(--amber); }
.ph-w.hot.lit::after { transform:scaleX(1); }
.ph-by { display:flex; align-items:center; gap:14px; margin-top:30px;
  font-family:var(--nm-mono); font-size:.72rem; letter-spacing:.16em; text-transform:uppercase; color:var(--ash); }
.ph-by i { width:40px; height:1px; background:var(--amber); }

/* ════ 3 · crossing tapes ════ */
.ph-tapes { position:relative; z-index:2; height:clamp(170px,17vw,240px); margin:clamp(80px,10vw,150px) 0; }
.ph-tape { position:absolute; left:-8vw; right:-8vw; top:50%; overflow:hidden; padding:16px 0; }
.ph-tape.a { z-index:2; transform:translateY(-50%) rotate(-3.4deg); background:var(--amber); color:var(--void);
  box-shadow:0 24px 60px rgba(255,140,33,.22); }
.ph-tape.b { z-index:1; transform:translateY(-50%) rotate(2.8deg); background:#0c0a08; color:var(--bone);
  border-block:1px solid rgba(255,179,33,.35); }
.ph-tape-track { display:flex; width:max-content; animation:ph-marq 40s linear infinite; }
.ph-tape.b .ph-tape-track { animation-duration:48s; animation-direction:reverse; }
.ph-tape-row { display:flex; align-items:center; }
.ph-tape-row span { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(1.5rem,2.8vw,2.5rem); line-height:1.1; white-space:nowrap; }
.ph-tape.b .ph-tape-row span:nth-of-type(even) { color:transparent; -webkit-text-stroke:1px var(--amber); }
.ph-tape-row i { flex:none; width:.9em; height:.9em; margin:0 .8em; font-size:clamp(1.5rem,2.8vw,2.5rem);
  background:currentColor;
  clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%); }
.ph-tape.b .ph-tape-row i { background:var(--amber); }
@keyframes ph-marq { to { transform:translateX(-50%); } }

/* ════ 4 · ritual ════ */
.ph-ritual { margin-bottom:clamp(80px,10vw,140px); }
.ph-ritual-head { display:flex; justify-content:space-between; align-items:flex-end; gap:14px 30px;
  flex-wrap:wrap; margin-bottom:clamp(26px,3vw,40px); }
.ph-ritual-head h3 { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(2.1rem,4.6vw,3.8rem); line-height:.9; color:var(--bone); }
.ph-ritual-head h3 em { font-family:var(--nm-serif); font-style:italic; font-weight:500; font-stretch:normal;
  text-transform:none; letter-spacing:-.03em; color:var(--amber); }

.ph-panels { display:flex; gap:12px; height:clamp(420px,58vh,580px); }
.ph-panel { position:relative; flex:1 1 0; min-width:0; overflow:hidden; border-radius:22px; text-align:left;
  border:1px solid var(--hair); background:var(--coal);
  transition:flex-grow .9s var(--ease), border-color .5s, box-shadow .6s; }
.ph-panel[data-on="true"] { flex-grow:4.4; border-color:rgba(255,179,33,.5);
  box-shadow:0 30px 80px rgba(0,0,0,.5), 0 0 40px rgba(255,140,33,.12); }
.ph-panel:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }
.ph-panel img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  filter:grayscale(.85) brightness(.38); transform:scale(1.14);
  transition:filter 1s var(--ease), transform 1.6s var(--ease); }
.ph-panel[data-on="true"] img { filter:none; transform:scale(1); }
.ph-panel::after { content:""; position:absolute; inset:0; z-index:1;
  background:linear-gradient(to top, rgba(6,5,5,.95) 0%, rgba(6,5,5,.4) 42%, transparent 72%); }
.ph-panel > span { position:absolute; z-index:2; }
.ph-panel-no { top:16px; left:16px; padding:4px 7px 3px; border-radius:5px; background:rgba(6,5,5,.55);
  backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
  font-family:var(--nm-mono); font-size:.7rem; letter-spacing:.12em; color:var(--amber); }
.ph-panel-th { top:4px; right:20px; font-size:clamp(2.4rem,4vw,3.8rem); line-height:1.3; color:var(--amber);
  text-shadow:0 0 26px rgba(255,179,33,.5); opacity:0; transform:translateY(-10px);
  transition:opacity .6s var(--ease), transform .8s var(--ease); }
.ph-panel[data-on="true"] .ph-panel-th { opacity:1; transform:none; transition-delay:.25s; }
.ph-panel-v { left:50%; bottom:28px; transform:translateX(-50%) rotate(180deg); writing-mode:vertical-rl;
  font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(1.7rem,2.5vw,2.3rem); line-height:1; letter-spacing:.02em; color:var(--bone);
  transition:opacity .4s; }
.ph-panel[data-on="true"] .ph-panel-v { opacity:0; }
.ph-panel-c { left:clamp(22px,2.6vw,36px); bottom:clamp(24px,2.8vw,36px); width:min(440px, 58vw);
  display:flex; flex-direction:column; gap:12px; opacity:0; transform:translateY(18px);
  transition:opacity .45s, transform .7s var(--ease); }
.ph-panel[data-on="true"] .ph-panel-c { opacity:1; transform:none; transition-delay:.35s; }
.ph-panel-c b { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(2.6rem,4.6vw,4.2rem); line-height:.86; color:var(--bone); }
.ph-panel-c span { max-width:38ch; color:rgba(245,239,230,.84); font-size:1rem; line-height:1.55; }

/* ════ 5 · bento ════ */
.ph-bento { display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
  grid-template-areas:"q q p1 p2" "q q p3 ph" "s1 s2 s3 s4"; margin-bottom:clamp(70px,9vw,120px); }
.ph-tile { position:relative; margin:0; border-radius:22px; overflow:hidden; border:1px solid var(--hair);
  padding:clamp(22px,2.4vw,34px); background:linear-gradient(160deg, #15100b, #0b0908); }

.ph-quote { grid-area:q; display:flex; flex-direction:column; justify-content:flex-end;
  min-height:clamp(340px,34vw,480px); background:var(--amber); color:var(--void); border-color:transparent;
  box-shadow:0 30px 90px rgba(255,140,33,.16); }
.ph-quote::before { content:""; position:absolute; inset:0; pointer-events:none;
  background-image:radial-gradient(rgba(6,5,5,.2) 1.3px, transparent 1.7px); background-size:13px 13px;
  -webkit-mask-image:linear-gradient(140deg, #000 0%, transparent 62%); mask-image:linear-gradient(140deg, #000 0%, transparent 62%); }
.ph-qmark { position:absolute; top:-.1em; right:.08em; font-family:var(--nm-disp); font-weight:800;
  font-size:clamp(12rem,20vw,19rem); line-height:1; color:rgba(6,5,5,.13); }
.ph-quote p { position:relative; font-family:var(--nm-serif); font-style:italic; font-weight:600;
  font-size:clamp(2.7rem,5.4vw,5rem); line-height:.96; letter-spacing:-.035em; max-width:9ch; }
.ph-quote cite { position:relative; margin-top:24px; font-style:normal; font-family:var(--nm-mono);
  font-size:.74rem; letter-spacing:.16em; text-transform:uppercase; }

.ph-pillar { display:flex; flex-direction:column; transition:border-color .5s, background .5s; }
.ph-pillar.p1 { grid-area:p1; } .ph-pillar.p2 { grid-area:p2; } .ph-pillar.p3 { grid-area:p3; }
.ph-pillar:hover { border-color:rgba(255,179,33,.4); background:linear-gradient(160deg, #1d150d, #0d0a08); }
.ph-pillar-k { font-family:var(--nm-mono); font-size:.7rem; letter-spacing:.14em; color:var(--amber); }
.ph-pillar h3 { margin:auto 0 10px; padding-top:34px; font-family:var(--nm-disp); font-weight:800; font-stretch:75%;
  text-transform:uppercase; font-size:clamp(1.5rem,2.1vw,1.95rem); line-height:.95; color:var(--bone); }
.ph-pillar p { color:var(--ash); font-size:.95rem; line-height:1.55; }
.ph-pillar::after { content:""; position:absolute; left:0; right:0; bottom:0; height:2px;
  background:linear-gradient(90deg,var(--amber),var(--ember)); transform:scaleX(0); transform-origin:left;
  transition:transform .6s var(--ease); }
.ph-pillar:hover::after { transform:scaleX(1); }

.ph-photo { grid-area:ph; padding:0; min-height:200px; }
.ph-photo img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform 1.4s var(--ease); }
.ph-photo:hover img { transform:scale(1.06); }
.ph-photo::after { content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(6,5,5,.75), transparent 55%); }
.ph-photo figcaption { position:absolute; z-index:1; left:20px; bottom:16px;
  font-family:var(--nm-serif); font-style:italic; font-size:1.15rem; color:var(--bone); }

.ph-stat.s1 { grid-area:s1; } .ph-stat.s2 { grid-area:s2; } .ph-stat.s3 { grid-area:s3; } .ph-stat.s4 { grid-area:s4; }
.ph-stat b { display:block; font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(2rem,3.3vw,3.1rem); line-height:.95; color:var(--amber); font-variant-numeric:tabular-nums;
  text-shadow:0 0 30px rgba(255,179,33,.25); }
.ph-stat span { display:block; margin-top:12px; font-family:var(--nm-mono); font-size:.68rem;
  letter-spacing:.06em; line-height:1.5; color:var(--ash); }

/* ════ 6 · CTA ════ */
.ph-foot { display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
  padding-top:clamp(28px,3vw,40px); border-top:1px solid var(--hair); }
.ph-foot p { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(2rem,4.4vw,3.6rem); line-height:.92; color:var(--bone); }
.ph-foot p em { font-family:var(--nm-serif); font-style:italic; font-weight:500; font-stretch:normal;
  text-transform:none; letter-spacing:-.03em; color:var(--amber); }

/* ════ responsive ════ */
@media (max-width:1024px){
  .ph-body { grid-template-columns:1fr; }
  .ph-photos { width:min(480px,100%); margin:0 auto; }
  .ph-bento { grid-template-columns:1fr 1fr; grid-template-areas:"q q" "p1 p2" "p3 ph" "s1 s2" "s3 s4"; }
}
@media (max-width:760px){
  .ph-panels { flex-direction:column; height:auto; gap:8px; }
  .ph-panel { flex:none; height:78px; transition:height .8s var(--ease), border-color .5s, box-shadow .6s; }
  .ph-panel[data-on="true"] { height:380px; }
  .ph-panel-no { top:26px; }
  .ph-panel-v { writing-mode:horizontal-tb; left:62px; top:50%; bottom:auto; transform:translateY(-50%);
    font-size:1.7rem; }
  .ph-panel-c { width:auto; right:22px; }
  .ph-thai { position:static; align-items:flex-start; padding-left:0; margin-top:22px; }
}
@media (max-width:600px){
  .ph-bento { grid-template-areas:"q q" "p1 p1" "p2 p2" "p3 p3" "ph ph" "s1 s2" "s3 s4"; }
  .ph-quote { min-height:300px; }
  .ph-photo { min-height:240px; }
  .ph-pillar h3 { padding-top:22px; }
  .ph-stat { padding:20px 18px; }
  .ph-comp { margin-left:12px; }
  .ph-tape { padding:12px 0; }
}

/* ════ reduced motion ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .ph-seal svg,
  html:not(.force-motion) .ph-tape-track { animation:none !important; }
}
`;
