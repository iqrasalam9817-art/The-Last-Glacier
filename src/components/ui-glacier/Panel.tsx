import type { ReactNode } from "react";
import type { Provenance } from "@/content/glacier";
import { RevealBlock } from "./AnimatedText";

export function FrostedPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`frosted rounded-2xl p-6 sm:p-7 ${className}`}>{children}</div>
  );
}

const tone: Record<Provenance, string> = {
  OBSERVED: "text-glacier border-glacier/40",
  MODELED: "text-mint border-mint/40",
  ILLUSTRATIVE: "text-mist border-mist/40",
  "FICTIONAL STORY ELEMENT": "text-rose border-rose/40",
};

export function ProvenanceTag({ value }: { value: Provenance }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${tone[value]}`}
    >
      {value}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow-drift text-glow-soft text-[11px] uppercase tracking-[0.36em] text-mist">
      {children}
    </p>
  );
}

export function Statement({ children }: { children: ReactNode }) {
  return (
    <RevealBlock>
      <p className="text-3d-stage text-3d font-display text-2xl leading-tight text-frost sm:text-3xl">
        {children}
      </p>
    </RevealBlock>
  );
}

export function Meter({
  label,
  value,
  accent = "glacier",
}: {
  label: string;
  value: number;
  accent?: "glacier" | "mint" | "meltwater" | "amber";
}) {
  const bar = {
    glacier: "bg-glacier",
    mint: "bg-mint",
    meltwater: "bg-meltwater",
    amber: "bg-amber",
  }[accent];
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-mist">{label}</span>
        <span className="font-display text-lg text-frost">{value}</span>
      </div>
      <div className="mt-2 h-[3px] w-full rounded-full bg-frost/10">
        <div
          className={`h-full rounded-full ${bar} transition-[width] duration-700 ease-out`}
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
