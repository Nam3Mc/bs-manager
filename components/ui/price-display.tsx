import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number | string;
  currency?: string;
  locale?: string;
  className?: string;
  /** 'sm' table thumb | 'md' card | 'lg' hero / cart total */
  size?: "sm" | "md" | "lg";
  /** Show muted "was" price above (for sales). */
  was?: number | string;
}

const sizes = {
  sm: "text-sm",
  md: "text-base font-semibold",
  lg: "text-2xl font-bold",
};

export function PriceDisplay({
  amount,
  currency = "USD",
  locale = "en-US",
  size = "md",
  className,
  was,
}: PriceDisplayProps) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const wasValue = was === undefined ? undefined
    : typeof was === "string" ? Number(was) : was;

  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  return (
    <span className={cn("num inline-flex flex-col leading-tight", className)}>
      {wasValue !== undefined && wasValue > value && (
        <span className="text-xs text-subtle line-through">{fmt.format(wasValue)}</span>
      )}
      <span className={cn(sizes[size], "text-content")}>{fmt.format(value)}</span>
    </span>
  );
}