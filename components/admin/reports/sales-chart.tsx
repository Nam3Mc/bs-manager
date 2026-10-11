import { formatCurrency } from "@/lib/utils";
import type { DailyRevenue } from "@/lib/queries";

export function SalesChart({ data }: { data: DailyRevenue[] }) {
  const max = Math.max(...data.map((d) => Number(d.revenue)), 1);
  const total = data.reduce((sum, d) => sum + Number(d.revenue), 0);

  const firstLabel = data[0]?.date ?? "";
  const midLabel = data[Math.floor(data.length / 2)]?.date ?? "";
  const lastLabel = data[data.length - 1]?.date ?? "";

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-subtle text-xs font-medium tracking-wider uppercase">
            Last 30 days
          </p>
          <p className="num font-display text-content mt-1 text-2xl font-bold tracking-tight">
            {formatCurrency(total)}
          </p>
        </div>
        <p className="num text-muted text-xs">peak {formatCurrency(max)}</p>
      </div>

      <div className="relative h-40 w-full">
        {/* gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-line/60 border-t" />
          ))}
        </div>

        {/* bars */}
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {data.map((d) => {
            const revenue = Number(d.revenue);
            const pct = (revenue / max) * 100;
            const isZero = revenue === 0;
            return (
              <div
                key={d.date}
                title={`${d.date}: ${formatCurrency(revenue)} (${d.orders} order${d.orders === 1 ? "" : "s"})`}
                className={[
                  "group relative flex-1 rounded-t transition-colors duration-150",
                  isZero ? "bg-line/40" : "bg-brand hover:bg-brand-hover",
                ].join(" ")}
                style={{ height: `${Math.max(pct, 2)}%` }}
              />
            );
          })}
        </div>
      </div>

      <div className="text-subtle mt-2 flex justify-between text-xs">
        <span>{firstLabel}</span>
        <span>{midLabel}</span>
        <span>{lastLabel}</span>
      </div>
    </div>
  );
}
