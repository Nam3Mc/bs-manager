import { requireRole } from "@/lib/session";
import { getCartCount } from "@/lib/queries";
import { MarketShell } from "@/components/market/market-shell";

export default async function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("CLIENT");
  const cartCount = await getCartCount(session.userId);

  return (
    <MarketShell session={session} cartCount={cartCount}>
      {children}
    </MarketShell>
  );
}