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
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-hover hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
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