"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

/* ── Cursor: instant dot + lagging ring with contextual label ── */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [big, setBig] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const target = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let raf = 0;

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current)
        dot.current.style.transform = `translate(${target.x}px,${target.y}px)`;
    };
    const loop = () => {
      lag.x += (target.x - lag.x) * 0.13;
      lag.y += (target.y - lag.y) * 0.13;
      if (ring.current)
        ring.current.style.transform = `translate(${lag.x}px,${lag.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    const onGrow = (e: Event) => {
      setBig(true);
      setLabel((e as CustomEvent).detail || "");
    };
    const onShrink = () => setBig(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("cursor:grow", onGrow);
    window.addEventListener("cursor:shrink", onShrink);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("cursor:grow", onGrow);
      window.removeEventListener("cursor:shrink", onShrink);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cur-dot" />
      <div ref={ring} className={`cur-ring ${big ? "big" : ""}`}>
        <span className="lbl">{label}</span>
      </div>
    </>
  );
}

/* ── Preloader: multilingual greeting cycle + 0–100 count,
      then six vertical slats lift in stagger ─────────────────── */
const GREETS = [
  { t: "ยินดีต้อนรับ", l: "Thai" },
  { t: "welcome", l: "English" },
  { t: "欢迎", l: "Chinese" },
  { t: "ようこそ", l: "Japanese" },
  { t: "സ്വാഗതം", l: "Malayalam" },
];

const SLATS = 6;

export function Loader() {
  const [pct, setPct] = useState(0);
  const [gi, setGi] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const skip = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(skip);
    }
    document.documentElement.classList.add("is-loading");

    const t0 = performance.now();
    const dur = 1500;
    const OUTRO = 950;
    let raf = 0;
    let finished = false;
    let outro: ReturnType<typeof setTimeout> | undefined;

    /* The splash locks page scroll, so it must never be able to hang.
       finish() is idempotent and is reached either by the animation or
       by the failsafe below, whichever lands first. */
    const finish = () => {
      if (finished) return;
      finished = true;
      setPct(100);
      setDone(true);
      outro = setTimeout(() => setGone(true), OUTRO);
    };

    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    const g = setInterval(() => setGi((i) => (i + 1) % GREETS.length), 380);
    /* failsafe: rAF can be throttled or paused (background tab, low-power
       mode), which would otherwise strand the visitor behind the curtain */
    const guard = setTimeout(finish, dur + 900);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(g);
      clearTimeout(guard);
      if (outro) clearTimeout(outro);
    };
  }, []);

  useEffect(() => {
    if (gone) document.documentElement.classList.remove("is-loading");
  }, [gone]);

  if (gone) return null;
  const greet = GREETS[gi];

  return (
    <div className={`ld ${done ? "done" : ""}`} role="status" aria-label="Loading Café de Bangkok">
      {/* slats lift away in stagger when the count completes */}
      <div className="ld-slats" aria-hidden>
        {Array.from({ length: SLATS }).map((_, i) => (
          <i key={i} style={{ transitionDelay: `${i * 55}ms` }} />
        ))}
      </div>

      <div className="ld-stage" aria-hidden>
        <div className="ld-logo-wrap">
          <span className="ld-ring r1" />
          <span className="ld-ring r2" />
          <span className="ld-halo" />
          {/* dim silhouette underneath */}
          <img className="ld-logo dim" src="/logo.png" alt="" draggable={false} />
          {/* lit copy fills bottom-to-top in sync with the count */}
          <img
            className="ld-logo lit"
            src="/logo.png"
            alt=""
            draggable={false}
            style={{ clipPath: `inset(${100 - pct}% 0 0 0)` }}
          />
          <span className="ld-sweep" style={{ top: `${100 - pct}%` }} />
        </div>

        <div className="ld-greet-slot">
          <span className="ld-greet" key={gi}>{greet.t}</span>
        </div>

        <div className="ld-meta">
          <span className="ld-name">Café de Bangkok</span>
          <i className="ld-sep" />
          <span className="ld-city">Kadavanthra · Kochi</span>
        </div>

        <div className="ld-bar">
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </div>

        <span className="ld-pct">
          {String(pct).padStart(3, "0")}<em>%</em>
        </span>
      </div>
    </div>
  );
}


/* ── Top progress hairline ─────────────────────────────────────── */
export function Progress() {
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="progress" aria-hidden>
      <i ref={bar as React.RefObject<HTMLElement & HTMLDivElement>} />
    </div>
  );
}

/* ── Right-edge section rail with scroll-spy ─────────────────────
   Only renders a dot for a section that is actually in the DOM, so
   the rail can never offer a jump that goes nowhere. ───────────── */
const RAIL_STOPS: readonly (readonly [string, string])[] = [
  ["Home", "home"],
  ...NAV_LINKS,
];

export function Rail() {
  const [active, setActive] = useState("home");
  const [stops, setStops] = useState<readonly (readonly [string, string])[]>([]);

  useEffect(() => {
    const live = RAIL_STOPS.filter(([, id]) => document.getElementById(id));
    const raf = requestAnimationFrame(() => setStops(live));

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    live.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  if (!stops.length) return null;

  return (
    <nav className="rail" aria-label="Section navigation">
      {stops.map(([label, id]) => (
        <button
          key={id}
          className={active === id ? "on" : ""}
          aria-label={`Go to ${label}`}
          aria-current={active === id ? "true" : undefined}
          onClick={() =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="tip">{label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── Shared arrow icon ─────────────────────────────────────────── */
export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}