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

    const hostBadges = container.querySelectorAll('span.bg-line');
    expect(hostBadges.length).toBe(0);
  });

  it('exposes appearance picker 12-color grid', () => {
    const { container } = render(
      <GameProvider>
        <Lobby roomState="normal" />
      </GameProvider>
    );
    const colorButtons = container.querySelectorAll('.w-12.h-12.rounded-full');
    expect(colorButtons.length).toBe(12);
  });

  it('exposes settings rows correctly', () => {
    render(
      <GameProvider>
        <Lobby roomState="normal" />
      </GameProvider>
    );

    expect(screen.getAllByText('Maximum players').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Private room').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Allow bots to join').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Board map').length).toBeGreaterThan(0);
    expect(screen.getAllByText('x2 rent on full-set properties').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vacation cash').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Auction').length).toBeGreaterThan(0);
    expect(screen.getAllByText("Don't collect rent while in prison").length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mortgage').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Even build').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Starting cash').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Randomize player order').length).toBeGreaterThan(0);
  });
});
