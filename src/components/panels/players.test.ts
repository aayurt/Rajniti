import { describe, it, expect } from 'vitest';
import { sortPlayersWithHostFirst, formatCash } from './players';
import type { Player } from '../../game/store';

describe('Player helpers', () => {
  it('should sort host to the top', () => {
    const players: Player[] = [
      { id: '1', name: 'A', color: 'red', cash: 100, pos: 0 },
      { id: '2', name: 'B', color: 'blue', cash: 100, pos: 0, isOwner: true },
      { id: '3', name: 'C', color: 'green', cash: 100, pos: 0 },
    ];

    const sorted = sortPlayersWithHostFirst(players);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
    expect(sorted[2].id).toBe('3');
  });

  it('should format cash correctly', () => {
    expect(formatCash(1500)).toBe('$1500');
    expect(formatCash(0)).toBe('$0');
  });
});
