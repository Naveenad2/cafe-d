"use client";

/* ════════════════════════════════════════════════════════════════
   VISIT → "The table is kept" — a boarding pass, BKK → COK
   A paper pass with an amber tear-off stub; every field comes from
   SITE. The live pill reads Kochi time (Asia/Kolkata) on the client
   after mount, so the server HTML never mismatches on hydration.
   ════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { IMAGES, SITE } from "@/lib/data";
import { Label, RollLink } from "@/components/Kit";

const OPENS = 11 * 60 + 30; // 11:30
const CLOSES = 23 * 60;     // 23:00

type Status = { open: boolean; text: string };

function kochiStatus(): Status {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const now = get("hour") * 60 + get("minute");
  if (now >= OPENS && now < CLOSES)
    return { open: true, text: CLOSES - now <= 60 ? "Open now · closing at 11 PM" : "Open now · until 11 PM" };
  return { open: false, text: "Closed now · opens 11:30 AM" };
}

function useKochiStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    const tick = () => setStatus(kochiStatus());
    const raf = requestAnimationFrame(tick);
    const t = setInterval(tick, 60_000);
    return () => { cancelAnimationFrame(raf); clearInterval(t); };
  }, []);
  return status;
}

/* a deterministic barcode, drawn from the reservation number */
const BARCODE = (() => {
  const widths = SITE.phone.replace(/\D/g, "").split("")
    .flatMap((d) => [(+d % 3) + 1, 1, ((+d * 7) % 4) + 1, 2]);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  widths.forEach((w, i) => { if (i % 2 === 0) bars.push({ x, w }); x += w; });
  return { bars, width: x };
})();

function Barcode() {
  return (
    <svg className="vs-barcode" viewBox={`0 0 ${BARCODE.width} 40`} preserveAspectRatio="none" aria-hidden>
      {BARCODE.bars.map((b) => <rect key={b.x} x={b.x} y={0} width={b.w} height={40} />)}
    </svg>
  );
}

