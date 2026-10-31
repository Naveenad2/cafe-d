"use client";


import { IMAGES } from "@/lib/data";
import { Label } from "@/components/Kit";

const KITCHENS = [
  { glyph: "ไทย", lang: "th", name: "Thai", word: "soul" },
  { glyph: "中華", lang: "zh", name: "Chinese", word: "craft" },
  { glyph: "和食", lang: "ja", name: "Japanese", word: "precision" },
];

export default function Chef() {
  return (
    <section id="chef" className="ck nm" aria-labelledby="ck-title">
      <style>{css}</style>

      <div className="shell ck-grid">
        <figure className="ck-fig reveal">
          <span className="ck-ghost nm-thai" lang="th" aria-hidden>เชฟ</span>
          <span className="ck-outline" aria-hidden />
          <div className="ck-arch">
            <img
              src={IMAGES.chef}
              alt="The kitchen team at work behind the pass at Café de Bangkok"
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="ck-seal" aria-hidden>
            <svg viewBox="0 0 200 200">
              <defs>
                <path id="ckSealPath" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
              </defs>
              <text>
                <textPath href="#ckSealPath">MASTER OF THE WOK · CHEF KUAN LAI ·</textPath>
              </text>
            </svg>
            <svg className="ck-flame" viewBox="0 0 24 24">
              <path d="M12 2.5c.6 3.1 3.4 4.9 4.6 7.6.9 2 .8 4.6-.8 6.5A5.6 5.6 0 0 1 6.3 13c.2-1.8 1-3.2 2.1-4.3.1 1.6.8 2.7 1.9 3.3-.4-3.4.3-6.6 1.7-9.5z" />
            </svg>
          </div>
          <figcaption className="ck-tag">Behind the pass</figcaption>
        </figure>

        <div className="ck-copy">
          <Label no="04" className="reveal">The Kitchen</Label>
          <h2 className="nm-h2 reveal d1" id="ck-title">
            Chef Kuan Lai&apos;s <em>discipline</em>
          </h2>

          <blockquote className="ck-quote reveal d2">
            <p>
              The wok doesn&apos;t wait, and neither does flavour. You get one
              breath of fire to seal it in — that breath is everything.
            </p>
            <cite>Chef Kuan Lai</cite>
          </blockquote>

          <p className="ck-p reveal d3">
            Guests have called his Salmon Maki among the best they&apos;ve had
            globally, and his wonton broth proof that the kitchen knows its
            game. Behind both is the same discipline: paste pounded fresh each
            morning, dumplings pleated through the afternoon, and a flame that
            is treated like the most senior member of staff.
          </p>

          <ul className="ck-trio reveal d3" aria-label="Three cuisines, one pass">
            {KITCHENS.map((k) => (
              <li key={k.name}>
                <span className="ck-glyph" lang={k.lang} aria-hidden>{k.glyph}</span>
                <b>{k.name}</b>
                <em>{k.word}</em>
              </li>
            ))}
          </ul>

          <p className="ck-note reveal d4">
            Three cuisines move through one pass — and nothing leaves it
            twice-cooked or half-meant.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ════════════════ scoped styles ════════════════ */
const css = `
.ck { position:relative; padding:clamp(90px,11vw,170px) 0; }
.ck-grid { display:grid; grid-template-columns:.9fr 1.1fr; gap:clamp(48px,7vw,120px); align-items:center; }

/* ════ arched portrait ════ */
.ck-fig { position:relative; margin:0; width:100%; max-width:500px; justify-self:center; }
.ck-arch { position:relative; z-index:1; aspect-ratio:4/5.3; overflow:hidden;
  border-radius:999px 999px 28px 28px; border:1px solid rgba(255,179,33,.28);
  box-shadow:0 44px 110px rgba(0,0,0,.6), 0 0 80px rgba(255,140,33,.08); }
.ck-arch img { width:100%; height:100%; object-fit:cover; transform:scale(1.04); transition:transform 1.8s var(--ease); }
.ck-fig:hover .ck-arch img { transform:scale(1.1); }
.ck-arch::after { content:""; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(90% 55% at 50% 0%, rgba(255,179,33,.2), transparent 60%),
    linear-gradient(to top, rgba(6,5,5,.6), transparent 45%); }
.ck-outline { position:absolute; inset:-20px 20px 20px -20px; border-radius:999px 999px 28px 28px;
  border:1px solid rgba(255,179,33,.35); pointer-events:none; }
.ck-ghost { position:absolute; z-index:0; right:-24%; top:4%; writing-mode:vertical-rl;
  font-size:clamp(7rem,14vw,12rem); line-height:1.2; color:transparent;
  -webkit-text-stroke:1px rgba(255,179,33,.13); pointer-events:none; }

.ck-seal { position:absolute; z-index:2; left:-34px; bottom:44px; width:clamp(116px,11vw,148px); aspect-ratio:1;
  display:grid; place-items:center; border-radius:50%;
  background:radial-gradient(circle at 36% 30%, #1d150d, #090706 72%);
  border:1px solid rgba(255,179,33,.3); box-shadow:0 20px 50px rgba(0,0,0,.55); }
.ck-seal svg:first-child { position:absolute; inset:0; width:100%; height:100%; animation:orbit 22s linear infinite; }
.ck-seal text { font-family:var(--nm-mono); font-size:13.4px; letter-spacing:1.9px; fill:var(--amber); }
.ck-flame { width:34%; height:34%; fill:var(--ember); filter:drop-shadow(0 0 12px rgba(255,77,28,.8));
  animation:ck-flick 2.4s ease-in-out infinite; }
@keyframes ck-flick { 0%,100% { transform:scale(1) rotate(-2deg); } 50% { transform:scale(1.08,1.14) rotate(2deg); } }

.ck-tag { position:absolute; z-index:2; top:16%; right:-18px; padding:10px 16px; border-radius:6px;
  background:var(--amber); color:var(--void); transform:rotate(5deg);
  font-family:var(--nm-mono); font-size:.66rem; font-weight:500; letter-spacing:.16em; text-transform:uppercase;
  box-shadow:0 14px 40px rgba(255,179,33,.3); }

/* ════ copy ════ */
.ck-copy .nm-h2 { margin-top:22px; }
.ck-quote { position:relative; margin:clamp(30px,4vw,46px) 0 26px; padding-top:30px; }
.ck-quote::before { content:"“"; position:absolute; top:-.2em; left:-.02em; font-family:var(--nm-disp);
  font-weight:800; font-size:7rem; line-height:1; color:var(--amber); opacity:.35; pointer-events:none; }
.ck-quote p { font-family:var(--nm-serif); font-style:italic; font-weight:400;
  font-size:clamp(1.5rem,2.5vw,2.25rem); line-height:1.26; letter-spacing:-.02em; color:var(--bone); max-width:30ch; }
.ck-quote cite { display:inline-flex; align-items:center; gap:12px; margin-top:18px; font-style:normal;
  font-family:var(--nm-mono); font-size:.72rem; letter-spacing:.16em; text-transform:uppercase; color:var(--amber); }
.ck-quote cite::before { content:""; width:34px; height:1px; background:currentColor; }
.ck-p { max-width:56ch; color:var(--ash); font-size:1.02rem; line-height:1.7; }

.ck-trio { list-style:none; display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:30px 0 16px; }
.ck-trio li { position:relative; overflow:hidden; padding:18px 18px 16px; border-radius:16px;
  border:1px solid var(--hair); background:linear-gradient(160deg, #161009, #0b0908);
  transition:border-color .4s, transform .5s var(--ease), box-shadow .5s; }
.ck-trio li:hover { border-color:rgba(255,179,33,.5); transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,.4); }
.ck-glyph { display:block; font-size:2.3rem; line-height:1.25; color:var(--amber); text-shadow:0 0 24px rgba(255,179,33,.35); }
.ck-trio li:first-child .ck-glyph { font-family:var(--nm-thai); }
.ck-trio b { display:block; margin-top:12px; font-family:var(--nm-disp); font-weight:800; font-stretch:75%;
  text-transform:uppercase; font-size:1.35rem; line-height:1; color:var(--bone); }
.ck-trio em { font-family:var(--nm-serif); font-style:italic; font-size:1.02rem; color:var(--ash); }
.ck-note { font-family:var(--nm-mono); font-size:.72rem; letter-spacing:.05em; line-height:1.6; color:var(--ash); }

/* ════ responsive ════ */
@media (max-width:1024px){
  .ck-grid { grid-template-columns:1fr; }
  .ck-fig { max-width:420px; }
}
@media (max-width:560px){
  .ck-fig { width:calc(100% - 40px); }
  .ck-outline { inset:-12px 12px 12px -12px; }
  .ck-seal { left:-18px; bottom:28px; }
  .ck-tag { right:-12px; }
  .ck-trio { gap:8px; }
  .ck-trio li { padding:14px 12px; }
  .ck-glyph { font-size:1.8rem; }
  .ck-trio b { font-size:1.1rem; }
  .ck-trio em { font-size:.9rem; }
}

/* ════ reduced motion ════ */
@media (prefers-reduced-motion:reduce){
  html:not(.force-motion) .ck-seal svg,
  html:not(.force-motion) .ck-flame { animation:none !important; }
}
`;
