"use client";

/* ════════════════════════════════════════════════════════════════
   NAVBAR — fully self-contained (styles embedded, so it can never
   desync from globals.css). Features:
   · floating glass pill that condenses on scroll
   · centered logo, symmetric links, magnetic Reserve button
   · animated gradient underlines + scroll-spy active state
   · hide-on-scroll-down / reveal-on-scroll-up
   · full-screen mobile menu with iris reveal + staggered links
   ════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/data";
import { grow, shrink } from "@/lib/hooks";

/* Split the shared link list either side of the centred logo, so the
   navbar can never drift out of sync with the sections on the page. */
const ALL = NAV_LINKS;
const HALF = Math.ceil(ALL.length / 2);
const LEFT = ALL.slice(0, HALF);
const RIGHT = ALL.slice(HALF);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  const lastY = useRef(0);
  const reserveRef = useRef<HTMLAnchorElement>(null);

  /* scroll state: condense + hide-on-down/reveal-on-up */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 240 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll-spy */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["home", ...ALL.map(([, id]) => id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* close menu on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* magnetic Reserve button (desktop, fine pointer) */
  useEffect(() => {
    const el = reserveRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const link = (label: string, id: string) => (
    <a
      key={id}
      href={`#${id}`}
      className={`nv-link ${active === id ? "on" : ""}`}
      onClick={go(id)}
      onMouseEnter={grow()}
      onMouseLeave={shrink}
    >
      <span>{label}</span>
    </a>
  );

  return (
    <>
      <style>{css}</style>

      <header className={`nv ${scrolled ? "scrolled" : ""} ${hidden && !open ? "hidden" : ""}`}>
        <div className="nv-pill">
          {/* left links */}
          <nav className="nv-cluster left" aria-label="Primary">
            {LEFT.map(([l, id]) => link(l, id))}
          </nav>

          {/* centered logo */}
          <a
            href="#home"
            className="nv-logo"
            onClick={go("home")}
            onMouseEnter={grow()}
            onMouseLeave={shrink}
            aria-label="Café de Bangkok — home"
          >
            <span className="nv-logo-glow" aria-hidden />
            <img src="/logo.png" alt="Café de Bangkok" className="nv-logo-img" draggable={false} />
          </a>

          {/* right links + reserve */}
          <nav className="nv-cluster right" aria-label="Secondary">
            {RIGHT.map(([l, id]) => link(l, id))}
            <Link
              href="/menu"
              className="nv-menu"
              onMouseEnter={grow()}
              onMouseLeave={shrink}
            >
              <span>Menu</span>
            </Link>
            <a
              ref={reserveRef}
              className="nv-reserve"
              href={SITE.phoneHref}
              onMouseEnter={grow("call")}
              onMouseLeave={shrink}
            >
              <span>Reserve</span>
            </a>
          </nav>

          {/* mobile bar: logo left, burger right */}
          <a href="#home" className="nv-logo-m" onClick={go("home")} aria-label="Café de Bangkok — home">
            <img src="/logo.png" alt="Café de Bangkok" draggable={false} />
          </a>
          <button
            className={`nv-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── mobile full-screen menu ── */}
      <div className={`nv-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="nv-sheet-glow" aria-hidden />
        <div className="nv-sheet-top">
          <img src="/logo.png" alt="Café de Bangkok" className="nv-sheet-logo" draggable={false} />
        </div>

        <nav className="nv-sheet-links" aria-label="Mobile navigation">
          {ALL.map(([l, id], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={go(id)}
              style={{ transitionDelay: open ? `${0.16 + i * 0.06}s` : "0s" }}
            >
              <small>0{i + 1}</small>
              <em>{l}</em>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </nav>

        <div className="nv-sheet-foot">
          <Link className="nv-sheet-menu" href="/menu" onClick={() => setOpen(false)}>
            View Full Menu
          </Link>
          <a className="nv-sheet-cta" href={SITE.phoneHref}>Reserve a Table</a>
          <p className="nv-sheet-phone">{SITE.phone}</p>
          <p className="nv-sheet-meta">Open daily · 11:30 — 23:00 · {SITE.addressShort}</p>
        </div>
      </div>
    </>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.nv {
  position:fixed; top:0; left:0; right:0; z-index:1100;
  display:flex; justify-content:center; padding:18px clamp(14px,3vw,28px);
  transition:transform .6s var(--ease), padding .5s var(--ease);
  animation:nv-drop 1s var(--ease) 2.2s backwards;
}
@keyframes nv-drop { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:none; } }
.nv.scrolled { padding:10px clamp(14px,3vw,28px); }
.nv.hidden { transform:translateY(-130%); }

/* the pill */
.nv-pill {
  position:relative; width:min(1200px,100%);
  display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
  gap:clamp(16px,3vw,48px); padding:10px clamp(16px,2vw,26px);
  border-radius:100px;
  transition:background .5s var(--ease), box-shadow .5s var(--ease),
             border-color .5s, backdrop-filter .5s, padding .5s var(--ease);
}
.nv.scrolled .nv-pill {
  background:rgba(10,8,7,.6);
  border:1px solid rgba(245,239,230,.1);
  box-shadow:0 14px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(245,239,230,.06);
  backdrop-filter:blur(22px) saturate(1.1);
  -webkit-backdrop-filter:blur(22px) saturate(1.1);
}
.nv-pill::before {
  content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
  background:linear-gradient(100deg, transparent 20%, rgba(255,179,33,.4) 50%, transparent 80%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:0; transition:opacity .5s;
}
.nv.scrolled .nv-pill::before { opacity:1; }

/* link clusters */
.nv-cluster { display:flex; align-items:center; gap:clamp(14px,2vw,34px); }
.nv-cluster.left  { justify-content:flex-end; }
.nv-cluster.right { justify-content:flex-start; }

.nv-link {
  position:relative; font-family:var(--head); font-weight:400;
  font-size:.72rem; letter-spacing:.2em; text-transform:uppercase;
  color:var(--ash); padding:6px 2px; white-space:nowrap;
  transition:color .35s var(--ease);
}
.nv-link span { position:relative; display:inline-block; }
.nv-link span::after {
  content:""; position:absolute; left:0; right:0; bottom:-5px; height:1.5px; border-radius:2px;
  background:linear-gradient(90deg,var(--amber),var(--ember));
  transform:scaleX(0); transform-origin:right; transition:transform .5s var(--ease);
}
.nv-link:hover { color:var(--bone); }
.nv-link.on    { color:var(--bone); }
.nv-link:hover span::after, .nv-link.on span::after { transform:scaleX(1); transform-origin:left; }

/* reserve */
.nv-reserve {
  margin-left:8px; padding:11px 24px; border-radius:100px;
  font-family:var(--head); font-size:.66rem; letter-spacing:.16em; text-transform:uppercase;
  color:var(--void); background:var(--amber);
  box-shadow:0 8px 26px rgba(255,179,33,.3);
  transition:transform .35s var(--ease), box-shadow .4s, background .4s;
  will-change:transform;
}
.nv-reserve span { display:block; }
.nv-reserve:hover { box-shadow:0 14px 40px rgba(255,179,33,.5);
  background:linear-gradient(110deg,var(--amber),var(--ember)); }

/* secondary "Menu" pill → /menu route */
.nv-menu {
  margin-left:4px; padding:10px 20px; border-radius:100px;
  font-family:var(--head); font-size:.66rem; letter-spacing:.16em; text-transform:uppercase;
  color:var(--bone); border:1px solid var(--hair-2);
  transition:color .35s, border-color .35s, background .35s, transform .35s var(--ease); }
.nv-menu span { display:block; }
.nv-menu:hover { color:var(--amber); border-color:rgba(255,179,33,.5);
  background:rgba(255,179,33,.06); transform:translateY(-2px); }

.nv-sheet-menu {
  display:inline-block; margin-bottom:14px;
  font-family:var(--head); font-size:.74rem; letter-spacing:.18em; text-transform:uppercase;
  color:var(--bone); border:1px solid var(--hair-2); border-radius:100px; padding:14px 30px; }

/* centered logo */
.nv-logo { position:relative; justify-self:center; display:grid; place-items:center; }
.nv-logo-glow {
  position:absolute; inset:-50% -30%; z-index:-1; border-radius:50%;
  background:radial-gradient(circle, rgba(255,179,33,.3), transparent 66%);
  opacity:.55; transition:opacity .5s, transform .6s var(--ease);
}
.nv-logo:hover .nv-logo-glow { opacity:1; transform:scale(1.1); }
.nv-logo-img {
  height:clamp(54px,6.4vw,72px); width:auto; max-width:38vw; object-fit:contain;
  display:block; user-select:none;
  filter:drop-shadow(0 6px 20px rgba(0,0,0,.5)) drop-shadow(0 2px 10px rgba(255,179,33,.28));
  transition:height .5s var(--ease), transform .6s var(--ease), filter .5s;
}
.nv.scrolled .nv-logo-img { height:clamp(44px,5vw,56px); }
.nv-logo:hover .nv-logo-img {
  transform:scale(1.05) rotate(-2deg);
  filter:drop-shadow(0 8px 26px rgba(0,0,0,.55)) drop-shadow(0 3px 16px rgba(255,179,33,.5));
}

/* mobile-only logo + burger (hidden on desktop) */
.nv-logo-m { display:none; }
.nv-logo-m img { height:46px; width:auto; max-width:54vw; object-fit:contain;
  filter:drop-shadow(0 4px 14px rgba(255,179,33,.25)); }
.nv-burger {
  display:none; position:relative; width:46px; height:46px; border-radius:50%;
  background:rgba(10,8,7,.55); border:1px solid rgba(245,239,230,.12);
  backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
}
.nv-burger span {
  position:absolute; left:13px; right:13px; height:1.6px; border-radius:2px; background:var(--bone);
  transition:transform .5s var(--snap), opacity .3s, background .3s;
}
.nv-burger span:nth-child(1){ top:16px; }
.nv-burger span:nth-child(2){ top:22px; }
.nv-burger span:nth-child(3){ top:28px; }
.nv-burger.open span:nth-child(1){ transform:translateY(6px) rotate(45deg); }
.nv-burger.open span:nth-child(2){ opacity:0; }
.nv-burger.open span:nth-child(3){ transform:translateY(-6px) rotate(-45deg); }

/* ── full-screen mobile menu ── */
.nv-sheet {
  position:fixed; inset:0; z-index:1090; display:flex; flex-direction:column;
  padding:0 8vw; background:#0a0807;
  clip-path:circle(0% at calc(100% - 40px) 40px);
  transition:clip-path .8s var(--snap);
}
.nv-sheet.open { clip-path:circle(150% at calc(100% - 40px) 40px); }
.nv-sheet-glow {
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(70% 45% at 50% 12%, rgba(255,140,33,.14), transparent 70%);
}
.nv-sheet-top { display:flex; justify-content:center; padding:72px 0 8px; }
.nv-sheet-logo {
  height:78px; width:auto; max-width:62vw; object-fit:contain;
  filter:drop-shadow(0 6px 20px rgba(255,179,33,.35));
  opacity:0; transform:translateY(-14px) scale(.96);
}
.nv-sheet.open .nv-sheet-logo { animation:nv-pop .8s var(--ease) .1s forwards; }
@keyframes nv-pop { to { opacity:1; transform:none; } }

.nv-sheet-links { display:flex; flex-direction:column; justify-content:center; flex:1; gap:2px; }
.nv-sheet-links a {
  display:flex; align-items:center; gap:16px;
  padding:14px 4px; border-bottom:1px solid rgba(245,239,230,.08);
  color:var(--bone); opacity:0; transform:translateX(-28px);
  transition:opacity .55s var(--ease), transform .55s var(--ease),
             color .35s, padding-left .4s var(--ease);
}
.nv-sheet.open .nv-sheet-links a { opacity:1; transform:none; }
.nv-sheet-links a:active { color:var(--amber); padding-left:12px; }
.nv-sheet-links small {
  font-family:var(--head); font-size:.72rem; letter-spacing:.2em; color:var(--amber);
  min-width:32px;
}
.nv-sheet-links em {
  flex:1; font-family:var(--head); font-style:normal; font-weight:400;
  font-size:clamp(1.9rem,9vw,2.8rem); line-height:1.1;
}
.nv-sheet-links svg { width:22px; height:22px; color:var(--ash); }

.nv-sheet-foot { padding:24px 0 46px; opacity:0;
  transition:opacity .6s var(--ease) .5s; }
.nv-sheet.open .nv-sheet-foot { opacity:1; }
.nv-sheet-cta {
  display:inline-block; padding:15px 32px; border-radius:100px;
  font-family:var(--head); font-size:.72rem; letter-spacing:.18em; text-transform:uppercase;
  color:var(--void); background:var(--amber);
  box-shadow:0 12px 34px rgba(255,179,33,.35);
}
.nv-sheet-phone { margin-top:16px; color:var(--bone); font-size:1.1rem; }
.nv-sheet-meta  { margin-top:4px; color:var(--ash); font-size:.82rem; }

/* ════ responsive ════ */
@media (max-width:1024px){
  .nv-cluster, .nv-logo { display:none; }
  .nv-pill {
    grid-template-columns:1fr auto; justify-items:start; align-items:center;
    background:rgba(10,8,7,.5); border:1px solid rgba(245,239,230,.1);
    backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    box-shadow:0 12px 40px rgba(0,0,0,.4);
  }
  .nv.scrolled .nv-pill { background:rgba(10,8,7,.7); }
  .nv-logo-m { display:block; justify-self:start; }
  .nv-burger { display:block; justify-self:end; }
}
@media (max-width:560px){
  .nv { padding:12px; }
  .nv-logo-m img { height:40px; }
}

/* ════ reduced motion (respects force-motion) ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .nv { animation:none; }
  html:not(.force-motion) .nv-sheet-logo,
  html:not(.force-motion) .nv-sheet-links a { animation:none !important;
    opacity:1 !important; transform:none !important; }
}
`;