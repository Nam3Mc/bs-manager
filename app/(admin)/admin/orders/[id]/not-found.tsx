import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        title="Order not found"
        description="This order doesn't exist or belongs to another business."
        action={
          <Link href="/admin/orders">
            <Button variant="primary" size="md">
              Back to orders
            </Button>
          </Link>
        }
      />
    </div>
  );
}
