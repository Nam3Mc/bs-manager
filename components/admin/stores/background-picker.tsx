"use client";

import { cn } from "@/lib/utils";
import { BACKGROUND_STYLES, type BackgroundStyle } from "@/lib/store-themes";

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: BackgroundStyle;
  onChange: (next: BackgroundStyle) => void;
}) {
  return (
    <div>
      <input type="hidden" name="backgroundStyle" value={value} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BACKGROUND_STYLES.map((bg) => {
          const active = bg.value === value;
          return (
            <button
              key={bg.value}
              type="button"
              onClick={() => onChange(bg.value)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150 ease-out",
                active
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-raised hover:bg-hover"
              )}
            >
              <BackgroundSwatch style={bg.value} />
              <div className="min-w-0">
                <p className={cn("text-xs font-semibold", active ? "text-brand" : "text-content")}>
                  {bg.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted">{bg.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BackgroundSwatch({ style }: { style: BackgroundStyle }) {
  const base = "h-10 w-full rounded-md border border-line bg-surface";
  if (style === "plain") return <div className={base} />;
  if (style === "gradient")
    return (
      <div
        className={base}
        style={{
          backgroundImage:
            "linear-gradient(180deg, color-mix(in oklab, var(--brand) 25%, transparent), transparent)",
        }}
      />
    );
  if (style === "grid")
    return (
      <div
        className={base}
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--brand) 20%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--brand) 20%, transparent) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
    );
  return (
    <div
      className={base}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}