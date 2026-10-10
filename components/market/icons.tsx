type IconProps = { className?: string };
const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const SearchIcon = ({ className }: IconProps) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" {...s}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" {...s}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const MapPinIcon = ({ className }: IconProps) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" {...s}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ArrowRightIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const ArrowLeftIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const ChevronDownIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const LogoutIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const OrderIcon = ({ className }: IconProps) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" {...s}>
    <path d="M4 3h16v18l-3-2-3 2-3-2-3 2-3-2-1 .67z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);