import { describe, expect, it } from 'vitest';
import { FLAG_CODES, flagCodeFromEmoji } from './flags';

describe('flags', () => {
  it('covers all board countries', () => {
    expect([...FLAG_CODES].sort()).toEqual(['br', 'cn', 'de', 'fr', 'gb', 'hu', 'il', 'us']);
  });

  it('maps tile emoji to codes', () => {
    expect(flagCodeFromEmoji('🇨🇳')).toBe('cn');
    expect(flagCodeFromEmoji('🇧🇷')).toBe('br');
    expect(flagCodeFromEmoji('🇮🇱')).toBe('il');
    expect(flagCodeFromEmoji('🇭🇺')).toBe('hu');
    expect(flagCodeFromEmoji('🇩🇪')).toBe('de');
    expect(flagCodeFromEmoji('🇫🇷')).toBe('fr');
    expect(flagCodeFromEmoji('🇬🇧')).toBe('gb');
    expect(flagCodeFromEmoji('🇺🇸')).toBe('us');
  });

  it('returns undefined for unknown input', () => {
    expect(flagCodeFromEmoji('⭐')).toBeUndefined();
    expect(flagCodeFromEmoji(undefined)).toBeUndefined();
  });
});
