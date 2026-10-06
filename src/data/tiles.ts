// 40 tiles, clockwise from START. Matches images/game reference.
export type TileKind =
  | 'start'
  | 'property'
  | 'airport'
  | 'utility'
  | 'tax'
  | 'treasure'
  | 'surprise'
  | 'prison-pass'
  | 'vacation'
  | 'goto-prison';

export interface Tile {
  id: number;
  name: string;
  price?: number;
  flag?: string;
  color?: string;
  icon?: string;
  sub?: string;
  kind: TileKind;
  side?: 'left' | 'right';
}

export const TILES: Tile[] = [
  { id: 0, name: 'START', icon: '▶▶', kind: 'start' },
  { id: 1, name: 'Salvador', price: 60, flag: '🇧🇷', color: '#7dff5e', kind: 'property' },
  { id: 2, name: 'Treasure', icon: '🧰', sub: 'Treasure', kind: 'treasure' },
  { id: 3, name: 'Rio', price: 60, flag: '🇧🇷', color: '#7dff5e', kind: 'property' },
  { id: 4, name: 'Earnings Tax', icon: '💵', sub: '%10', kind: 'tax' },
  { id: 5, name: 'TLV Airport', price: 200, icon: '✈️', kind: 'airport' },
  { id: 6, name: 'Tel Aviv', price: 100, color: '#8b7cf0', kind: 'property' },
  { id: 7, name: 'Haifa', price: 110, flag: '🇮🇱', color: '#8b7cf0', kind: 'property' },
  { id: 8, name: 'Surprise', icon: '❓', sub: 'Surprise', kind: 'surprise' },
  { id: 9, name: 'Jerusalem', price: 120, flag: '🇮🇱', color: '#8b7cf0', kind: 'property' },
  { id: 10, name: 'In Prison', icon: '🦓', sub: 'Passing by', kind: 'prison-pass' },
  // right column, top -> bottom
  { id: 11, name: 'Venice', price: 130, flag: '🇭🇺', color: '#ff5b5b', kind: 'property', side: 'right' },
  { id: 12, name: 'Power Company', price: 150, icon: '⚡', kind: 'utility', side: 'right' },
  { id: 13, name: 'Milan', price: 140, flag: '🇭🇺', color: '#ff5b5b', kind: 'property', side: 'right' },
  { id: 14, name: 'Rome', price: 160, flag: '🇭🇺', color: '#ff5b5b', kind: 'property', side: 'right' },
  { id: 15, name: 'MUJ Airport', price: 200, icon: '✈️', kind: 'airport', side: 'right' },
  { id: 16, name: 'Frankfurt', price: 180, flag: '🇩🇪', color: '#ffb01c', kind: 'property', side: 'right' },
  { id: 17, name: 'Treasure', icon: '🧰', sub: 'Treasure', kind: 'treasure', side: 'right' },
  { id: 18, name: 'Munich', price: 190, flag: '🇩🇪', color: '#ffb01c', kind: 'property', side: 'right' },
  { id: 19, name: 'Berlin', price: 200, flag: '🇩🇪', color: '#ffb01c', kind: 'property', side: 'right' },
  { id: 20, name: 'Vacation', icon: '🏝️', kind: 'vacation' },
  // bottom row, right -> left
  { id: 21, name: 'Shenzhen', price: 210, flag: '🇨🇳', color: '#ef4444', kind: 'property' },
  { id: 22, name: 'Surprise', icon: '❓', sub: 'Surprise', kind: 'surprise' },
  { id: 23, name: 'Beijing', price: 220, flag: '🇨🇳', color: '#ef4444', kind: 'property' },
  { id: 24, name: 'Shanghai', price: 240, flag: '🇨🇳', color: '#ef4444', kind: 'property' },
  { id: 25, name: 'CDG Airport', price: 200, icon: '✈️', kind: 'airport' },
  { id: 26, name: 'Lyon', price: 260, flag: '🇫🇷', color: '#3b82f6', kind: 'property' },
  { id: 27, name: 'Water Company', price: 150, icon: '🚰', kind: 'utility' },
  { id: 28, name: 'Toulouse', price: 270, flag: '🇫🇷', color: '#3b82f6', kind: 'property' },
  { id: 29, name: 'Paris', price: 280, flag: '🇫🇷', color: '#3b82f6', kind: 'property' },
  { id: 30, name: 'Go to prison', icon: '☠️', kind: 'goto-prison' },
  // left column, bottom -> top
  { id: 31, name: 'Liverpool', price: 290, flag: '🇬🇧', color: '#3b82f6', kind: 'property', side: 'left' },
  { id: 32, name: 'Manchester', price: 300, flag: '🇬🇧', color: '#3b82f6', kind: 'property', side: 'left' },
  { id: 33, name: 'Treasure', icon: '🧰', sub: 'Treasure', kind: 'treasure', side: 'left' },
  { id: 34, name: 'London', price: 320, flag: '🇬🇧', color: '#3b82f6', kind: 'property', side: 'left' },
  { id: 35, name: 'JFK Airport', price: 200, icon: '✈️', kind: 'airport', side: 'left' },
  { id: 36, name: 'Surprise', icon: '❓', sub: 'Surprise', kind: 'surprise', side: 'left' },
  { id: 37, name: 'San Francisco', price: 360, flag: '🇺🇸', color: '#22c55e', kind: 'property', side: 'left' },
  { id: 38, name: 'Premium Tax', price: 75, icon: '🧭', kind: 'tax', side: 'left' },
  { id: 39, name: 'New York', price: 400, flag: '🇺🇸', color: '#22c55e', kind: 'property', side: 'left' },
];

/** CSS grid-area for tile id on the 11x11 board. Center occupies 2/2/12/12. */
export function tileArea(id: number): string {
  if (id <= 10) return `1 / ${id + 1} / 2 / ${id + 2}`;
  if (id <= 19) return `${id - 10 + 1} / 11 / ${id - 10 + 2} / 12`;
  if (id === 20) return '11 / 11 / 12 / 12';
  if (id <= 29) return `11 / ${11 - (id - 20)} / 12 / ${11 - (id - 20) + 1}`;
  if (id === 30) return '11 / 1 / 12 / 2';
  return `${11 - (id - 30)} / 1 / ${11 - (id - 30) + 1} / 2`;
}

export function isBuyable(t: Tile): boolean {
  return (
    (t.kind === 'property' || t.kind === 'airport' || t.kind === 'utility') &&
    t.price !== undefined
  );
}
