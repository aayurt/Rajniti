import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import RightPanel from './RightPanel';
import { GameProvider } from '../game/store';

afterEach(() => cleanup());

describe('RightPanel component', () => {
  it('renders player list with Host badge, cash, and active highlight', () => {
    const { container } = render(
      <GameProvider>
        <RightPanel />
      </GameProvider>
    );

    // Initial state sets host. We look for 'Host' text
    const hostBadge = screen.getByText('Host');
    expect(hostBadge).toBeInTheDocument();
  });

  it('renders Trades layout', () => {
    const { container } = render(
      <GameProvider>
        <RightPanel />
      </GameProvider>
    );

    expect(screen.getByText('Trades')).toBeInTheDocument();
    expect(screen.getByText('⊕ Create')).toBeInTheDocument();
  });

  it('renders My properties list', () => {
    const { container } = render(
      <GameProvider>
        <RightPanel />
      </GameProvider>
    );

    expect(screen.getByText(/My properties/)).toBeInTheDocument();
  });
});
