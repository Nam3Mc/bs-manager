export type ThemePreset =
  "default" | "bakery" | "butcher" | "produce" | "cafe" | "seafood" | "boutique";

export type BackgroundStyle = "plain" | "grid" | "gradient" | "noise";

export interface ThemePresetDef {
  value: ThemePreset;
  label: string;
  description: string;
  /** Swatch colors for the picker — light mode values */
  swatch: { bg: string; accent: string; text: string };
}

export const THEME_PRESETS: ThemePresetDef[] = [
  {
    value: "default",
    label: "Default",
    description: "Platform teal — clean and neutral",
    swatch: { bg: "#f0fdfa", accent: "#0d9488", text: "#134e4a" },
  },
  {
    value: "bakery",
    label: "Bakery",
    description: "Warm amber — breads, pastries, sweets",
    swatch: { bg: "#fef3c7", accent: "#b45309", text: "#78350f" },
  },
  {
    value: "butcher",
    label: "Butcher",
    description: "Deep red — meats, deli, cold cuts",
    swatch: { bg: "#fee2e2", accent: "#b91c1c", text: "#7f1d1d" },
  },
  {
    value: "produce",
    label: "Produce",
    description: "Fresh green — fruits, vegetables, greens",
    swatch: { bg: "#dcfce7", accent: "#15803d", text: "#14532d" },
  },
  {
    value: "cafe",
    label: "Café",
    description: "Roasted brown — coffee, tea, warm drinks",
    swatch: { bg: "#fef3c7", accent: "#78350f", text: "#451a03" },
  },
  {
    value: "seafood",
    label: "Seafood",
    description: "Ocean blue — fish, shellfish, marine",
    swatch: { bg: "#dbeafe", accent: "#1d4ed8", text: "#1e3a8a" },
  },
  {
    value: "boutique",
    label: "Boutique",
    description: "Elegant purple — specialty, curated goods",
    swatch: { bg: "#f3e8ff", accent: "#7e22ce", text: "#581c87" },
  },
];

export const BACKGROUND_STYLES: {
  value: BackgroundStyle;
  label: string;
  description: string;
}[] = [
  { value: "plain", label: "Plain", description: "Solid background" },
  { value: "gradient", label: "Gradient", description: "Soft brand-colored top fade" },
  { value: "grid", label: "Grid", description: "Subtle dotted grid pattern" },
  { value: "noise", label: "Noise", description: "Fine grain texture" },
];

export function isValidThemePreset(v: string): v is ThemePreset {
  return THEME_PRESETS.some((p) => p.value === v);
}

export function isValidBackgroundStyle(v: string): v is BackgroundStyle {
  return BACKGROUND_STYLES.some((b) => b.value === v);
}
