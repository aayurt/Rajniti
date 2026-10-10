import { TILES } from './tiles';
import type { Tile } from './tiles';

export type MapId = 'classic' | 'worldwide' | 'deathvalley' | 'luckywheel';

export interface BoardMap {
  id: MapId;
  name: string;
  icon: string;
  tiles: Tile[];
}

const START = { name: 'START', icon: '▶▶', kind: 'start' } as const;
const IN_PRISON = { name: 'In Prison', icon: '🦓', sub: 'Passing by', kind: 'prison-pass' } as const;
const VACATION = { name: 'Vacation', icon: '🏝️', kind: 'vacation' } as const;
const GO_PRISON = { name: 'Go to prison', icon: '☠️', kind: 'goto-prison' } as const;
const TREASURE = (side?: 'left' | 'right') =>
  ({ name: 'Treasure', icon: '🧰', sub: 'Treasure', kind: 'treasure', ...(side ? { side } : {}) }) as Omit<Tile, 'id'>;
const SURPRISE = (side?: 'left' | 'right') =>
  ({ name: 'Surprise', icon: '❓', sub: 'Surprise', kind: 'surprise', ...(side ? { side } : {}) }) as Omit<Tile, 'id'>;
const EARNINGS = { name: 'Earnings Tax', icon: '💵', sub: '%10', kind: 'tax' } as const;
const PREMIUM = (side?: 'left' | 'right') =>
  ({ name: 'Premium Tax', price: 75, icon: '🧭', kind: 'tax', ...(side ? { side } : {}) }) as Omit<Tile, 'id'>;
const P = (
  id: number,
  name: string,
  price: number,
  flag: string,
  color: string,
  side?: 'left' | 'right',
): Tile => ({ id, name, price, flag, color, kind: 'property', ...(side ? { side } : {}) });
const AP = (id: number, name: string, side?: 'left' | 'right'): Tile => ({
  id,
  name,
  price: 200,
  icon: '✈️',
  kind: 'airport',
  ...(side ? { side } : {}),
});
const U = (id: number, name: string, icon: string, side?: 'left' | 'right'): Tile => ({
  id,
  name,
  price: 150,
  icon,
  kind: 'utility',
  ...(side ? { side } : {}),
});

// Worldwide ("Mr. Worldwide" 🌐) transcribed from board-preview screenshots.
// Assumptions where the preview was ambiguous (documented):
// - Top edge keeps the classic skeleton; Haifa/Jerusalem make room for
//   Mumbai 120 / New Delhi 130 (India pair carries the Worldwide theme).
// - Right edge drops Bologna/Gas Company (extra reads beyond the 9 slots);
//   ends Munich 180 / Berlin 200 above Vacation.
// - Bottom edge: Tokyo 280 / Yokohama 280 replace Paris/Toulouse slots;
//   Water Company stays; no bottom Treasure.
// - Left edge drops Birmingham; Liverpool/Manchester/London stay.
const WORLDWIDE: Tile[] = [
  { id: 0, ...START, kind: 'start' },
  P(1, 'Salvador', 60, '🇧🇷', '#7dff5e'),
  { id: 2, ...TREASURE() },
  P(3, 'Rio', 60, '🇧🇷', '#7dff5e'),
  { id: 4, ...EARNINGS, kind: 'tax' },
  P(5, 'Tel Aviv', 100, '🇮🇱', '#8b7cf0'),
  AP(6, 'TLV Airport'),
  P(7, 'Mumbai', 120, '🇮🇳', '#ff5b5b'),
  { id: 8, ...SURPRISE() },
  P(9, 'New Delhi', 130, '🇮🇳', '#ff5b5b'),
  { id: 10, ...IN_PRISON, kind: 'prison-pass' },
  P(11, 'Venice', 140, '🇭🇺', '#ff5b5b', 'right'),
  U(12, 'Power Company', '⚡', 'right'),
  P(13, 'Milan', 160, '🇮🇹', '#ff5b5b', 'right'),
  P(14, 'Rome', 160, '🇮🇹', '#ff5b5b', 'right'),
  AP(15, 'MUC Airport', 'right'),
  P(16, 'Frankfurt', 180, '🇩🇪', '#ffb01c', 'right'),
  { id: 17, ...TREASURE('right') },
  P(18, 'Munich', 180, '🇩🇪', '#ffb01c', 'right'),
  P(19, 'Berlin', 200, '🇩🇪', '#ffb01c', 'right'),
  { id: 20, ...VACATION, kind: 'vacation' },
  P(21, 'Shenzhen', 220, '🇨🇳', '#ef4444'),
  { id: 22, ...SURPRISE() },
  P(23, 'Beijing', 220, '🇨🇳', '#ef4444'),
  P(24, 'Shanghai', 240, '🇨🇳', '#ef4444'),
  AP(25, 'CDG Airport'),
  P(26, 'Paris', 280, '🇫🇷', '#3b82f6'),
  U(27, 'Water Company', '🚰'),
  P(28, 'Yokohama', 280, '🇯🇵', '#3b82f6'),
  P(29, 'Tokyo', 280, '🇯🇵', '#3b82f6'),
  { id: 30, ...GO_PRISON, kind: 'goto-prison' },
  P(31, 'Liverpool', 290, '🇬🇧', '#3b82f6', 'left'),
  P(32, 'Manchester', 300, '🇬🇧', '#3b82f6', 'left'),
  { id: 33, ...TREASURE('left') },
  P(34, 'London', 320, '🇬🇧', '#3b82f6', 'left'),
  AP(35, 'JFK Airport', 'left'),
  { id: 36, ...SURPRISE('left') },
  P(37, 'San Francisco', 360, '🇺🇸', '#22c55e', 'left'),
  { id: 38, ...PREMIUM('left') },
  P(39, 'New York', 400, '🇺🇸', '#22c55e', 'left'),
];

