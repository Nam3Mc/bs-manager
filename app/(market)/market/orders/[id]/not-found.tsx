import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20">
      <EmptyState
        title="Order not found"
        description="This order doesn't exist or belongs to another account."
        action={
          <Link href="/market/orders">
            <Button variant="primary" size="md">
              My orders
            </Button>
          </Link>
        }
      />
    </main>
  );
}
