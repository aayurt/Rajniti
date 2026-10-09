import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LeftPanel from '../LeftPanel';
import { GameProvider } from '../../game/store';

describe('LeftPanel', () => {
  it('renders discord, help, and sound buttons next to the logo', () => {
    const { getByLabelText } = render(
      <GameProvider>
        <LeftPanel room="test" />
      </GameProvider>
    );

    const discordBtn = getByLabelText('discord');
    const helpBtn = getByLabelText('help');
    const soundBtn = getByLabelText('sound');

    expect(discordBtn).toBeInTheDocument();
    expect(helpBtn).toBeInTheDocument();
    expect(soundBtn).toBeInTheDocument();
  });
});
