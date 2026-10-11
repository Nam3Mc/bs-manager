import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        title="Store not found"
        description="This store doesn't exist or belongs to another business."
        action={
          <Link href="/admin/stores">
            <Button variant="primary" size="md">
              Back to stores
            </Button>
          </Link>
        }
      />
    </div>
  );
}
