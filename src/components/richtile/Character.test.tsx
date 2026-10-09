import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Character, { tokenSlot } from './Character';

afterEach(() => cleanup());

// Anatomy mirrors the pasted RichUp character node:
// currentColor disc + white eye pair + black pupils, box-relative placement.
describe('tokenSlot', () => {
  it('returns distinct in-box percentages per index', () => {
    const slots = [0, 1, 2, 3].map((i) => tokenSlot(i, 4));
    for (const s of slots) {
      expect(s.x).toBeGreaterThan(0);
      expect(s.x).toBeLessThan(100);
      expect(s.y).toBeGreaterThan(0);
      expect(s.y).toBeLessThan(100);
    }
    expect(new Set(slots.map((s) => `${s.x},${s.y}`).values()).size).toBe(4);
  });

  it('is deterministic and wraps past defined slots', () => {
    expect(tokenSlot(0, 1)).toEqual(tokenSlot(6, 1));
  });
});

describe('Character', () => {
  it('paints the body with the player color via currentColor', () => {
    const { container } = render(<Character color="#e5484d" />);
    const wrap = container.firstElementChild as HTMLElement;
    expect(wrap.getAttribute('style')).toContain('#e5484d');
    const disc = container.querySelector('[data-body]');
    expect(disc?.getAttribute('fill')).toBe('currentColor');
  });

  it('renders the white eye pair and black pupils', () => {
    render(<Character color="#e5484d" />);
    expect(screen.getByTestId('char-eyes')).toBeInTheDocument();
    expect(screen.getByTestId('char-pupils')).toBeInTheDocument();
  });

  it('keeps selection-only detailing attributes', () => {
    const { container } = render(<Character color="#e5484d" selected />);
    expect(container.querySelector('[data-show-on-selected]')).not.toBeNull();
  });

  it('rotates based on orient prop', () => {
    const { container: topContainer } = render(<Character color="#e5484d" orient="top" />);
    expect(topContainer.querySelector('span > span')?.getAttribute('style')).toContain('rotate(180deg)');

    const { container: rightContainer } = render(<Character color="#e5484d" orient="right" />);
    expect(rightContainer.querySelector('span > span')?.getAttribute('style')).toContain('rotate(-90deg)');

    const { container: leftContainer } = render(<Character color="#e5484d" orient="left" />);
    expect(leftContainer.querySelector('span > span')?.getAttribute('style')).toContain('rotate(90deg)');
  });
});
