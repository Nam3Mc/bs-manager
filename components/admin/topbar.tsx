import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoutButton } from "@/components/ui/logout-button";
import { UserMenu } from "./user-menu";
import { MenuIcon } from "./icons";
import type { SessionPayload } from "@/lib/auth";

export function Topbar({
  session,
  onMenuClick,
}: {
  session: SessionPayload;
  onMenuClick?: () => void;
}) {
  return (
    <header className="border-line bg-surface/80 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur sm:px-6 lg:px-8">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="text-muted hover:bg-hover hover:text-content focus-visible:ring-ring flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none md:hidden"
        >
          <MenuIcon />
        </button>
      )}

      <div className="flex-1" />

      <ThemeToggle />
      <LogoutButton variant="ghost" size="md" display="icon" />
      <UserMenu name={session.name} email={session.email} role={session.role} />
    </header>
  );
}
