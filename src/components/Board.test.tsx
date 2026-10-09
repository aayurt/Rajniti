import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Board from './Board';
import { GameProvider } from '../game/store';
import { TILES } from '../data/tiles';

describe('Board component', () => {
  it('renders tokens inside a relative container for correct clipping', () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );

    const tiles = container.querySelectorAll('.rich-tile');
    expect(tiles.length).toBe(TILES.length);

    const startTile = tiles[0];
    const tokens = startTile.querySelectorAll('.rich-token');

    if (tokens.length > 0) {
      const tokenContainer = tokens[0].parentElement;
      expect(tokenContainer).not.toBe(startTile);
      expect(tokenContainer?.className).toContain('rich-tokens');
      expect(startTile.querySelector('[data-character]')).not.toBeNull();
    }
  });

  it('renders each tile with its full name text without truncation styles', () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );

    const tiles = container.querySelectorAll('.rich-tile');
    expect(tiles.length).toBe(TILES.length);

    const names = container.querySelectorAll('.rich-name, .rich-icon');
    expect(names.length).toBeGreaterThan(0);
    for (const t of TILES) {
      const tile = container.querySelector(`[data-board-block-index="${t.id}"]`);
      expect(tile, `tile ${t.id} present`).not.toBeNull();
      expect(tile?.textContent).toContain(t.name);
    }
  });
});
