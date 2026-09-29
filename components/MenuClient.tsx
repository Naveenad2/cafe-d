"use client";

/* ════════════════════════════════════════════════════════════════
   MENU (client) — the at-the-table experience.

   Built for phones: fast, readable, no heavy imagery. Features
   · sticky category pills that scroll-spy and let you jump
   · instant search across dish names + descriptions
   · veg / non-veg dietary filter
   · a creative hand-drawn "Thai batik / patent-plate" SVG backdrop
     (pure vector, weightless, AI-illustrated motif) behind the head
   · price variants rendered as compact chips with a key legend
   All data lives in lib/menu.ts so it only loads on this route.
   ════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MENU, VARIANT_LABELS, type Dish } from "@/lib/menu";
import { SITE } from "@/lib/data";

type Filter = "all" | "veg" | "non";

function Price({ d }: { d: Dish }) {
  if (d.variants) {
    return (
      <span className="mn-vars">
        {d.variants.map((v) => (
          <span className="mn-var" key={v.k}>
            <em>{v.k}</em>₹{v.p}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="mn-price">
      ₹{d.price}
      {d.unit && <small> {d.unit}</small>}
    </span>
  );
}

export default function MenuClient() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [activeCat, setActiveCat] = useState(MENU[0].id);
  const navRef = useRef<HTMLDivElement>(null);

  /* filtered + searched sections */
  const sections = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return MENU.map((s) => ({
      ...s,
      items: s.items.filter((d) => {
        if (filter === "veg" && d.tag !== "veg") return false;
        if (filter === "non" && d.tag !== "non") return false;
        if (!needle) return true;
        return (
          d.name.toLowerCase().includes(needle) ||
          (d.desc?.toLowerCase().includes(needle) ?? false)
        );
      }),
    })).filter((s) => s.items.length > 0);
  }, [q, filter]);

  /* scroll-spy: highlight the category in view */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActiveCat(e.target.id)),
      { rootMargin: "-30% 0px -65% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  /* keep the active pill centred in the strip at any viewport width */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.querySelector<HTMLElement>(`[data-cat="${activeCat}"]`);
    if (!pill) return;
    const left = pill.offsetLeft - (nav.clientWidth - pill.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(left, 0), behavior: "smooth" });
  }, [activeCat]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 132;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const totalCount = useMemo(
    () => sections.reduce((n, s) => n + s.items.length, 0),
    [sections]
  );

  /* Tab labels: shorten "Appetizers · Veg" to "Appetizers" — but only when
     that leaves it unambiguous. "Appetizers · Veg" and "· Non-Veg" both
     shorten to the same word, so those keep their qualifier. */
  const tabLabels = useMemo(() => {
    const base = (t: string) => t.split(" · ")[0];
    const seen = new Map<string, number>();
    sections.forEach((s) => seen.set(base(s.title), (seen.get(base(s.title)) ?? 0) + 1));
    return new Map(
      sections.map((s) => [
        s.id,
        (seen.get(base(s.title)) ?? 0) > 1 ? s.title : base(s.title),
      ])
    );
  }, [sections]);

  return (
    <main className="mn nm">
      <style>{css}</style>

      {/* ── hero head with batik backdrop ── */}
      <header className="mn-hero">
        <BatikBackdrop />
        <div className="mn-hero-in">
          <Link href="/" className="mn-back" aria-label="Back to home">← Café de Bangkok</Link>
          <p className="mn-eyebrow">Kadavanthra · Kochi</p>
          <h1 className="mn-h1">The <span>Menu</span></h1>
          <p className="mn-sub">
            Thai · Chinese · Japanese — pounded, wok-fired and folded to order.
            Tap a craving, search a dish, or filter to your taste.
          </p>
          <p className="mn-meta">
            <span>★ {SITE.rating}</span><i />{SITE.reviewCount} reviews<i />Open 11:30 AM – 11 PM
          </p>
          <p className="mn-cert">{SITE.certification}</p>
        </div>
      </header>

      {/* ── sticky controls ── */}
      <div className="mn-controls">
        <div className="mn-row">
        <div className="mn-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes…"
            aria-label="Search the menu"
            inputMode="search"
          />
          {q && <button className="mn-clear" onClick={() => setQ("")} aria-label="Clear search">×</button>}
        </div>

        <div className="mn-filters" role="group" aria-label="Dietary filter">
          {([["all", "All"], ["veg", "Veg"], ["non", "Non-veg"]] as const).map(([k, label]) => (
            <button
              key={k}
              className={`mn-filter ${filter === k ? "on" : ""} f-${k}`}
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
            >
              {k !== "all" && <i className={`mn-dot ${k}`} aria-hidden />}
              {label}
            </button>
          ))}
        </div>
        </div>

        {/* category strip — scroll-spied tabs */}
        <div className="mn-cats-wrap">
          <div className="mn-cats" ref={navRef} role="tablist" aria-label="Menu categories">
            {sections.map((s) => (
              <button
                key={s.id}
                data-cat={s.id}
                role="tab"
                aria-selected={activeCat === s.id}
                aria-controls={s.id}
                className={`mn-cat ${activeCat === s.id ? "on" : ""}`}
                onClick={() => jump(s.id)}
              >
                {tabLabels.get(s.id) ?? s.title}
                <em>{s.items.length}</em>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── sections ── */}
      <div className="mn-body">
        {totalCount === 0 && (
          <p className="mn-empty">No dishes match “{q}”. Try another word.</p>
        )}

        {sections.map((s, si) => (
          <section className="mn-sec" id={s.id} key={s.id} aria-label={s.title}>
            <div className="mn-sec-head">
              <h2><span className="mn-sec-no" aria-hidden>{String(si + 1).padStart(2, "0")}</span>{s.title}</h2>
              {s.blurb && <p>{s.blurb}</p>}
              <i className="mn-sec-rule" aria-hidden />
            </div>

            <ul className="mn-list">
              {s.items.map((d) => (
                <li className="mn-item" key={d.name}>
                  <span className={`mn-diet ${d.tag}`} aria-label={d.tag === "veg" ? "Vegetarian" : "Non-vegetarian"} />
                  <div className="mn-item-main">
                    <div className="mn-item-top">
                      <h3>
                        {d.name}
                        {d.chef && <span className="mn-badge chef">Chef’s</span>}
                        {d.hot && <span className="mn-badge hot" aria-label="Spicy">🌶</span>}
                      </h3>
                      <i className="mn-leader" aria-hidden />
                      <Price d={d} />
                    </div>
                    {d.desc && <p>{d.desc}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* legend */}
        <div className="mn-legend">
          <span><i className="mn-dot veg" /> Veg</span>
          <span><i className="mn-dot non" /> Non-veg</span>
          {Object.entries(VARIANT_LABELS).map(([k, v]) => (
            <span key={k}><em className="mn-legkey">{k}</em> {v}</span>
          ))}
        </div>

        <footer className="mn-foot">
          <p className="mn-foot-th nm-thai" lang="th">ขอบคุณ</p>
          <p>Prices in ₹ and inclusive of taxes where applicable. Ask our team about allergens.</p>
          <a className="mn-foot-cta" href={SITE.phoneHref}>Call to reserve · {SITE.phone}</a>
          <Link href="/" className="mn-foot-home">← Back to home</Link>
        </footer>
      </div>
    </main>
  );
}

/* ── creative hand-drawn Thai batik / patent-plate motif (pure SVG) ── */
function BatikBackdrop() {
  return (
    <svg className="mn-batik" viewBox="0 0 400 400" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="mnG" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,179,33,.22)" />
          <stop offset="100%" stopColor="rgba(255,179,33,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#mnG)" />
      <g fill="none" stroke="rgba(255,179,33,.5)" strokeWidth="1">
        {/* concentric patent-style plate */}
        <circle cx="200" cy="170" r="120" strokeDasharray="2 6" />
        <circle cx="200" cy="170" r="92" />
        <circle cx="200" cy="170" r="64" strokeDasharray="1 5" />
        {/* radiating petals — batik lotus */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const x1 = 200 + Math.cos(a) * 64;
          const y1 = 170 + Math.sin(a) * 64;
          const x2 = 200 + Math.cos(a) * 118;
          const y2 = 170 + Math.sin(a) * 118;
          const cx = 200 + Math.cos(a + 0.2) * 92;
          const cy = 170 + Math.sin(a + 0.2) * 92;
          /* rounded: server and browser trig can differ in the last digit,
             which would otherwise trip a hydration mismatch */
          const f = (n: number) => n.toFixed(2);
          return <path key={i} d={`M${f(x1)} ${f(y1)} Q ${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`} />;
        })}
        {/* inner bloom */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x = 200 + Math.cos(a) * 32;
          const y = 170 + Math.sin(a) * 32;
          return <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="10" />;
        })}
        <circle cx="200" cy="170" r="6" fill="rgba(255,179,33,.5)" stroke="none" />
      </g>
    </svg>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.mn { min-height:100vh; background:var(--void); color:var(--bone); }

/* ── hero ── */
.mn-hero { position:relative; overflow:hidden; border-bottom:1px solid var(--hair);
  background:radial-gradient(120% 80% at 50% 0%, #120b07, var(--void) 70%); }
.mn-batik { position:absolute; left:50%; top:-8%; width:min(560px,120vw); height:auto;
  transform:translateX(-50%); opacity:.6; pointer-events:none;
  animation:mn-spin 90s linear infinite; }
@keyframes mn-spin { to { transform:translateX(-50%) rotate(360deg); } }
.mn-hero-in { position:relative; z-index:1; max-width:760px; margin:0 auto;
  padding:clamp(28px,6vw,64px) clamp(20px,5vw,32px) clamp(32px,6vw,56px); text-align:center; }
.mn-back { display:inline-block; font-family:var(--nm-mono); font-size:.68rem; letter-spacing:.2em;
  text-transform:uppercase; color:var(--amber); margin-bottom:24px; }
.mn-eyebrow { font-family:var(--nm-mono); font-size:.66rem; letter-spacing:.3em;
  text-transform:uppercase; color:var(--ash); }
.mn-h1 { font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(3.6rem,14vw,7.6rem); line-height:.84; margin:14px 0 18px; }
.mn-h1 span { font-family:var(--nm-serif); font-style:italic; font-weight:500; font-stretch:normal;
  text-transform:none; letter-spacing:-.03em; color:var(--amber); text-shadow:0 0 44px rgba(255,179,33,.35); }
.mn-sub { color:var(--ash); font-size:clamp(.92rem,2.4vw,1.04rem); line-height:1.6;
  max-width:48ch; margin:0 auto; }
.mn-meta { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:10px;
  margin-top:20px; font-size:.8rem; color:var(--ash); }
.mn-meta span { color:var(--amber); font-weight:600; }
.mn-meta i { width:4px; height:4px; border-radius:50%; background:var(--hair-2); }
.mn-cert { display:inline-block; margin-top:16px; padding:6px 10px 5px; border-radius:4px;
  background:var(--amber); box-shadow:0 0 22px rgba(255,179,33,.3);
  font-family:var(--nm-mono); font-size:.62rem; font-weight:500; letter-spacing:.14em; text-transform:uppercase;
  color:var(--void); }

/* ── sticky controls ── */
.mn-controls { position:sticky; top:0; z-index:50;
  background:rgba(6,5,5,.86); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
  border-bottom:1px solid var(--hair); padding:12px 0 0; }
.mn-search { display:flex; align-items:center; gap:10px; width:min(680px,92%); margin:0 auto 10px;
  background:var(--coal); border:1px solid var(--hair); border-radius:100px; padding:11px 16px; }
.mn-search svg { width:18px; height:18px; color:var(--ash); flex:none; }
.mn-search input { flex:1; background:none; border:none; outline:none; color:var(--bone);
  font-family:var(--nm-disp); font-size:.95rem; }
.mn-search input::placeholder { color:var(--ash); }
.mn-clear { color:var(--ash); font-size:1.4rem; line-height:1; padding:0 4px; }

.mn-filters { display:flex; justify-content:center; gap:8px; width:min(680px,92%); margin:0 auto 10px; }
.mn-filter { display:flex; align-items:center; gap:7px; font-family:var(--nm-mono);
  font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; color:var(--ash);
  border:1px solid var(--hair); border-radius:100px; padding:9px 16px; transition:.3s; }
.mn-filter.on { color:var(--void); background:var(--bone); border-color:var(--bone); }
.mn-filter.f-veg.on { background:var(--veg); border-color:var(--veg); color:#04140d; }
.mn-filter.f-non.on { background:var(--non); border-color:var(--non); color:#1a0600; }
.mn-dot { width:9px; height:9px; border-radius:3px; border:1.5px solid currentColor; position:relative; }
.mn-dot.veg { color:var(--veg); }
.mn-dot.non { color:var(--non); }

.mn-cats-wrap { position:relative; width:min(980px,100%); margin:0 auto; }
/* fade the strip's edges so a mid-scroll tab never looks cut off */
.mn-cats-wrap::before, .mn-cats-wrap::after {
  content:""; position:absolute; top:0; bottom:10px; width:34px; z-index:2; pointer-events:none; }
.mn-cats-wrap::before { left:0;  background:linear-gradient(90deg,var(--void),transparent); }
.mn-cats-wrap::after  { right:0; background:linear-gradient(270deg,var(--void),transparent); }

.mn-cats { display:flex; gap:8px; overflow-x:auto; padding:2px max(4vw,20px) 12px;
  scrollbar-width:none; scroll-behavior:smooth; overscroll-behavior-x:contain; }
.mn-cats::-webkit-scrollbar { display:none; }
.mn-cat {
  flex:none; display:inline-flex; align-items:center; gap:7px;
  font-family:var(--nm-mono); font-size:.7rem; letter-spacing:.04em;
  white-space:nowrap; color:var(--ash); padding:9px 15px; border-radius:100px;
  border:1px solid var(--hair); background:rgba(245,239,230,.02);
  transition:color .3s var(--ease), border-color .3s, background .3s, transform .3s var(--ease); }
.mn-cat em {
  font-style:normal; font-size:.58rem; letter-spacing:0; color:var(--ash);
  background:rgba(245,239,230,.07); border-radius:100px; padding:1px 6px; transition:.3s; }
.mn-cat:hover { color:var(--bone); border-color:var(--hair-2); }
.mn-cat.on {
  color:var(--void); background:var(--amber); border-color:var(--amber);
  box-shadow:0 6px 20px rgba(255,179,33,.28); }
.mn-cat.on em { color:var(--void); background:rgba(6,5,5,.16); }
.mn-cat:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }

/* ── body / sections ── */
.mn-body { max-width:760px; margin:0 auto; padding:clamp(24px,5vw,44px) clamp(20px,5vw,32px) 60px; }
.mn-empty { text-align:center; color:var(--ash); padding:60px 0; font-style:italic; font-family:var(--nm-serif); font-size:1.1rem; }

.mn-sec { margin-bottom:clamp(40px,6vw,64px); scroll-margin-top:140px; }
.mn-sec-head { margin-bottom:22px; }
.mn-sec-head h2 { display:flex; align-items:center; gap:14px; font-family:var(--nm-disp); font-weight:800;
  font-stretch:75%; text-transform:uppercase; font-size:clamp(1.9rem,5.4vw,2.9rem); color:var(--bone); line-height:.95; }
.mn-sec-no { flex:none; font-family:var(--nm-mono); font-weight:500; font-stretch:normal; font-size:.72rem;
  letter-spacing:.04em; color:var(--void); background:var(--amber); padding:5px 8px 4px; border-radius:4px;
  box-shadow:0 0 18px rgba(255,179,33,.28); }
.mn-sec-head p { color:var(--ash); font-family:var(--nm-serif); font-style:italic;
  font-size:1.02rem; margin-top:8px; }
.mn-sec-rule { display:block; height:1px; margin-top:16px;
  background:linear-gradient(90deg,var(--amber),transparent); }

.mn-list { list-style:none; padding:0; display:flex; flex-direction:column; gap:4px; }
.mn-item { display:flex; gap:13px; padding:15px 0; border-bottom:1px solid var(--hair); }
.mn-diet { flex:none; width:15px; height:15px; margin-top:5px; border-radius:4px; position:relative; }
.mn-diet.veg { border:1.5px solid var(--veg); }
.mn-diet.non { border:1.5px solid var(--non); }
.mn-diet::after { content:""; position:absolute; inset:0; margin:auto;
  width:7px; height:7px; border-radius:50%; }
.mn-diet.veg::after { background:var(--veg); }
.mn-diet.non::after { background:var(--non); }

.mn-item-main { flex:1; min-width:0; }
.mn-item-top { display:flex; align-items:baseline; gap:10px; justify-content:space-between; }
.mn-leader { flex:1; min-width:14px; align-self:baseline; border-bottom:1px dotted rgba(245,239,230,.22);
  transform:translateY(-4px); }
.mn-item-top h3 { font-family:var(--nm-disp); font-weight:600; font-size:1.06rem; line-height:1.3;
  color:var(--bone); display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.mn-badge { font-family:var(--nm-mono); font-size:.58rem; letter-spacing:.08em; text-transform:uppercase;
  padding:3px 7px; border-radius:6px; }
.mn-badge.chef { color:var(--amber); border:1px solid var(--hair-2); }
.mn-badge.hot { font-size:.8rem; padding:0; }
.mn-item-main p { color:var(--ash); font-size:.86rem; line-height:1.5; margin-top:5px; max-width:52ch; }

.mn-price { font-family:var(--nm-disp); font-weight:700; font-stretch:80%; font-size:1.2rem; color:var(--amber);
  white-space:nowrap; flex:none; }
.mn-price small { font-size:.62rem; color:var(--ash); letter-spacing:.04em; }
.mn-vars { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; flex:none; max-width:54%; }
.mn-var { font-family:var(--nm-mono); font-size:.72rem; color:var(--bone);
  background:var(--coal); border:1px solid var(--hair); border-radius:8px; padding:3px 8px;
  white-space:nowrap; }
.mn-var em { font-style:normal; color:var(--amber); font-size:.62rem; margin-right:4px; }

/* legend + footer */
.mn-legend { display:flex; flex-wrap:wrap; gap:14px 18px; margin-top:30px; padding-top:24px;
  border-top:1px solid var(--hair); font-size:.74rem; color:var(--ash); }
.mn-legend span { display:flex; align-items:center; gap:7px; }
.mn-legkey { font-style:normal; font-family:var(--nm-mono); color:var(--amber); font-size:.7rem; }

.mn-foot { text-align:center; margin-top:50px; padding-top:36px; border-top:1px solid var(--hair); }
.mn-foot-th { font-size:2.4rem; line-height:1.4; color:var(--amber); text-shadow:0 0 26px rgba(255,179,33,.4); }
.mn-foot p { color:var(--ash); font-size:.85rem; max-width:48ch; margin:10px auto 0; line-height:1.6; }
.mn-foot-cta { display:inline-block; margin-top:22px; font-family:var(--nm-mono); font-size:.74rem;
  font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--void); background:var(--amber);
  padding:14px 28px; border-radius:100px; }
.mn-foot-home { display:block; margin-top:20px; color:var(--ash); font-size:.78rem; }

/* desktop: two-column dish lists for density, single-line controls */
@media (min-width:880px){
  .mn-body { max-width:980px; }
  .mn-list { display:grid; grid-template-columns:1fr 1fr; gap:0 48px; }
  .mn-item { border-bottom:1px solid var(--hair); }
  .mn-controls { padding-top:16px; }
  .mn-row {
    display:flex; align-items:center; justify-content:center; gap:12px;
    width:min(980px,92%); margin:0 auto 12px; }
  .mn-row .mn-search { width:auto; flex:1; max-width:520px; margin:0; }
  .mn-row .mn-filters { width:auto; margin:0; flex:none; }
}

@media (max-width:640px){
  .mn-hero-in { padding-bottom:26px; }
  .mn-sec { scroll-margin-top:180px; }
  .mn-filters { flex-wrap:wrap; }
  .mn-filter { padding:8px 14px; }
}

@media (max-width:420px){
  .mn-item-top { flex-direction:column; gap:4px; }
  .mn-leader { display:none; }
  .mn-vars { justify-content:flex-start; max-width:100%; }
  .mn-cat { font-size:.66rem; padding:8px 12px; }
  .mn-legend { gap:10px 14px; font-size:.7rem; }
}

/* reduced motion */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .mn-batik { animation:none; }
}
`;