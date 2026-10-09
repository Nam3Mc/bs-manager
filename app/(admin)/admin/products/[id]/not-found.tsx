import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        title="Product not found"
        description="This product doesn't exist or belongs to another business."
        action={
          <Link href="/admin/products">
            <Button variant="primary" size="md">
              Back to products
            </Button>
          </Link>
        }
      />
    </div>
  );
}