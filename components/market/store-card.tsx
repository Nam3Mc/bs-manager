import Link from "next/link";
import { THEME_PRESETS } from "@/lib/store-themes";
import { MapPinIcon, ArrowRightIcon } from "./icons";
import { formatNumber } from "@/lib/utils";
import type { PublicStore } from "@/lib/queries";

function themeDef(preset: string) {
  return (
    THEME_PRESETS.find((p) => p.value === preset) ??
    THEME_PRESETS.find((p) => p.value === "default")!
  );
}

export function StoreCard({ store }: { store: PublicStore }) {
  const theme = themeDef(store.theme_preset);
  const headline = store.hero_headline || store.description || "Browse the catalog";

  return (
    <Link
      href={`/market/${store.slug}`}
      data-store-theme={store.theme_preset}
      className="group block overflow-hidden rounded-2xl border border-line bg-raised shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {/* Hero strip */}
      <div className="relative aspect-[16/9] overflow-hidden bg-sunken">
        {store.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.hero_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.swatch.accent}, ${theme.swatch.text})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Theme accent bar */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-1 w-full"
          style={{ backgroundColor: theme.swatch.accent }}
        />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-lg font-semibold tracking-tight text-white line-clamp-1">
            {store.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="line-clamp-2 text-sm text-muted">{headline}</p>

        {store.address && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-subtle">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{store.address}</span>
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="num text-xs text-muted">
            {formatNumber(store.product_count)} product
            {store.product_count === 1 ? "" : "s"}
          </span>
          <span
            className="flex items-center gap-1 text-xs font-medium text-brand transition-transform duration-150 group-hover:translate-x-0.5"
          >
            Visit store <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}