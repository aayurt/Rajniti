import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Lobby from '../Lobby';
import { GameProvider } from '../../game/store';

describe('Lobby', () => {
  it('exposes appearance picker, join game, and more appearances buttons', () => {
    const { getByText, getAllByLabelText } = render(
      <GameProvider>
        <Lobby roomState="normal" />
      </GameProvider>
    );

    const appearanceLabels = getAllByLabelText(/Appearance/);
    expect(appearanceLabels.length).toBeGreaterThan(0);

    const joinBtn = getByText(/Join game/i);
    expect(joinBtn).toBeInTheDocument();

    const moreBtn = getByText(/Get more appearances/i);
    expect(moreBtn).toBeInTheDocument();
  });
});
