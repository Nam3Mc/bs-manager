import { PriceDisplay } from "@/components/ui/price-display";
import type { PublicProduct } from "@/lib/queries";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-line bg-raised shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-sunken">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-soft">
            <span className="text-3xl font-display font-bold text-brand/40">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-content line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-muted line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <PriceDisplay amount={product.price} size="md" />
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}