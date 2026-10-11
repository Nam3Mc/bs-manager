import { PriceDisplay } from "@/components/ui/price-display";
import type { PublicProduct } from "@/lib/queries";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <div className="group border-line bg-raised flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="bg-sunken relative aspect-square overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="bg-brand-soft flex h-full w-full items-center justify-center">
            <span className="font-display text-brand/40 text-3xl font-bold">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="text-content line-clamp-2 text-sm font-semibold">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-muted mt-1 line-clamp-2 text-xs">{product.description}</p>
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
