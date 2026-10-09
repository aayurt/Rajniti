import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    const { base } = render(<Badge>12</Badge>);
    expect(base.textContent).toContain('12');
  });

  it('applies base classes', () => {
    const { container } = render(<Badge>Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('inline-flex');
    expect(span?.className).toContain('items-center');
    expect(span?.className).toContain('gap-1');
    expect(span?.className).toContain('rounded');
    expect(span?.className).toContain('text-xs');
    expect(span?.className).toContain('font-medium');
  });

  it('supports custom className', () => {
    const { container } = render(<Badge className="custom-badge">Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('custom-badge');
  });
});