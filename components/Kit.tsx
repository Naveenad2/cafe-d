"use client";

/* ════════════════════════════════════════════════════════════════
   KIT — small shared pieces for the "Night Market" sections below
   the hero. Styles live in globals.css under NIGHT MARKET.
   ════════════════════════════════════════════════════════════════ */

import { grow, shrink } from "@/lib/hooks";
import { Arrow } from "@/components/Chrome";

/* amber index chip + mono section name */
export function Label({
  no,
  children,
  className = "",
}: {
  no: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`nm-label ${className}`.trim()}>
      <b>{no}</b>
      {children}
    </p>
  );
}

/* pill link whose label rolls up on hover */
export function RollLink({
  href,
  label,
  ghost = false,
  external = false,
  cursor = "",
}: {
  href: string;
  label: string;
  ghost?: boolean;
  external?: boolean;
  cursor?: string;
}) {
  return (
    <a
      className={`nm-btn${ghost ? " ghost" : ""}`}
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onMouseEnter={grow(cursor)}
      onMouseLeave={shrink}
    >
      <span className="nm-btn-roll" aria-hidden>
        <span data-t={label}>{label}</span>
      </span>
      <span className="nm-btn-ico" aria-hidden>
        <Arrow />
      </span>
    </a>
  );
}
