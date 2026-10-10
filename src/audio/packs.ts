import { SoundEvent, SoundPackName, SoundPack } from './types';

export const classicPack: SoundPack = {
  name: 'classic',
  events: {
    rollDice: '/sounds/dice-roll.mp3',
    moveStep: '/sounds/step.mp3',
    buyProperty: '/sounds/buy-property.mp3',
    payRent: '/sounds/pay-rent.mp3',
    jail: '/sounds/jail.mp3',
    win: '/sounds/win.mp3',
    bankrupt: '/sounds/bankrupt.mp3',
  },
};

export const funnyPack: SoundPack = {
  name: 'funny',
  events: {
    rollDice: '/sounds/funny-dice.mp3',
    moveStep: '/sounds/funny-step.mp3',
    buyProperty: '/sounds/funny-buy.mp3',
    payRent: '/sounds/funny-rent.mp3',
    jail: '/sounds/funny-jail.mp3',
    win: '/sounds/funny-win.mp3',
    bankrupt: '/sounds/funny-bankrupt.mp3',
  },
};

export const gotPack: SoundPack = {
  name: 'got',
  events: {
    rollDice: '/sounds/got-dice.mp3',
    moveStep: '/sounds/got-step.mp3',
    buyProperty: '/sounds/got-buy.mp3',
    payRent: '/sounds/got-rent.mp3',
    jail: '/sounds/got-jail.mp3',
    win: '/sounds/got-win.mp3',
    bankrupt: '/sounds/got-bankrupt.mp3',
  },
};

export const soundPacks: Record<SoundPackName, SoundPack> = {
  classic: classicPack,
  funny: funnyPack,
  got: gotPack,
};

export const defaultPackName: SoundPackName = 'classic';
export const allPackNames: SoundPackName[] = ['classic', 'funny', 'got'];