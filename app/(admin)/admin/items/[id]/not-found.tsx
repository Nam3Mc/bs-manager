import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function ItemNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        title="Item not found"
        description="This item doesn't exist or was deleted."
        action={
          <Link href="/admin/items">
            <Button variant="primary" size="md">
              Back to items
            </Button>
          </Link>
        }
      />
    </div>
  );
}