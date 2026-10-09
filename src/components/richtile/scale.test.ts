import { describe, expect, it } from 'vitest';
import { fitFontScale } from './scale';

// Pure helper: shrink factor so a name fits maxWidthPx at basePx.
// Reference tile auto-fits (Shanghai rendered at 98.0392%).
describe('fitFontScale', () => {
  it('returns 1 when the text fits', () => {
    expect(fitFontScale('Rio', 60, 13)).toBe(1);
  });

  it('shrinks long names proportionally', () => {
    const s = fitFontScale('San Francisco', 60, 13);
    expect(s).toBeLessThan(1);
    expect(s).toBeGreaterThanOrEqual(0.7);
  });

  it('never shrinks below 70%', () => {
    expect(fitFontScale('A very long property name here', 10, 13)).toBe(0.7);
  });

  it('is deterministic for the same input', () => {
    expect(fitFontScale('Shanghai', 60, 13)).toBe(fitFontScale('Shanghai', 60, 13));
  });
});
