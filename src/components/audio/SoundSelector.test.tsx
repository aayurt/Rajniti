import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SoundSelector from './SoundSelector';
import { GameProvider } from '../game/store';

describe('SoundSelector component', () => {
  it('renders sound pack options', () => {
    render(
      <GameProvider>
        <SoundSelector />
      </GameProvider>
    );

    const packButtons = screen.getAllByRole('button', { name: /Classic|Funny|Game of Thrones/ });
    expect(packButtons.length).toBe(3);
  });

  it('renders sound settings section', () => {
    const { container } = render(
      <GameProvider>
        <SoundSelector />
      </GameProvider>
    );
    const soundSection = container.querySelector('.bg-panel');
    expect(soundSection).toBeInTheDocument();
  });
});