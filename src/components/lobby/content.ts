export const SETTINGS = {
  maxPlayers: {
    title: 'Maximum players',
    desc: 'How many players can join the game'
  },
  privateRoom: {
    title: 'Private room',
    desc: 'Private rooms can be accessed using the room URL only'
  },
  bots: {
    title: 'Allow bots to join',
    badge: 'Beta',
    desc: 'Bots will join the game based on availability'
  },
  boardMap: {
    title: 'Board map',
    desc: 'Change map tiles, properties and stacks',
    classic: 'Classic',
    browse: 'Browse maps'
  },
  startingCash: {
    title: 'Starting cash',
    desc: 'Adjust how much money players start the game with',
    options: [500, 1000, 1500, 2000, 2500, 3000]
  },
  randomOrder: {
    title: 'Randomize player order',
    desc: 'Randomly reorder players at the beginning of the game'
  },
  sound: {
    title: 'Sound',
    desc: 'Enable or disable game sounds'
  },
  soundPack: {
    title: 'Sound pack',
    desc: 'Select a sound pack for game events'
  }
};

export const GAMEPLAY_RULES = [
  { key: 'doubleRent', title: 'x2 rent on full-set properties', desc: 'If a player owns a full property set, the base rent payment will be doubled' },
  { key: 'vacationCash', title: 'Vacation cash', desc: 'If a player lands on Vacation, all collected money from taxes and bank payments will be earned' },
  { key: 'auction', title: 'Auction', desc: 'If someone skips purchasing the property landed on, it will be sold to the highest bidder' },
  { key: 'noRentInPrison', title: "Don't collect rent while in prison", desc: 'Rent will not be collected when landing on properties whose owners are in prison' },
  { key: 'mortgage', title: 'Mortgage', desc: "Mortgage properties to earn 50% of their cost, but you won't get paid rent when players land on them" },
  { key: 'evenBuild', title: 'Even build', desc: 'Houses and hotels must be built up and sold off evenly within a property set' }
];

export const LOBBY_COPY = {
  updating: 'Updating settings...',
  waitingForHost: (name: string) => `Waiting for ${name} to start the game...`,
  roomFull: 'The room is full.',
  spectateGame: 'Spectate game',
  returnToLobby: 'Return to lobby',
  loginExclusive: 'This room is exclusive for logged-in users',
  loginToJoin: 'Login to join',
  appearancePicker: 'Select your player appearance:',
  joinGame: 'Join game',
  getMoreAppearances: 'Get more appearances',
  chatGate: 'Only game players can send chat messages'
};
