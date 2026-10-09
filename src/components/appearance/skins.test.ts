import { describe, it, expect } from 'vitest';
import { APPEARANCES } from './skins';

describe('skins', () => {
  it('has exactly 12 appearance colors', () => {
    expect(APPEARANCES).toHaveLength(12);
  });

  it('has valid hex color strings', () => {
    for (const color of APPEARANCES) {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('has distinct colors', () => {
    const hexes = APPEARANCES.map((c) => c.toLowerCase());
    expect(new Set(hexes).size).toBe(12);
  });
});