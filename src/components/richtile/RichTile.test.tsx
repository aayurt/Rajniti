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

  it('renders full name, price and flag svg', () => {
    render(<RichTile {...base} />);
    expect(screen.getByText('Shanghai')).toBeInTheDocument();
    expect(screen.getByText('240$')).toBeInTheDocument();
    expect(document.querySelector('svg[data-flag="cn"]')).not.toBeNull();
  });

  it('renders level pips per city level', () => {
    const { container } = render(<RichTile {...base} level={3} />);
    expect(container.querySelectorAll('[data-level-pip]').length).toBe(3);
  });

  it('shows owner badge only when owned', () => {
    const { container, rerender } = render(<RichTile {...base} />);
    expect(container.querySelector('[data-owner-badge]')).toBeNull();
    rerender(<RichTile {...base} ownedBy="p1" />);
    expect(container.querySelector('[data-owner-badge]')).not.toBeNull();
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
    expect(document.querySelector('[data-price-row]')).toBeNull();
  });

  it('renders corner label and sub text', () => {
    render(<RichTile index={10} name="In Prison" sub="Passing by" kind="prison-pass" icon="🦓" />);
    expect(screen.getByText('In Prison')).toBeInTheDocument();
    expect(screen.getByText('Passing by')).toBeInTheDocument();
  });

  it('straddles the flag on the outer edge per orientation', () => {
    const { container } = render(<RichTile {...base} orient="right" />);
    expect(container.querySelector('[data-flag-edge="right"]')).not.toBeNull();
    const { container: c2 } = render(<RichTile {...base} orient="left" />);
    expect(c2.querySelector('[data-flag-edge="left"]')).not.toBeNull();
    const { container: c3 } = render(<RichTile {...base} orient="top" />);
    expect(c3.querySelector('[data-flag-edge="bottom"]')).not.toBeNull();
    const { container: c4 } = render(<RichTile {...base} orient="bottom" />);
    expect(c4.querySelector('[data-flag-edge="top"]')).not.toBeNull();
  });

  it('tints treasure and surprise tiles', () => {
    const { container } = render(<RichTile index={2} name="Treasure" kind="treasure" icon="🧰" />);
    expect(container.firstElementChild?.className).toContain('rich-kind-treasure');
    const { container: c2 } = render(<RichTile index={8} name="Surprise" kind="surprise" />);
    expect(c2.firstElementChild?.className).toContain('rich-kind-surprise');
  });

  it('applies orientation classes per side', () => {
    const { container, rerender } = render(<RichTile {...base} orient="top" />);
    expect(container.firstElementChild?.className).toContain('rich-top');
    rerender(<RichTile {...base} orient="right" />);
    expect(container.firstElementChild?.className).toContain('rich-right');
    rerender(<RichTile {...base} orient="left" />);
    expect(container.firstElementChild?.className).toContain('rich-left');
    rerender(<RichTile {...base} orient="bottom" />);
    expect(container.firstElementChild?.className).toContain('rich-bottom');
  });

  it('renders blurred backdrop flag plus crisp circle flag', () => {
    const { container } = render(<RichTile {...base} />);
    expect(container.querySelector('[data-flag-bg]')).not.toBeNull();
    expect(container.querySelectorAll('svg[data-flag="cn"]').length).toBe(2);
  });

  it('wraps content in an orientation body', () => {
    const { container } = render(<RichTile {...base} orient="right" />);
    const body = container.querySelector('.rich-body');
    expect(body).not.toBeNull();
    expect(body?.querySelector('.rich-name')).not.toBeNull();
    expect(body?.querySelector('[data-price-row]')).not.toBeNull();
  });
});