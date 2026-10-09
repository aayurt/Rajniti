// House/hotel buying and rent modification for color groups. Pure: no React, no DOM.

export type HouseCount = 0 | 1 | 2 | 3 | 4 | 'hotel';

export interface HouseState {
  readonly houses: Record<number, HouseCount>;
}

export function createHouseState(): HouseState {
  return { houses: {} };
}

export function canBuyHouses(state: HouseState, playerIndex: number, owners: Readonly<Record<number, number>>, colorGroup: number[]): boolean {
  if (colorGroup.length === 0) return false;
  const owner = owners[colorGroup[0]];
  if (owner === undefined) return false;
  for (const id of colorGroup) {
    if (owners[id] !== owner) return false;
  }
  return true;
}

export function buyHouse(state: HouseState, playerIndex: number, owners: Readonly<Record<number, number>>, colorGroup: number[], tiles: readonly { id: number; price: number }[]): HouseState {
  if (!canBuyHouses(state, playerIndex, owners, colorGroup)) return state;
  const newHouses = { ...state.houses };
  for (const id of colorGroup) {
    const current = newHouses[id] ?? 0;
    if (current === 'hotel') continue;
    newHouses[id] = current + 1 as HouseCount;
  }
  return { houses: newHouses };
}

export function buyHotel(state: HouseState, playerIndex: number, owners: Readonly<Record<number, number>>, colorGroup: number[], tiles: readonly { id: number; price: number }[]): HouseState {
  const newHouses = { ...state.houses };
  for (const id of colorGroup) {
    newHouses[id] = 'hotel' as HouseCount;
  }
  return { houses: newHouses };
}

export function sellHouse(state: HouseState, tileId: number): HouseState {
  const newHouses = { ...state.houses };
  const current = newHouses[tileId];
  if (current === undefined || current === 0) return state;
  if (current === 'hotel') {
    newHouses[tileId] = 4;
  } else {
    newHouses[tileId] = (current - 1) as HouseCount;
  }
  return { houses: newHouses };
}

export function getHouseCount(state: HouseState, tileId: number): HouseCount {
  return state.houses[tileId] ?? 0;
}

export function getRentMultiplier(houseCount: HouseCount): number {
  switch (houseCount) {
    case 0:
      return 1;
    case 1:
      return 4;
    case 2:
      return 10;
    case 3:
      return 30;
    case 4:
      return 90;
    case 'hotel':
      return 250;
    default:
      return 1;
  }
}

export function calculateRent(baseRent: number, houseCount: HouseCount): number {
  return Math.round(baseRent * getRentMultiplier(houseCount));
}