import { describe, it, expect } from 'vitest';
import { SETTINGS, GAMEPLAY_RULES, LOBBY_COPY } from './content';

describe('lobby content', () => {
  it('has exact settings copy', () => {
    expect(SETTINGS.maxPlayers.title).toBe('Maximum players');
    expect(SETTINGS.maxPlayers.desc).toBe('How many players can join the game');

    expect(SETTINGS.privateRoom.title).toBe('Private room');
    expect(SETTINGS.privateRoom.desc).toBe('Private rooms can be accessed using the room URL only');

    expect(SETTINGS.bots.title).toBe('Allow bots to join');
    expect(SETTINGS.bots.badge).toBe('Beta');
    expect(SETTINGS.bots.desc).toBe('Bots will join the game based on availability');

    expect(SETTINGS.boardMap.title).toBe('Board map');
    expect(SETTINGS.boardMap.desc).toBe('Change map tiles, properties and stacks');
    expect(SETTINGS.boardMap.classic).toBe('Classic');
    expect(SETTINGS.boardMap.browse).toBe('Browse maps');

    expect(SETTINGS.startingCash.title).toBe('Starting cash');
    expect(SETTINGS.startingCash.desc).toBe('Adjust how much money players start the game with');
    expect(SETTINGS.startingCash.options).toEqual([500, 1000, 1500, 2000, 2500, 3000]);

    expect(SETTINGS.randomOrder.title).toBe('Randomize player order');
    expect(SETTINGS.randomOrder.desc).toBe('Randomly reorder players at the beginning of the game');
  });

  it('has exact rules copy', () => {
    const rules = GAMEPLAY_RULES;
    expect(rules[0]).toEqual({ key: 'doubleRent', title: 'x2 rent on full-set properties', desc: 'If a player owns a full property set, the base rent payment will be doubled' });
    expect(rules[1]).toEqual({ key: 'vacationCash', title: 'Vacation cash', desc: 'If a player lands on Vacation, all collected money from taxes and bank payments will be earned' });
    expect(rules[2]).toEqual({ key: 'auction', title: 'Auction', desc: 'If someone skips purchasing the property landed on, it will be sold to the highest bidder' });
    expect(rules[3]).toEqual({ key: 'noRentInPrison', title: "Don't collect rent while in prison", desc: 'Rent will not be collected when landing on properties whose owners are in prison' });
    expect(rules[4]).toEqual({ key: 'mortgage', title: 'Mortgage', desc: "Mortgage properties to earn 50% of their cost, but you won't get paid rent when players land on them" });
    expect(rules[5]).toEqual({ key: 'evenBuild', title: 'Even build', desc: 'Houses and hotels must be built up and sold off evenly within a property set' });
  });

  it('has exact general copy', () => {
    expect(LOBBY_COPY.updating).toBe('Updating settings...');
    expect(LOBBY_COPY.waitingForHost('Alice')).toBe('Waiting for Alice to start the game...');
    expect(LOBBY_COPY.roomFull).toBe('The room is full.');
    expect(LOBBY_COPY.spectateGame).toBe('Spectate game');
    expect(LOBBY_COPY.returnToLobby).toBe('Return to lobby');
    expect(LOBBY_COPY.loginExclusive).toBe('This room is exclusive for logged-in users');
    expect(LOBBY_COPY.loginToJoin).toBe('Login to join');
    expect(LOBBY_COPY.appearancePicker).toBe('Select your player appearance:');
    expect(LOBBY_COPY.joinGame).toBe('Join game');
    expect(LOBBY_COPY.getMoreAppearances).toBe('Get more appearances');
    expect(LOBBY_COPY.chatGate).toBe('Only game players can send chat messages');
  });
});
