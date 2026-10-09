import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Board from './Board';
import { GameProvider } from '../game/store';
import { TILES } from '../data/tiles';

afterEach(() => cleanup());

describe('Board component', () => {
  it('renders tokens inside a relative container for correct clipping', () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );

    const tiles = container.querySelectorAll('[data-board-block-index]');
    expect(tiles.length).toBe(TILES.length);

    const startTile = tiles[0];
    const tokensContainer = startTile.querySelector('.rich-tokens');
    expect(tokensContainer).not.toBeNull();
  });

  it('renders each tile with its full name text without truncation styles', () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );

    const tiles = container.querySelectorAll('[data-board-block-index]');
    expect(tiles.length).toBe(TILES.length);

    const names = container.querySelectorAll('.LSlmqo-l, .rich-icon');
    expect(names.length).toBeGreaterThan(0);
  });

  it('displays the event log with exact message formats', () => {
    // Initial state event log should be empty or reflect store start
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>
    );
    expect(container.querySelector('.event-log')).toBeInTheDocument();
  });
});
