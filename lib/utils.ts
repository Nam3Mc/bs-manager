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

/** Encode a store theme for the data-* attribute. */
export function safeThemePreset(v: string): string {
  const allowed = ["default","bakery","butcher","produce","cafe","seafood","boutique"];
  return allowed.includes(v) ? v : "default";
}