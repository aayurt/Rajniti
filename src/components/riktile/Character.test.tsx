import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Character, { tokenSlot } from './Character';

describe('Character', () => {
  it('renders with default props', () => {
    const { container } = render(<Character color="#e5484d" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies the color as currentColor', () => {
    const { container } = render(<Character color="#e5484d" />);
    expect(container.style.color).toBe('#e5484d');
  });

  it('applies rotation based on orient prop', () => {
    const { container } = render(<Character color="#e5484d" orient="top" />);
    const transform = container.style.transform;
    expect(transform).toContain('180deg');
  });

  it('applies flip rotation', () => {
    const { container } = render(<Character color="#e5484d" flip={true} orient="bottom" />);
    const transform = container.style.transform;
    expect(transform).toContain('180deg');
  });

  it('tokenSlot returns correct slot positions', () => {
    expect(tokenSlot(0, 2)).toEqual({ x: 28, y: 68 });
    expect(tokenSlot(1, 2)).toEqual({ x: 50, y: 68 });
    expect(tokenSlot(2, 2)).toEqual({ x: 72, y: 68 });
    expect(tokenSlot(3, 2)).toEqual({ x: 39, y: 40 });
    expect(tokenSlot(4, 2)).toEqual({ x: 61, y: 40 });
    expect(tokenSlot(5, 2)).toEqual({ x: 50, y: 22 });
  });
});