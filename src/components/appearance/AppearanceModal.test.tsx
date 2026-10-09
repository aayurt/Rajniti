import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppearanceModal from './AppearanceModal';

describe('AppearanceModal', () => {
  it('renders closed by default (null)', () => {
    const { container } = render(<AppearanceModal isOpen={false} onClose={() => {}} onSelect={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('opens and shows appearance grid', () => {
    render(
      <AppearanceModal
        isOpen
        onClose={() => {}}
        onSelect={() => {}}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onSelect when a color button is clicked', () => {
    const onSelect = jest.fn();
    render(
      <AppearanceModal
        isOpen
        onClose={() => {}}
        onSelect
      />
    );
    const colorButtons = screen.getAllByRole('button');
    if (colorButtons.length > 0) {
      colorButtons[0].click();
    }
    expect(onSelect).toHaveBeenCalled();
  });
});