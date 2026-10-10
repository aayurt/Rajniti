export type SoundEvent =
  | 'rollDice'
  | 'moveStep'
  | 'buyProperty'
  | 'payRent'
  | 'jail'
  | 'win'
  | 'bankrupt';

export type SoundPackName = 'classic' | 'funny' | 'got';

export interface SoundPack {
  name: SoundPackName;
  events: Record<SoundEvent, string>;
}

export interface AudioState {
  enabled: boolean;
  volume: number;
  pack: SoundPackName;
}

export type VolumeLevel = 'low' | 'medium' | 'high';

export const enum SoundPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}