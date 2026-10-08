type IconProps = { className?: string };
const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const HomeIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" /></svg>
);
export const BoxIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg>
);
export const TagIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" /></svg>
);
export const StoreIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M3 9 4 4h16l1 5M4 9v11h16V9M9 22V12h6v10" /></svg>
);
export const ReceiptIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M4 3h16v18l-3-2-3 2-3-2-3 2-3-2-1 .67z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
);
export const ChartIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 5-7" /></svg>
);
export const MenuIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const CloseIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const LogoutIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
);
export const ChevronDownIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}><path d="m6 9 6 6 6-6" /></svg>
);
export const PlusIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}><path d="M12 5v14M5 12h14" /></svg>
);