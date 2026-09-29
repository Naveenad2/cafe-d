"use client";

export default function Story() {
  return (
    <section id="story" className="section story">
      <div className="shell story-grid">
        {/* polaroid collage */}
        <div className="story-stage reveal left">
          <figure className="polaroid p1">
            <span className="tape" />
            <div className="ph ph-a" />
            <figcaption>wok fire, every evening</figcaption>
          </figure>
          <figure className="polaroid p2">
            <span className="tape" />
            <div className="ph ph-b" />
            <figcaption>lanterns &amp; laughter</figcaption>
          </figure>
          <figure className="polaroid p3">
            <span className="tape" />
            <div className="ph ph-c" />
            <figcaption>folded by hand</figcaption>
          </figure>
        </div>

        {/* copy */}
        <div className="story-copy">
          <span className="eyebrow reveal">Our Story</span>
          <h2 className="display reveal d1">
            A little corner of <span className="grad-text">Thailand</span>,
            growing in Kochi.
          </h2>
          <p className="reveal d2">
            Café de Bangkok began with one belief — that the warmth of a Thai
            street kitchen belongs at every table in Kerala. Under our master
            chef, every plate is a postcard from Bangkok: layered, balanced,
            unmistakably authentic.
          </p>

          <div className="story-points">
            {[
              { i: "🔥", bg: "#ffe3d2", t: "Wok hei, the real thing", s: "High-flame cooking that chars, smokes and seals flavour the Bangkok way." },
              { i: "🌿", bg: "#ddf2e6", t: "Fresh Thai aromatics", s: "Lemongrass, galangal, kaffir lime & holy basil — never shortcuts." },
              { i: "🥢", bg: "#fff0c9", t: "Three kitchens, one roof", s: "Thai soul, Chinese craft and Japanese precision on a single menu." },
            ].map((p, n) => (
              <div key={p.t} className={`spoint reveal d${n + 2}`}>
                <span className="ico" style={{ background: p.bg }}>{p.i}</span>
                <span><b>{p.t}</b><small>{p.s}</small></span>
              </div>
            ))}
          </div>

          <div className="reveal d5" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 44, height: 2, background: "var(--flame)" }} />
            <span className="display" style={{ fontStyle: "italic", fontSize: "1.4rem", color: "var(--gold-deep)" }}>
              — Chef Kuan Lai &amp; team
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}