"use client";

/* ════════════════════════════════════════════════════════════════
   FAQ → "Good questions"
   A sticky heading column with an ask-us card beside numbered
   question rows. Answers open on a grid-rows transition (no
   max-height guessing) and are hidden from AT while closed.
   Open state lives on data-open, so the reveal wrapper's "in"
   class is never wiped by a re-render.
   ════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { FAQ, SITE } from "@/lib/data";
import { grow, shrink } from "@/lib/hooks";
import { Label, RollLink } from "@/components/Kit";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="fq nm" aria-labelledby="fq-title">
      <style>{css}</style>

      <div className="shell fq-grid">
        <aside className="fq-side">
          <Label no="06" className="reveal">Before You Come</Label>
          <h2 className="nm-h2 reveal d1" id="fq-title">
            Good <em>questions</em>
          </h2>
          <div className="fq-ask reveal d2">
            <span className="fq-ask-th nm-thai" lang="th" aria-hidden>ถาม</span>
            <p>
              Something we haven&apos;t covered? Call us — we&apos;re open every
              day, 11:30 AM to 11 PM.
            </p>
            <RollLink href={SITE.phoneHref} label="Ask us directly" cursor="call" />
          </div>
        </aside>

        <div className="fq-list">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div className="reveal" key={f.q}>
                <div className="fq-item" data-open={on}>
                  <h3>
                    <button
                      id={`fq-q-${i}`}
                      aria-expanded={on}
                      aria-controls={`fq-a-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      onMouseEnter={grow()}
                      onMouseLeave={shrink}
                    >
                      <span className="fq-no">Q.{String(i + 1).padStart(2, "0")}</span>
                      <span className="fq-q">{f.q}</span>
                      <span className="fq-ico" aria-hidden />
                    </button>
                  </h3>
                  <div className="fq-a" id={`fq-a-${i}`} role="region" aria-labelledby={`fq-q-${i}`}>
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.fq { position:relative; padding:clamp(40px,6vw,90px) 0 clamp(90px,11vw,160px); }
.fq-grid { display:grid; grid-template-columns:.8fr 1.2fr; gap:clamp(40px,7vw,110px); align-items:start; }

/* ════ side ════ */
.fq-side { position:sticky; top:120px; display:flex; flex-direction:column; align-items:flex-start; gap:22px; }
.fq-side .nm-h2 { margin-top:0; }
.fq-ask { position:relative; overflow:hidden; width:100%; max-width:400px; margin-top:14px;
  padding:26px 26px 24px; border-radius:22px; border:1px solid var(--hair-2);
  background:linear-gradient(150deg, rgba(255,179,33,.1), rgba(255,77,28,.02) 70%); }
.fq-ask-th { position:absolute; right:18px; bottom:-30px; font-size:5.6rem; line-height:1.4;
  color:rgba(255,179,33,.16); pointer-events:none; }
.fq-ask p { position:relative; max-width:28ch; margin-bottom:22px; color:var(--bone); font-size:1rem; line-height:1.55; }

/* ════ questions ════ */
.fq-list { border-top:1px solid var(--hair); }
.fq-item { position:relative; border-bottom:1px solid var(--hair); transition:background .5s var(--ease); }
.fq-item::before { content:""; position:absolute; left:0; top:0; bottom:0; width:2px;
  background:linear-gradient(var(--amber),var(--ember)); transform:scaleY(0); transform-origin:top;
  transition:transform .6s var(--ease); }
.fq-item[data-open="true"] { background:linear-gradient(90deg, rgba(255,179,33,.06), transparent 75%); }
.fq-item[data-open="true"]::before { transform:scaleY(1); }

.fq-item button { width:100%; display:grid; grid-template-columns:64px 1fr 42px; align-items:center; gap:14px;
  padding:26px 18px 26px 20px; text-align:left; }
.fq-item button:focus-visible { outline:2px solid var(--amber); outline-offset:-2px; }
.fq-no { font-family:var(--nm-mono); font-size:.7rem; letter-spacing:.1em; color:var(--ash); transition:color .3s; }
.fq-item[data-open="true"] .fq-no, .fq-item button:hover .fq-no { color:var(--amber); }
.fq-q { font-family:var(--nm-disp); font-weight:600; font-size:clamp(1.12rem,1.8vw,1.5rem); line-height:1.25;
  letter-spacing:-.01em; color:var(--bone); transition:transform .5s var(--ease); }
.fq-item button:hover .fq-q { transform:translateX(6px); }
.fq-ico { position:relative; width:42px; height:42px; border-radius:50%; border:1px solid var(--hair);
  transition:transform .6s var(--snap), background .4s, border-color .4s; }
.fq-ico::before, .fq-ico::after { content:""; position:absolute; top:50%; left:50%; width:14px; height:1.5px;
  background:var(--bone); transform:translate(-50%,-50%); transition:transform .5s var(--snap), background .3s; }
.fq-ico::after { transform:translate(-50%,-50%) rotate(90deg); }
.fq-item[data-open="true"] .fq-ico { background:var(--amber); border-color:var(--amber); transform:rotate(180deg); }
.fq-item[data-open="true"] .fq-ico::before,
.fq-item[data-open="true"] .fq-ico::after { background:var(--void); }
.fq-item[data-open="true"] .fq-ico::after { transform:translate(-50%,-50%) rotate(0deg); }

.fq-a { display:grid; grid-template-rows:0fr; transition:grid-template-rows .6s var(--ease); }
.fq-item[data-open="true"] .fq-a { grid-template-rows:1fr; }
.fq-a > div { overflow:hidden; visibility:hidden; transition:visibility 0s linear .6s; }
.fq-item[data-open="true"] .fq-a > div { visibility:visible; transition-delay:0s; }
.fq-a p { max-width:64ch; padding:0 64px 28px 98px; color:var(--ash); font-size:1rem; line-height:1.7; }

/* ════ responsive ════ */
@media (max-width:1024px){
  .fq-grid { grid-template-columns:1fr; gap:40px; }
  .fq-side { position:static; }
}
@media (max-width:560px){
  .fq-item button { grid-template-columns:44px 1fr 36px; gap:10px; padding:22px 10px 22px 12px; }
  .fq-ico { width:36px; height:36px; }
  .fq-a p { padding:0 14px 24px 66px; }
}
`;
