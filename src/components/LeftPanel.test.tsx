import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeftPanel from './LeftPanel';
import { GameProvider } from '../game/store';

describe('LeftPanel component', () => {
  it('renders adblock as a small bottom-left toast without fullscreen backdrop', () => {
    const { container } = render(
      <GameProvider>
        <LeftPanel />
      </GameProvider>
    );

    // It should render the modal text
    expect(screen.getByText(/Please disable your Adblocker/i)).toBeInTheDocument();

    // But it should NOT have a fixed inset-0 black background (fullscreen backdrop)
    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60');
    expect(backdrop).toBeNull();
  });
});
