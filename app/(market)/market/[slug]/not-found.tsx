import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20">
      <EmptyState
        title="Store not found"
        description="This store doesn't exist or is no longer available."
        action={
          <Link href="/market">
            <Button variant="primary" size="md">
              Back to marketplace
            </Button>
          </Link>
        }
      />
    </main>
  );
}
