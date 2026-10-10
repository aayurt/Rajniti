import { AudioState, SoundEvent, SoundPackName, VolumeLevel } from './types';
import { allPackNames, defaultPackName, soundPacks } from './packs';

export type { AudioState, SoundEvent, SoundPackName, VolumeLevel };

export const soundEngine = {
  state: {
    enabled: true,
    volume: 100,
    pack: defaultPackName,
  } as AudioState,

  getState(): AudioState {
    return { ...this.state };
  },

  setState(partial: Partial<AudioState>): void {
    this.state = { ...this.state, ...partial };
  },

  setEnabled(enabled: boolean): void {
    this.state = { ...this.state, enabled };
  },

  setVolume(volume: number): void {
    this.state = { ...this.state, volume: Math.max(0, Math.min(100, volume)) };
  },

  setPack(pack: SoundPackName): void {
    this.state = { ...this.state, pack };
  },

  getVolumeLevel(): VolumeLevel {
    const v = this.state.volume;
    if (v < 33) return 'low';
    if (v < 66) return 'medium';
    return 'high';
  },

  play(event: SoundEvent): void {
    if (!this.state.enabled) return;

    const pack = soundPacks[this.state.pack];
    if (!pack) return;

    const audioUrl = pack.events[event];
    if (!audioUrl) return;

    console.log(`[Sound] Playing ${audioUrl} (volume: ${this.state.volume}, pack: ${this.state.pack})`);
  },

  createFromState(state: AudioState) {
    const engine = Object.create(soundEngine);
    engine.state = state;
    return engine;
  },
};