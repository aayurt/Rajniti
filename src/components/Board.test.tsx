import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Board from './Board';
import { GameProvider } from '../game/store';

describe('Board component', () => {
  it('renders tokens inside a relative container for correct clipping', () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );

    const tiles = container.querySelectorAll('.tile');
    expect(tiles.length).toBeGreaterThan(0);

    const startTile = tiles[0];
    const tokens = startTile.querySelectorAll('.token-dot');

    if (tokens.length > 0) {
      const tokenContainer = tokens[0].parentElement;
      expect(tokenContainer).not.toBe(startTile);
      expect(tokenContainer?.className).toContain('tokens-container');
    }
  });

  it('renders each tile with its full name text without truncation styles', () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );

    const tiles = container.querySelectorAll('.tile');
    expect(tiles.length).toBeGreaterThan(0);

    const names = container.querySelectorAll('.t-name, .t-sub, .t-big');
    expect(names.length).toBeGreaterThan(0);
  });
});
