export interface Player {
  name: string;
  cash: number;
  pos: number;
  out: boolean;
}

export function createPlayer(name: string, cash: number): Player {
  return { name, cash, pos: 0, out: false };
}

export function isPlayerOut(player: Player): boolean {
  return player.out;
}

export function playerCash(player: Player): number {
  return player.cash;
}

export function playerPos(player: Player): number {
  return player.pos;
}

export function playerName(player: Player): string {
  return player.name;
}