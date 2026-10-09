import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Test content</div>
      </Modal>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders open modal', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Test content</div>
      </Modal>
    );
    const modal = container.querySelector('.fixed');
    expect(modal).toBeInTheDocument();
    expect(container.querySelector('.bg-panel')).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Test content</div>
      </Modal>
    );
    const cancelBtn = container.querySelector('button:first-child');
    cancelBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});