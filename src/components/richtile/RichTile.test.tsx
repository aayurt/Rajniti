import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import RichTile from './RichTile';

afterEach(() => cleanup());

describe('RichTile', () => {
  const base = { index: 24, name: 'Shanghai', price: 240 as number | undefined, flag: 'cn' as const };

  it('exposes block index, city level and expanded state', () => {
    const { container } = render(<RichTile {...base} level={0} />);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile.getAttribute('data-board-block-index')).toBe('24');
    expect(tile.getAttribute('data-city-level')).toBe('0');
    expect(tile.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders obfuscated DOM classes to match sample', () => {
    const { container } = render(<RichTile {...base} level={0} />);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile.className).toContain('D8mtfl-S');
    expect(container.querySelector('.PuSPraNU')).not.toBeNull();
    expect(container.querySelector('.LelS5mxC')).not.toBeNull();
    expect(container.querySelector('.CvalsVWS')).not.toBeNull();
    expect(container.querySelector('.mlnKELb2')).not.toBeNull();
    expect(container.querySelector('.LSlmqo-l')).not.toBeNull();
    expect(container.querySelector('._0NRL5-w0')).not.toBeNull();
    expect(container.querySelector('.YV19OnIY')).not.toBeNull();
  });

  it('renders full name, price and flag svg', () => {
    render(<RichTile {...base} />);
    expect(screen.getByText('Shanghai')).toBeInTheDocument();
    expect(screen.getByText('240')).toBeInTheDocument(); // updated to without $
    expect(document.querySelector('svg[data-flag="cn"]')).not.toBeNull();
  });

  it('renders level pips per city level', () => {
    const { container } = render(<RichTile {...base} level={3} />);
    expect(container.querySelectorAll('.PuSPraNU [data-level-pip]').length).toBe(3);
  });

  it('shows owner badge only when owned', () => {
    const { container, rerender } = render(<RichTile {...base} />);
    expect(container.querySelector('.cprZ5bW8')).toBeNull();
    rerender(<RichTile {...base} ownedBy="p1" />);
    expect(container.querySelector('.cprZ5bW8')).not.toBeNull();
  });

  it('calls onSelect on click', () => {
    const onSelect = vi.fn();
    render(<RichTile {...base} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Shanghai'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders special tiles without price row', () => {
    render(<RichTile index={8} name="Surprise" kind="surprise" />);
    expect(screen.getByText('Surprise')).toBeInTheDocument();
    expect(document.querySelector('._0NRL5-w0')).toBeNull();
  });

  it('renders corner label and sub text', () => {
    render(<RichTile index={10} name="In Prison" sub="Passing by" kind="prison-pass" icon="🦓" />);
    expect(screen.getByText('In Prison')).toBeInTheDocument();
    expect(screen.getByText('Passing by')).toBeInTheDocument();
  });

  it('tints treasure and surprise tiles', () => {
    const { container } = render(<RichTile index={2} name="Treasure" kind="treasure" icon="🧰" />);
    expect(container.firstElementChild?.className).toContain('richup-block-treasure');
    const { container: c2 } = render(<RichTile index={8} name="Surprise" kind="surprise" />);
    expect(c2.firstElementChild?.className).toContain('richup-block-surprise');
  });

  it('applies orientation classes per side', () => {
    const { container, rerender } = render(<RichTile {...base} orient="top" />);
    expect(container.firstElementChild?.className).toContain('richup-block-top');
    rerender(<RichTile {...base} orient="right" />);
    expect(container.firstElementChild?.className).toContain('richup-block-right');
    rerender(<RichTile {...base} orient="left" />);
    expect(container.firstElementChild?.className).toContain('richup-block-left');
    rerender(<RichTile {...base} orient="bottom" />);
    expect(container.firstElementChild?.className).toContain('richup-block-bottom');
  });

  it('renders blurred backdrop flag plus crisp circle flag', () => {
    const { container } = render(<RichTile {...base} />);
    expect(container.querySelector('.LelS5mxC')).not.toBeNull();
    expect(container.querySelectorAll('svg[data-flag="cn"]').length).toBe(2);
  });
});
