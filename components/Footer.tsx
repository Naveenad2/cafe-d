"use client";

/* ════════════════════════════════════════════════════════════════
   FOOTER → closing call, four columns, and a neon wordmark whose
   tubes strike up letter by letter when it scrolls into view — one
   letter keeps a faulty flicker, as all good neon does.
   ════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/data";
import { grow, shrink } from "@/lib/hooks";
import { RollLink } from "@/components/Kit";

/* each letter carries its running index, which staggers the strike-up */
const LINES = ["CAFÉ DE", "BANGKOK"].map((line, l, all) => {
  const start = all.slice(0, l).join("").length;
  return { line, letters: line.split("").map((ch, i) => ({ ch, n: start + i })) };
});
const FAULTY = 11; // the first K of BANGKOK won't quite stay lit

export default function Footer() {
  const neonRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = neonRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.classList.add("lit");
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="ft nm">
      <style>{css}</style>

      <div className="shell">
        {/* closing call */}
        <div className="ft-cta">
          <h2 className="nm-h2 reveal">See you <em>tonight</em></h2>
          <div className="ft-cta-side reveal d1">
            <p className="nm-lede">
              {SITE.tagline}{" "}Walk in any day from 11:30 — or call ahead and
              we&apos;ll keep a table for you.
            </p>
            <RollLink href={SITE.phoneHref} label="Reserve a table" cursor="call" />
          </div>
        </div>

        {/* columns */}
        <div className="ft-grid">
          <div className="reveal d1">
            <h4>The short version</h4>
            <p>
              Open every day from 11:30 AM to 11 PM in Kadavanthra — bring your
              appetite and your bravest spice tolerance.
            </p>
          </div>
          <nav className="reveal d2" aria-label="Footer">
            <h4>Explore</h4>
            {NAV_LINKS.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={go(id)} onMouseEnter={grow()} onMouseLeave={shrink}>
                {label}
              </a>
            ))}
            <Link href="/menu" onMouseEnter={grow()} onMouseLeave={shrink}>Full Menu</Link>
          </nav>
          <div className="reveal d3">
            <h4>Contact</h4>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={SITE.instagram} target="_blank" rel="noreferrer">@cafedebangkok.kochi</a>
            <a href={SITE.mapsHref} target="_blank" rel="noreferrer">{SITE.address}</a>
          </div>
          <div className="reveal d4">
            <h4>Hours</h4>
            <p className="ft-hours">11:30 — 23:00</p>
            <p>Every day · walk-ins welcome</p>
            <p>{SITE.certification}</p>
          </div>
        </div>

        {/* neon wordmark */}
        <p className="ft-neon" ref={neonRef}>
          <span className="nm-sr">{SITE.name}</span>
          {LINES.map(({ line, letters }) => (
            <span className="ft-line" key={line} aria-hidden>
              {letters.map(({ ch, n }) => (
                <span
                  key={n}
                  className={n === FAULTY ? "bad" : undefined}
                  style={{ "--d": n } as React.CSSProperties}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          ))}
        </p>

        <div className="ft-base">
          <span>© {new Date().getFullYear()} {SITE.name}, {SITE.city}. All rights reserved.</span>
          <span className="ft-thanks">
            <span className="nm-thai" lang="th">ขอบคุณ</span> — thank you
          </span>
          <button
            className="ft-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onMouseEnter={grow("top")}
            onMouseLeave={shrink}
            aria-label="Back to top"
          >
            <svg className="ft-ring" viewBox="0 0 100 100" aria-hidden>
              <defs>
                <path id="ftTopPath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text><textPath href="#ftTopPath">BACK TO TOP · BACK TO TOP ·</textPath></text>
            </svg>
            <span className="ft-arrow" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.ft { position:relative; overflow:hidden; padding:clamp(80px,10vw,150px) 0 30px; border-top:1px solid var(--hair); }
.ft::before { content:""; position:absolute; left:50%; bottom:-38%; width:130vw; height:80%; transform:translateX(-50%);
  pointer-events:none; background:radial-gradient(50% 50% at 50% 50%, rgba(255,120,33,.14), transparent 70%); }

/* closing call */
.ft-cta { display:flex; justify-content:space-between; align-items:flex-end; gap:30px; flex-wrap:wrap;
  padding-bottom:clamp(50px,6vw,80px); border-bottom:1px solid var(--hair); }
.ft-cta .nm-h2 { font-size:clamp(3.2rem,9.4vw,8.6rem); }
.ft-cta-side { display:flex; flex-direction:column; align-items:flex-start; gap:22px; max-width:420px; }

/* columns */
.ft-grid { display:grid; grid-template-columns:1.3fr 1fr 1.2fr 1fr; gap:40px; margin-top:clamp(44px,5vw,70px); }
.ft-grid h4 { margin-bottom:18px; font-family:var(--nm-mono); font-weight:400; font-size:.68rem;
  letter-spacing:.2em; text-transform:uppercase; color:var(--amber); }
.ft-grid a, .ft-grid p { display:block; padding:4px 0; color:var(--ash); font-size:.96rem; line-height:1.55;
  transition:color .3s, transform .4s var(--ease); }
.ft-grid a:hover { color:var(--bone); transform:translateX(5px); }
.ft-grid .ft-hours { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; font-size:2.1rem;
  line-height:1; color:var(--bone); margin-bottom:6px; }

/* ════ neon wordmark ════ */
.ft-neon { position:relative; display:flex; justify-content:center; gap:.26em;
  margin:clamp(56px,7vw,100px) 0 clamp(26px,3vw,40px); user-select:none;
  font-family:var(--nm-disp); font-weight:800; font-stretch:75%; line-height:.8; white-space:nowrap;
  font-size:min(14.2rem, calc((100vw - 48px) / 6.15)); }
.ft-line { display:flex; }
.ft-line span { display:inline-block; color:rgba(255,179,33,.08); transition:color .25s, text-shadow .25s; }
.ft-neon.lit .ft-line span { color:#ffd48a;
  text-shadow:0 0 10px rgba(255,179,33,.85), 0 0 36px rgba(255,140,33,.55), 0 0 90px rgba(255,77,28,.35);
  animation:ft-strike .9s steps(1,end) calc(var(--d) * 75ms) backwards; }
.ft-neon.lit .ft-line span.bad { animation:ft-strike .9s steps(1,end) calc(var(--d) * 75ms) backwards,
  ft-flicker 6s steps(1,end) 3s infinite; }
.ft-neon .ft-line span:hover { color:#fff4dc; }
@keyframes ft-strike {
  0%  { color:rgba(255,179,33,.08); text-shadow:none; }
  25% { color:#ffd48a; text-shadow:0 0 14px rgba(255,179,33,.9); }
  40% { color:rgba(255,179,33,.08); text-shadow:none; }
  60% { color:#ffd48a; text-shadow:0 0 14px rgba(255,179,33,.9); }
}
@keyframes ft-flicker { 0%,86%,100% { opacity:1; } 88% { opacity:.2; } 90% { opacity:1; } 93% { opacity:.35; } 95% { opacity:1; } }

/* base */
.ft-base { position:relative; display:flex; justify-content:space-between; align-items:center; gap:18px; flex-wrap:wrap;
  padding-top:22px; border-top:1px solid var(--hair);
  font-family:var(--nm-mono); font-size:.7rem; letter-spacing:.05em; color:var(--ash); }
.ft-thanks { display:inline-flex; align-items:center; gap:8px; }
.ft-thanks .nm-thai { font-size:1.2rem; color:var(--amber); }
.ft-top { position:relative; width:86px; height:86px; display:grid; place-items:center; }
.ft-ring { position:absolute; inset:0; width:100%; height:100%; animation:orbit 16s linear infinite; }
.ft-ring text { font-family:var(--nm-mono); font-size:9.4px; letter-spacing:2.2px; fill:var(--ash); }
.ft-arrow { display:grid; place-items:center; width:36px; height:36px; border-radius:50%;
  background:var(--amber); color:var(--void); transition:transform .5s var(--ease), box-shadow .5s; }
.ft-arrow svg { width:16px; height:16px; }
.ft-top:hover .ft-arrow { transform:translateY(-4px); box-shadow:0 10px 30px rgba(255,179,33,.45); }
.ft-top:focus-visible { outline:2px solid var(--amber); outline-offset:2px; border-radius:50%; }

/* ════ responsive ════ */
@media (max-width:1024px){
  .ft-grid { grid-template-columns:1fr 1fr; gap:36px; }
}
@media (max-width:640px){
  .ft-grid { grid-template-columns:1fr; gap:30px; margin-top:44px; }
  .ft-neon { flex-direction:column; gap:.06em; font-size:calc((100vw - 32px) / 3.1); }
  .ft-line { justify-content:space-between; }
  .ft-base { justify-content:center; text-align:center; }
}

/* ════ reduced motion ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .ft-ring { animation:none !important; }
}
`;
