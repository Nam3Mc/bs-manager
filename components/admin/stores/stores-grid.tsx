import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { THEME_PRESETS, type ThemePreset } from "@/lib/store-themes";
import { formatNumber, cn } from "@/lib/utils";
import type { StoreRow } from "@/lib/queries";
import { DeleteStoreButton } from "./delete-store-button";

function themeDef(preset: string) {
  return (
    THEME_PRESETS.find((p) => p.value === preset) ??
    THEME_PRESETS.find((p) => p.value === "default")!
  );
}

export function StoresGrid({ stores }: { stores: StoreRow[] }) {
  if (stores.length === 0) {
    return (
      <EmptyState
        title="No stores yet"
        description="Create a store to publish your products to customers."
        action={
          <Link href="/admin/stores/new">
            <Button variant="primary" size="md">
              Create store
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => {
        const theme = themeDef(store.theme_preset);
        return (
          <li key={store.id} className="group">
            <div className="overflow-hidden rounded-xl border border-line bg-raised shadow-sm transition-colors duration-150 hover:bg-hover">
              {/* Theme swatch strip */}
              <div className="flex h-1">
                <span className="flex-1" style={{ backgroundColor: theme.swatch.accent }} />
                <span className="flex-1" style={{ backgroundColor: theme.swatch.bg }} />
                <span className="flex-1" style={{ backgroundColor: theme.swatch.text }} />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/stores/${store.id}/edit`}
                      className="block truncate font-display text-base font-semibold text-content hover:text-brand"
                    >
                      {store.name}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-subtle">
                      /market/{store.slug}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      store.is_active
                        ? "bg-success/10 text-success"
                        : "bg-ink-500/10 text-muted"
                    )}
                  >
                    {store.is_active ? "Live" : "Draft"}
                  </span>
                </div>

                {store.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted">
                    {store.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span className="num">
                    {formatNumber(store.product_count)} product
                    {store.product_count === 1 ? "" : "s"}
                  </span>
                  <span className="capitalize">{theme.label}</span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/stores/${store.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:bg-hover hover:text-content"
                  >
                    Edit
                  </Link>
                  <DeleteStoreButton storeId={store.id} storeName={store.name} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}