// Death Valley (☠) — Canada top, Germany right, UK bottom, USA left.
const DEATHVALLEY: Tile[] = [
  { id: 0, ...START, kind: 'start' },
  P(1, 'Ottawa', 60, '🇨🇦', '#7dff5e'),
  { id: 2, ...TREASURE() },
  P(3, 'Quebec City', 60, '🇨🇦', '#7dff5e'),
  { id: 4, ...EARNINGS, kind: 'tax' },
  AP(5, 'YYZ Airport'),
  P(6, 'Montreal', 100, '🇨🇦', '#8b7cf0'),
  P(7, 'Vancouver', 100, '🇨🇦', '#8b7cf0'),
  { id: 8, ...SURPRISE() },
  P(9, 'Toronto', 120, '🇨🇦', '#8b7cf0'),
  { id: 10, ...IN_PRISON, kind: 'prison-pass' },
  P(11, 'Wolfsburg', 140, '🇩🇪', '#ff5b5b', 'right'),
  U(12, 'Power Company', '⚡', 'right'),
  P(13, 'Cologne', 140, '🇩🇪', '#ff5b5b', 'right'),
  P(14, 'Hamburg', 160, '🇩🇪', '#ff5b5b', 'right'),
  AP(15, 'MUC Airport', 'right'),
  P(16, 'Frankfurt', 180, '🇩🇪', '#ffb01c', 'right'),
  { id: 17, ...TREASURE('right') },
  P(18, 'Munich', 180, '🇩🇪', '#ffb01c', 'right'),
  P(19, 'Berlin', 200, '🇩🇪', '#ffb01c', 'right'),
  { id: 20, ...VACATION, kind: 'vacation' },
  P(21, 'Glasgow', 220, '🇬🇧', '#3b82f6'),
  { id: 22, ...SURPRISE() },
  P(23, 'Cambridge', 220, '🇬🇧', '#3b82f6'),
  P(24, 'Liverpool', 240, '🇬🇧', '#3b82f6'),
  AP(25, 'LHR Airport'),
  P(26, 'Birmingham', 260, '🇬🇧', '#3b82f6'),
  P(27, 'Manchester', 260, '🇬🇧', '#3b82f6'),
  U(28, 'Water Company', '🚰'),
  P(29, 'London', 280, '🇬🇧', '#3b82f6'),
  { id: 30, ...GO_PRISON, kind: 'goto-prison' },
  P(31, 'Boston', 300, '🇺🇸', '#22c55e', 'left'),
  P(32, 'Seattle', 300, '🇺🇸', '#22c55e', 'left'),
  { id: 33, ...TREASURE('left') },
  P(34, 'Chicago', 320, '🇺🇸', '#22c55e', 'left'),
  AP(35, 'JFK Airport', 'left'),
  { id: 36, ...SURPRISE('left') },
  P(37, 'San Francisco', 350, '🇺🇸', '#22c55e', 'left'),
  { id: 38, ...PREMIUM('left') },
  P(39, 'New York', 400, '🇺🇸', '#22c55e', 'left'),
];

