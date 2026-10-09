"use client";

import type { ThemePreset, BackgroundStyle } from "@/lib/store-themes";

interface StorePreviewProps {
  name: string;
  description: string | null;
  themePreset: ThemePreset;
  backgroundStyle: BackgroundStyle;
  heroImageUrl: string | null;
  heroHeadline: string | null;
  heroSubtext: string | null;
}

export function StorePreview({
  name,
  description,
  themePreset,
  backgroundStyle,
  heroImageUrl,
  heroHeadline,
  heroSubtext,
}: StorePreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line bg-sunken px-3 py-2">
        <span className="flex gap-1">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="ml-2 truncate text-xs text-subtle">Preview · store page</span>
      </div>

      <div
        data-store-theme={themePreset}
        data-store-bg={backgroundStyle}
        className="bg-surface"
      >
        {/* Hero */}
        <div className="relative h-48 overflow-hidden bg-sunken sm:h-56">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, color-mix(in oklab, var(--brand) 40%, transparent), color-mix(in oklab, var(--brand) 10%, transparent))",
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">
              Store
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {name || "Your store name"}
            </h2>
            {(heroHeadline || description) && (
              <p className="mt-1 max-w-lg text-sm text-white/85">
                {heroHeadline || description}
              </p>
            )}
            {heroSubtext && (
              <p className="mt-1 text-xs text-white/70">{heroSubtext}</p>
            )}
          </div>
        </div>

        {/* Product placeholder grid */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square rounded-lg bg-brand-soft" />
                <div className="h-2 w-3/4 rounded bg-line" />
                <div className="h-2 w-1/3 rounded bg-line" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="border-t border-line px-3 py-2 text-[10px] text-subtle">
        This is how customers see your store. Presets only affect the store page.
      </p>
    </div>
  );
}