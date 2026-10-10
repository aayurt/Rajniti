import { Tile } from '../../data/tiles';
import { GameState } from '../engine';
import { buyTile, applyRent, eliminateIfBankrupt } from '../engine';
import { isBuyable } from '../../data/tiles';

export interface BotStrategy {
  shouldBuyProperty(tile: Tile, cash: number): boolean;
  shouldMortgageTile(tileId: number, state: GameState): boolean;
  shouldUnmortgageTile(tileId: number, state: GameState): boolean;
  decideAuctionBid(tile: Tile, currentBid: number, cash: number): number;
}

export class DefaultStrategy implements BotStrategy {
  shouldBuyProperty(tile: Tile, cash: number): boolean {
    if (!isBuyable(tile)) return false;
    if (cash < (tile.price ?? 0)) return false;
    return cash > (tile.price ?? 0) * 0.5;
  }

  shouldMortgageTile(tileId: number, state: GameState): boolean {
    const ownerIdx = Object.values(state.owners).indexOf(tileId);
    if (ownerIdx === -1) return false;
    const player = state.players[ownerIdx];
    return player.cash < (tileId as number);
  }

  shouldUnmortgageTile(tileId: number, state: GameState): boolean {
    const ownerIdx = Object.values(state.owners).indexOf(tileId);
    if (ownerIdx === -1) return false;
    const player = state.players[ownerIdx];
    return player.cash >= (tileId as number) * 1.1;
  }

  decideAuctionBid(tile: Tile, currentBid: number, cash: number): number {
    const maxBid = cash - 100;
    if (maxBid <= currentBid) return 0;
    const price = tile.price ?? 0;
    const reasonableBid = Math.min(price, Math.max(currentBid + 1, Math.floor(price * 0.6)));
    return Math.min(reasonableBid, maxBid);
  }
}

export function createBotStrategy(): BotStrategy {
  return new DefaultStrategy();
}