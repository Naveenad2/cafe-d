"use client";

import { useEffect, useRef } from "react";

/* ── Scroll reveal: activates .reveal & .clip elements ─────────── */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .clip");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ── Split text into animated characters ───────────────────────
   Wraps each character of [data-split] children in nested spans,
   then staggers them in when the element scrolls into view.      */
export function useSplitChars(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-split]");
    targets.forEach((t) => {
      if (t.dataset.splitDone) return;
      t.dataset.splitDone = "1";
      const text = t.textContent ?? "";
      t.setAttribute("aria-label", text);
      t.textContent = "";
      [...text].forEach((ch, i) => {
        const outer = document.createElement("span");
        outer.className = "ch";
        outer.setAttribute("aria-hidden", "true");
        const inner = document.createElement("span");
        inner.textContent = ch === " " ? "\u00A0" : ch;
        inner.style.transitionDelay = `${i * 28}ms`;
        outer.appendChild(inner);
        t.appendChild(outer);
      });
    });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("split-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.3 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [scope]);
}

/* ── Scroll-linked word fill (manifesto effect) ─────────────────
   Splits text into words; brightens them one by one as the
   section travels through the viewport.                           */
export function useWordFill(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>("[data-fill]");
    if (!el || el.dataset.fillDone) return;
    el.dataset.fillDone = "1";

    const words = (el.textContent ?? "").split(/\s+/).filter(Boolean);
    el.textContent = "";
    const spans = words.map((w) => {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = w;
      el.appendChild(s);
      el.appendChild(document.createTextNode(" "));
      return s;
    });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(Math.max((vh * 0.8 - r.top) / (r.height + vh * 0.2), 0), 1);
        const lit = Math.floor(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle("lit", i <= lit));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scope]);
}

/* ── Horizontal scroll track inside a tall sticky section ──────── */
export function useHorizontal(
  wrapRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        const track = trackRef.current;
        if (!wrap || !track) return;
        const r = wrap.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(Math.max(-r.top / (total || 1), 0), 1);
        const dist = track.scrollWidth - window.innerWidth;
        track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [wrapRef, trackRef]);
}

/* ── Magnetic pull toward the cursor ───────────────────────────── */
export function useMagnetic<T extends HTMLElement>(pull = 0.32) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * pull}px, ${
        (e.clientY - r.top - r.height / 2) * pull
      }px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [pull]);
  return ref;
}

/* ── Parallax translate ────────────────────────────────────────── */
export function useParallax<T extends HTMLElement>(strength = 0.1) {
  const ref = useRef<T>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${c * -strength}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/* ── Cursor events ─────────────────────────────────────────────── */
export const grow = (label = "") => () =>
  window.dispatchEvent(new CustomEvent("cursor:grow", { detail: label }));
export const shrink = () =>
  window.dispatchEvent(new Event("cursor:shrink"));

/* ── Motion policy ─────────────────────────────────────────────
   Returns true only when the user wants reduced motion AND the
   site has not forced motion on (html.force-motion). This lets the
   site animate even if the OS toggle is on, while still respecting
   genuine reduced-motion users when force-motion is removed.       */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const forced = document.documentElement.classList.contains("force-motion");
  if (forced) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}