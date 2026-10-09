// Estimate-based auto-fit so tile names always render in full
// (reference tile scales the name, e.g. Shanghai at 98.0392%).
const AVG_ADVANCE = 0.58; // Nunito average glyph advance, em
const MIN_SCALE = 0.7;

export function fitFontScale(text: string, maxWidthPx: number, basePx: number): number {
  if (!text) return 1;
  const estimate = text.length * basePx * AVG_ADVANCE;
  if (estimate <= maxWidthPx) return 1;
  return Math.max(MIN_SCALE, maxWidthPx / estimate);
}
