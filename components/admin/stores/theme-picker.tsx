"use client";

import { cn } from "@/lib/utils";
import { THEME_PRESETS, type ThemePreset } from "@/lib/store-themes";

export function ThemePicker({
  value,
  onChange,
}: {
  value: ThemePreset;
  onChange: (next: ThemePreset) => void;
}) {
  return (
    <div>
      <input type="hidden" name="themePreset" value={value} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {THEME_PRESETS.map((preset) => {
          const active = preset.value === value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors duration-150 ease-out",
                active
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-raised hover:bg-hover"
              )}
            >
              <div className="flex gap-1">
                <span
                  aria-hidden
                  className="h-6 w-6 rounded-md ring-1 ring-black/5 ring-inset"
                  style={{ backgroundColor: preset.swatch.bg }}
                />
                <span
                  aria-hidden
                  className="h-6 w-6 rounded-md ring-1 ring-black/5 ring-inset"
                  style={{ backgroundColor: preset.swatch.accent }}
                />
                <span
                  aria-hidden
                  className="h-6 w-6 rounded-md ring-1 ring-black/5 ring-inset"
                  style={{ backgroundColor: preset.swatch.text }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    active ? "text-brand" : "text-content"
                  )}
                >
                  {preset.label}
                </p>
                <p className="text-muted mt-0.5 text-xs">{preset.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
