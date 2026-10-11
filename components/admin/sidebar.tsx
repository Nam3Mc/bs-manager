"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/ui/logout-button";
import { HomeIcon, BoxIcon, TagIcon, StoreIcon, ReceiptIcon, ChartIcon } from "./icons";

type NavItem = { href: string; label: string; icon: React.ReactNode };
type NavSection = { label: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: <HomeIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/items", label: "Items", icon: <BoxIcon className="h-5 w-5" /> },
      {
        href: "/admin/products",
        label: "Products",
        icon: <TagIcon className="h-5 w-5" />,
      },
      { href: "/admin/stores", label: "Stores", icon: <StoreIcon className="h-5 w-5" /> },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        icon: <ReceiptIcon className="h-5 w-5" />,
      },
      {
        href: "/admin/reports",
        label: "Reports",
        icon: <ChartIcon className="h-5 w-5" />,
      },
    ],
  },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col overflow-hidden">
      {/* Scrollable sections */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="text-subtle px-3 pb-1 text-[11px] font-medium tracking-wider uppercase">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out",
                        active
                          ? "bg-brand-soft text-brand"
                          : "text-muted hover:bg-hover hover:text-content"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 transition-colors duration-150",
                          active ? "text-brand" : "text-subtle group-hover:text-content"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Pinned footer */}
      <div className="border-line shrink-0 border-t px-3 py-3">
        <LogoutButton variant="ghost" size="md" className="w-full justify-start" />
      </div>
    </nav>
  );
}
