import { Card, CardBody } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface RevenueSummaryProps {
  today: string;
  week: string;
  month: string;
  all_time: string;
  today_orders: number;
  week_orders: number;
  month_orders: number;
  all_time_orders: number;
}

export function RevenueSummary(props: RevenueSummaryProps) {
  const cells = [
    { label: "Today", revenue: props.today, orders: props.today_orders },
    { label: "Last 7 days", revenue: props.week, orders: props.week_orders },
    { label: "Last 30 days", revenue: props.month, orders: props.month_orders },
    { label: "All time", revenue: props.all_time, orders: props.all_time_orders },
  ];

  return (
    <Card>
      <CardBody className="p-0">
        <div className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {cells.map((cell, i) => (
            <div
              key={cell.label}
              className={[
                "p-5",
                i < 2 ? "border-b border-line lg:border-b-0" : "",
                i % 2 === 1 ? "border-l border-line lg:border-l-0" : "",
              ].join(" ")}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-subtle">
                {cell.label}
              </p>
              <p className="num mt-2 font-display text-2xl font-bold tracking-tight text-content">
                {formatCurrency(cell.revenue)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {formatNumber(cell.orders)} order{cell.orders === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}