export default function Visit() {
  const status = useKochiStatus();

  return (
    <section id="visit" className="vs nm" aria-labelledby="vs-title">
      <style>{css}</style>

      <div className="shell">
        <header className="vs-head">
          <div>
            <Label no="07" className="reveal">Find Us</Label>
            <h2 className="nm-h2 reveal d1" id="vs-title">
              The table is <em>kept</em>
            </h2>
          </div>
          <p className="vs-live reveal d2" data-open={status ? status.open : undefined} aria-live="polite">
            <i aria-hidden />
            {status ? status.text : "Open daily · 11:30 — 23:00"}
          </p>
        </header>

        <div className="vs-grid">
          <article className="vs-pass reveal" aria-label="Visit details">
            <div className="vs-main">
              <div className="vs-bar">
                <span className="vs-brand">{SITE.name}</span>
                <span>Boarding pass · Dinner</span>
              </div>

              <div className="vs-route">
                <div className="vs-city">
                  <small>From</small>
                  <b>BKK</b>
                  <span>Bangkok</span>
                </div>
                <div className="vs-path" aria-hidden>
                  <i />
                  <svg viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                  <i />
                </div>
                <div className="vs-city to">
                  <small>To</small>
                  <b>COK</b>
                  <span>{SITE.city}</span>
                </div>
              </div>

              <dl className="vs-fields">
                <div className="wide"><dt>Gate</dt><dd>{SITE.address}</dd></div>
                <div><dt>Boarding</dt><dd>11:30</dd></div>
                <div><dt>Last call</dt><dd>23:00</dd></div>
                <div><dt>Flies</dt><dd>Every day</dd></div>
                <div><dt>Class</dt><dd>Thai SELECT</dd></div>
                <div><dt>Seat</dt><dd>By the mural</dd></div>
                <div><dt>Fare</dt><dd>{SITE.costForTwo}</dd></div>
                <div className="wide"><dt>On board</dt><dd>{SITE.cuisines}</dd></div>
              </dl>

              <div className="vs-acts">
                <RollLink href={SITE.phoneHref} label="Call to reserve" cursor="call" />
                <RollLink href={SITE.mapsHref} label="Get directions" ghost external cursor="map" />
              </div>
            </div>

            <div className="vs-stub">
              <span className="vs-notch t" aria-hidden />
              <span className="vs-notch b" aria-hidden />
              <div><small>Passenger</small><b>You + company</b></div>
              <div><small>Reserve</small><a href={SITE.phoneHref}>{SITE.phone}</a></div>
              <div><small>Rated</small><b>{SITE.rating} ★ · {SITE.reviewCount}</b></div>
              <div><small>Walk-ins</small><b>Welcome · veg friendly</b></div>
              <div className="vs-code">
                <Barcode />
                <span>CDB · KOCHI 682020</span>
              </div>
            </div>
          </article>

          <figure className="vs-fig reveal d2">
            <img
              src={IMAGES.visit}
              alt="Warmly lit dining tables at Café de Bangkok on MP Pylee Road, Kadavanthra, Kochi"
              loading="lazy"
              draggable={false}
            />
            <span className="vs-pulse" aria-hidden />
            <figcaption>
              <b>Kadavanthra · Kochi</b>
              <small>54/1285, MP Pylee Road — near the Shiva temple</small>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.vs { position:relative; padding:clamp(40px,6vw,90px) 0 clamp(90px,11vw,160px); }

/* head + live pill */
.vs-head { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap;
  margin-bottom:clamp(34px,4vw,56px); }
.vs-head .nm-h2 { margin-top:22px; }
.vs-live { display:inline-flex; align-items:center; gap:10px; padding:11px 18px; border-radius:100px;
  border:1px solid var(--hair); background:rgba(245,239,230,.03);
  font-family:var(--nm-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--bone); }
.vs-live i { width:8px; height:8px; border-radius:50%; background:var(--amber); }
.vs-live[data-open="true"] i { background:var(--veg); animation:vs-ping 2s ease-out infinite; }
.vs-live[data-open="false"] i { background:var(--ember); }
@keyframes vs-ping { 0% { box-shadow:0 0 0 0 rgba(87,184,147,.6); } 80%,100% { box-shadow:0 0 0 10px rgba(87,184,147,0); } }

.vs-grid { display:grid; grid-template-columns:1.5fr 1fr; gap:18px; align-items:stretch; }

/* ════ the pass ════ */
.vs-pass { position:relative; display:grid; grid-template-columns:1fr 232px; border-radius:24px; overflow:hidden;
  background:var(--paper); color:var(--ink); box-shadow:0 44px 110px rgba(0,0,0,.55); }
.vs-main { min-width:0; display:flex; flex-direction:column; gap:22px; padding:clamp(22px,2.8vw,38px); }
.vs-bar { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; padding-bottom:14px;
  border-bottom:1px solid rgba(22,16,11,.14);
  font-family:var(--nm-mono); font-size:.64rem; letter-spacing:.16em; text-transform:uppercase; color:rgba(22,16,11,.6); }
.vs-brand { font-weight:500; color:var(--ink); }

.vs-route { display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:clamp(12px,2vw,24px); }
.vs-city small, .vs-fields dt, .vs-stub small { display:block; font-family:var(--nm-mono); font-size:.6rem;
  letter-spacing:.16em; text-transform:uppercase; color:rgba(22,16,11,.55); }
.vs-city b { display:block; font-family:var(--nm-disp); font-weight:800; font-stretch:75%;
  font-size:clamp(3.4rem,6.4vw,5.6rem); line-height:.84; letter-spacing:-.01em; color:var(--ink); }
.vs-city span { font-family:var(--nm-serif); font-style:italic; font-size:1.08rem; color:#c2410c; }
.vs-city.to { text-align:right; }
.vs-path { display:flex; align-items:center; gap:10px; color:#c2410c; }
.vs-path i { flex:1; border-top:2px dashed rgba(22,16,11,.28); }
.vs-path svg { width:30px; height:30px; fill:currentColor; transform:rotate(90deg); }

.vs-fields { display:grid; grid-template-columns:repeat(3,1fr); gap:14px 18px; padding:18px 0;
  border-block:1px dashed rgba(22,16,11,.22); }
.vs-fields .wide { grid-column:1 / -1; }
.vs-fields dd { margin-top:4px; font-weight:600; font-size:.98rem; line-height:1.35; color:var(--ink); }

.vs-acts { display:flex; flex-wrap:wrap; gap:10px; }
.vs-pass .nm-btn.ghost { color:var(--ink); background:transparent; box-shadow:inset 0 0 0 1px rgba(22,16,11,.25); }
.vs-pass .nm-btn.ghost::before { background:rgba(22,16,11,.06); }
.vs-pass .nm-btn.ghost .nm-btn-ico { background:var(--ink); color:var(--amber); }
.vs-pass .nm-btn.ghost:hover { box-shadow:inset 0 0 0 1px rgba(22,16,11,.55); }

/* tear-off stub */
.vs-stub { position:relative; display:flex; flex-direction:column; gap:20px;
  padding:clamp(22px,2.6vw,34px) 24px; background:var(--amber); color:var(--ink);
  border-left:2px dashed rgba(22,16,11,.35); }
.vs-notch { position:absolute; left:-15px; width:28px; height:28px; border-radius:50%; background:var(--void); }
.vs-notch.t { top:-14px; } .vs-notch.b { bottom:-14px; }
.vs-stub small { color:rgba(22,16,11,.6); }
.vs-stub b, .vs-stub a { display:block; margin-top:3px; font-weight:700; font-size:.95rem; line-height:1.3; }
.vs-stub a { text-decoration:underline; text-underline-offset:3px; text-decoration-thickness:1px; }
.vs-code { display:flex; flex-direction:column; gap:6px; margin-top:auto; }
.vs-barcode { display:block; width:100%; height:56px; fill:var(--ink); }
.vs-code span { font-family:var(--nm-mono); font-size:.58rem; letter-spacing:.22em; }

/* ════ photo ════ */
.vs-fig { position:relative; margin:0; min-height:440px; overflow:hidden; border-radius:24px; border:1px solid var(--hair); }
.vs-fig img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform 1.6s var(--ease); }
.vs-fig:hover img { transform:scale(1.05); }
.vs-fig::after { content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(6,5,5,.85), transparent 55%); }
.vs-pulse { position:absolute; z-index:2; top:34%; left:56%; width:14px; height:14px; border-radius:50%;
  background:var(--ember); box-shadow:0 0 18px var(--ember); }
.vs-pulse::after { content:""; position:absolute; inset:-10px; border-radius:50%; border:1px solid var(--ember);
  animation:breathe 2.2s ease-out infinite; }
.vs-fig figcaption { position:absolute; z-index:2; left:26px; right:26px; bottom:24px; }
.vs-fig b { display:block; font-family:var(--nm-disp); font-weight:800; font-stretch:75%; text-transform:uppercase;
  font-size:clamp(1.8rem,2.6vw,2.4rem); line-height:.95; color:var(--bone); }
.vs-fig small { display:block; margin-top:6px; color:rgba(245,239,230,.75); font-size:.92rem; }

/* ════ responsive ════ */
@media (max-width:1100px){
  .vs-grid { grid-template-columns:1fr; }
  .vs-fig { min-height:clamp(260px,52vw,420px); }
}
@media (max-width:680px){
  .vs-pass { grid-template-columns:1fr; }
  .vs-stub { display:grid; grid-template-columns:1fr 1fr; border-left:0; border-top:2px dashed rgba(22,16,11,.35); }
  .vs-code { grid-column:1 / -1; }
  .vs-notch { top:-15px !important; bottom:auto !important; }
  .vs-notch.t { left:-14px; } .vs-notch.b { left:auto; right:-14px; }
  .vs-fields { grid-template-columns:1fr 1fr; }
  .vs-city b { font-size:3rem; }
}

/* ════ reduced motion ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .vs-live i,
  html:not(.force-motion) .vs-pulse::after { animation:none !important; }
}
`;
