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
});
