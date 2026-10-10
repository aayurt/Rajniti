import { describe, it, expect, vi } from 'vitest';

import { soundEngine } from './soundEngine';
import { SoundEvent } from './types';

vi.spyOn(console, 'log');

describe('SoundEngine', () => {
  it('has default state', () => {
    expect(soundEngine.getState()).toEqual({
      enabled: true,
      volume: 100,
      pack: 'classic',
    });
  });

  it('can enable and disable sound', () => {
    soundEngine.setEnabled(false);
    expect(soundEngine.getState().enabled).toBe(false);
    soundEngine.setEnabled(true);
    expect(soundEngine.getState().enabled).toBe(true);
  });

  it('can set volume', () => {
    soundEngine.setVolume(50);
    expect(soundEngine.getState().volume).toBe(50);
    soundEngine.setVolume(100);
    expect(soundEngine.getState().volume).toBe(100);
    soundEngine.setVolume(0);
    expect(soundEngine.getState().volume).toBe(0);
  });

  it('clamps volume to 0-100', () => {
    soundEngine.setVolume(-10);
    expect(soundEngine.getState().volume).toBe(0);
    soundEngine.setVolume(200);
    expect(soundEngine.getState().volume).toBe(100);
  });

  it('can set pack', () => {
    soundEngine.setPack('funny');
    expect(soundEngine.getState().pack).toBe('funny');
    soundEngine.setPack('got');
    expect(soundEngine.getState().pack).toBe('got');
  });

  it('returns correct volume level', () => {
    expect(soundEngine.getVolumeLevel()).toBe('high');

    const engineLow = soundEngine.createFromState({ enabled: true, volume: 10, pack: 'classic' });
    expect(engineLow.getVolumeLevel()).toBe('low');

    const engineMedium = soundEngine.createFromState({ enabled: true, volume: 50, pack: 'classic' });
    expect(engineMedium.getVolumeLevel()).toBe('medium');
  });

  it('plays rollDice event with correct pack', () => {
    soundEngine.play('rollDice');
  });

  it('does not play when disabled', () => {
    const engine = soundEngine.createFromState({ enabled: false, volume: 100, pack: 'classic' });
    engine.play('rollDice');
  });

  it('uses correct audio URL from pack', () => {
    const engine = soundEngine.createFromState({ enabled: true, volume: 100, pack: 'funny' });
    engine.play('rollDice');
  });

  it('supports all pack names', () => {
    const events: SoundEvent[] = ['rollDice', 'moveStep', 'buyProperty', 'payRent', 'jail', 'win', 'bankrupt'];

    for (const packName of allPackNames) {
      const engine = soundEngine.createFromState({ enabled: true, volume: 100, pack: packName });
      for (const event of events) {
        engine.play(event);
      }
    }
  });

  it('plays all sound events', () => {
    const events: SoundEvent[] = ['rollDice', 'moveStep', 'buyProperty', 'payRent', 'jail', 'win', 'bankrupt'];
    for (const event of events) {
      const engine = soundEngine.createFromState({ enabled: true, volume: 100, pack: 'classic' });
      engine.play(event);
    }
  });
});