/** Join class names, filtering falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** URL-safe slug from a store name. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function formatCurrency(
  amount: number | string,
  currency = "USD",
  locale = "en-US"
): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(n: number | string): string {
  const value = typeof n === "string" ? Number(n) : n;
  return new Intl.NumberFormat("en-US").format(value);
}

/** Encode a store theme for the data-* attribute. */
export function safeThemePreset(v: string): string {
  const allowed = ["default","bakery","butcher","produce","cafe","seafood","boutique"];
  return allowed.includes(v) ? v : "default";
}