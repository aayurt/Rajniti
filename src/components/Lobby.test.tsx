import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Lobby from './Lobby';
import { GameProvider } from '../game/store';

describe('Lobby component states', () => {
  it('renders normal room state', () => {
    render(
      <GameProvider>
        <Lobby roomState="normal" />
      </GameProvider>
    );
    expect(screen.getByText('Select your player appearance:')).toBeInTheDocument();
    expect(screen.getByText('Join game →')).toBeInTheDocument();
  });

  it('renders full room state', () => {
    render(
      <GameProvider>
        <Lobby roomState="full" />
      </GameProvider>
    );
    expect(screen.getByText('The room is full.')).toBeInTheDocument();
    expect(screen.getByText('Spectate game')).toBeInTheDocument();
    expect(screen.getByText('Return to lobby')).toBeInTheDocument();
  });

  it('renders exclusive room state', () => {
    render(
      <GameProvider>
        <Lobby roomState="exclusive" />
      </GameProvider>
    );
    expect(screen.getByText('This room is exclusive for logged-in users')).toBeInTheDocument();
    expect(screen.getByText('Login to join')).toBeInTheDocument();
  });

  it('does not render the player list in the lobby right column', () => {
    const { container } = render(
      <GameProvider>
        <Lobby roomState="normal" />
      </GameProvider>
    );
    const waitingBars = screen.getAllByText(/Waiting for/);
    expect(waitingBars.length).toBeGreaterThan(0);

    // Look for the specific div containing the player list.
    // The player list has a div with player details, we shouldn't see it
    const hostBadges = container.querySelectorAll('span.bg-line');
    // We expect 0 host badges inside player lists in the right column of Lobby
    expect(hostBadges.length).toBe(0);
  });
});
