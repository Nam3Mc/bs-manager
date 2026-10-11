import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicStoreBySlug, getPublicProductsForStore } from "@/lib/queries";
import { ProductCard } from "@/components/market/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MapPinIcon, ArrowLeftIcon } from "@/components/market/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getPublicStoreBySlug(slug);
  return { title: store?.name ?? "Store" };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getPublicStoreBySlug(slug);
  if (!store) notFound();

  const products = await getPublicProductsForStore(store.id);

  return (
    <main
      data-store-theme={store.theme_preset}
      data-store-bg={store.background_style}
      className="bg-surface min-h-[calc(100dvh-4rem)]"
    >
      {/* Hero */}
      <div className="bg-sunken relative h-56 overflow-hidden sm:h-72 lg:h-80">
        {store.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.hero_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, color-mix(in oklab, var(--brand) 50%, transparent), color-mix(in oklab, var(--brand) 15%, transparent))",
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
            <Link
              href="/market"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:text-white"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Marketplace
            </Link>

            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {store.name}
            </h1>

            {(store.hero_headline || store.description) && (
              <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                {store.hero_headline || store.description}
              </p>
            )}

            {store.hero_subtext && (
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                {store.hero_subtext}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info bar */}
      {(store.address || store.nit || store.contact_email || store.contact_phone) && (
        <div className="border-line bg-raised border-b">
          <div className="text-muted mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 text-xs sm:px-6 lg:px-8">
            {store.address && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="text-subtle h-3.5 w-3.5 shrink-0" />
                {store.address}
              </span>
            )}
            {store.nit && <span className="font-mono">NIT {store.nit}</span>}
            {store.contact_email && (
              <a href={`mailto:${store.contact_email}`} className="hover:text-content">
                {store.contact_email}
              </a>
            )}
            {store.contact_phone && (
              <a href={`tel:${store.contact_phone}`} className="hover:text-content">
                {store.contact_phone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-content text-xl font-semibold tracking-tight">
            Products
          </h2>
          <span className="num text-muted text-xs">
            {products.length} item{products.length === 1 ? "" : "s"}
          </span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="This store hasn't published any products. Check back soon."
          />
        ) : (
          <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
