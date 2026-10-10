import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Dice from '../Dice';

describe('Dice', () => {
  it('renders with enlarged 92px default size and brighter background via inline style', () => {
    const { container } = render(<Dice value={1} />);
    const diceDiv = container.firstChild as HTMLElement;

    expect(diceDiv.style.width).toBe('92px');
    expect(diceDiv.style.height).toBe('92px');

    expect(diceDiv.style.background).toBeTruthy();
    expect(diceDiv.style.background).not.toBe('');
  });

  it('allows overriding size via props', () => {
    const { container } = render(<Dice value={1} size={80} />);
    const diceDiv = container.firstChild as HTMLElement;
    expect(diceDiv.style.width).toBe('80px');
    expect(diceDiv.style.height).toBe('80px');
  });

  it('applies rolling class when rolling prop is true', () => {
    const { container } = render(<Dice value={1} rolling={true} />);
    const diceDiv = container.firstChild as HTMLElement;
    expect(diceDiv.className).toContain('rolling');
  });

  it('renders correct number of pips for given value', () => {
    const { container } = render(<Dice value={5} />);
    const pips = container.querySelectorAll('.pip');
    expect(pips.length).toBe(5);
  });

  it('applies disabled class when disabled prop is true', () => {
    const { container } = render(<Dice value={1} disabled={true} />);
    const diceDiv = container.firstChild as HTMLElement;
    expect(diceDiv.className).toContain('disabled');
  });

  it('reduces opacity when disabled prop is true', () => {
    const { container } = render(<Dice value={1} disabled={true} />);
    const diceDiv = container.firstChild as HTMLElement;
    expect(diceDiv.style.opacity).toBe('0.5');
  });

  it('does not apply rolling class when disabled prop is true', () => {
    const { container } = render(<Dice value={1} rolling={true} disabled={true} />);
    const diceDiv = container.firstChild as HTMLElement;
    expect(diceDiv.className).not.toContain('rolling');
  });
});
