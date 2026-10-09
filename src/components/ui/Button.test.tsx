import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    const { base } = render(<Button>Click me</Button>);
    expect(base.textContent).toContain('Click me');
  });

  it('applies base classes', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('rounded-lg');
    expect(button?.className).toContain('px-3');
    expect(button?.className).toContain('py-2');
    expect(button?.className).toContain('text-sm');
    expect(button?.className).toContain('min-h-[44px]');
  });

  it('supports custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('applies disabled state', () => {
    const { container } = render(<Button disabled>Test</Button>);
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
    expect(button?.className).toContain('disabled:opacity-50');
  });

  it('supports onClick', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const button = container.querySelector('button');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});