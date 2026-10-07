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
});