// Lucky Wheel (🍀) — Turkey/Romania top, event-heavy right, mixed bottom.
const LUCKYWHEEL: Tile[] = [
  { id: 0, ...START, kind: 'start' },
  P(1, 'Antalya', 60, '🇹🇷', '#7dff5e'),
  P(2, 'Istanbul', 80, '🇹🇷', '#7dff5e'),
  P(3, 'Brasov', 100, '🇷🇴', '#8b7cf0'),
  P(4, 'Bucharest', 120, '🇷🇴', '#8b7cf0'),
  AP(5, 'TLV Airport'),
  P(6, 'Milan', 140, '🇮🇹', '#ff5b5b'),
  P(7, 'Rome', 160, '🇮🇹', '#ff5b5b'),
  P(8, 'Munich', 180, '🇩🇪', '#ffb01c'),
  P(9, 'Berlin', 200, '🇩🇪', '#ffb01c'),
  { id: 10, ...IN_PRISON, kind: 'prison-pass' },
  { id: 11, ...TREASURE('right') },
  { id: 12, ...EARNINGS, kind: 'tax', side: 'right' } as Tile,
  { id: 13, ...SURPRISE('right') },
  { id: 14, ...TREASURE('right') },
  AP(15, 'MUC Airport', 'right'),
  { id: 16, ...SURPRISE('right') },
  { id: 17, ...TREASURE('right') },
  { id: 18, ...PREMIUM('right') },
  { id: 19, ...SURPRISE('right') },
  { id: 20, ...VACATION, kind: 'vacation' },
  P(21, 'Beijing', 220, '🇨🇳', '#ef4444'),
  P(22, 'Shanghai', 240, '🇨🇳', '#ef4444'),
  P(23, 'Belfast', 260, '🇮🇪', '#3b82f6'),
  P(24, 'Dublin', 280, '🇮🇪', '#3b82f6'),
  AP(25, 'CDG Airport'),
  P(26, 'Manchester', 300, '🇬🇧', '#3b82f6'),
  P(27, 'London', 320, '🇬🇧', '#3b82f6'),
  P(28, 'San Francisco', 350, '🇺🇸', '#22c55e'),
  P(29, 'New York', 400, '🇺🇸', '#22c55e'),
  { id: 30, ...GO_PRISON, kind: 'goto-prison' },
  { id: 31, ...TREASURE('left') },
  { id: 32, ...SURPRISE('left') },
  { id: 33, ...PREMIUM('left') },
  { id: 34, ...TREASURE('left') },
  AP(35, 'JFK Airport', 'left'),
  { id: 36, ...SURPRISE('left') },
  { id: 37, name: 'Tax Refund', price: 50, icon: '🎁', sub: '$50 back', kind: 'refund', side: 'left' } as Tile,
  { id: 38, ...TREASURE('left') },
  { id: 39, ...SURPRISE('left') },
];

export const MAPS: Record<MapId, BoardMap> = {
  classic: { id: 'classic', name: 'Classic', icon: '🗺️', tiles: TILES },
  worldwide: { id: 'worldwide', name: 'Mr. Worldwide', icon: '🌐', tiles: WORLDWIDE },
  deathvalley: { id: 'deathvalley', name: 'Death Valley', icon: '☠️', tiles: DEATHVALLEY },
  luckywheel: { id: 'luckywheel', name: 'Lucky Wheel', icon: '🍀', tiles: LUCKYWHEEL },
};

export const MAP_ORDER: MapId[] = ['classic', 'worldwide', 'deathvalley', 'luckywheel'];
