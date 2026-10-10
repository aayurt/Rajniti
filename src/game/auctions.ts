// Auction mechanics for unowned properties. Pure: no React, no DOM.

export interface AuctionState {
  readonly bids: Record<number, number>;
  readonly highestBidder: number | undefined;
  readonly active: boolean;
}

export function createAuctionState(): AuctionState {
  return { bids: {}, highestBidder: undefined, active: false };
}

export function startAuction(tileId: number, basePrice: number): AuctionState {
  return {
    bids: { [tileId]: 0 },
    highestBidder: undefined,
    active: true,
  };
}

export function placeBid(state: AuctionState, tileId: number, bidder: number, amount: number): AuctionState {
  const newBids = { ...state.bids, [tileId]: amount };
  return {
    bids: newBids,
    highestBidder: bidder,
    active: true,
  };
}

export function endAuction(state: AuctionState, tileId: number, sellersCash: number): {
  winner: number;
  winningBid: number;
  newSellersCash: number;
} {
  const bids = state.bids[tileId] ?? 0;
  const winner = state.highestBidder ?? 0;
  const newSellersCash = sellersCash + bids;
  return {
    winner,
    winningBid: bids,
    newSellersCash,
  };
}

export function auctionIsActive(state: AuctionState): boolean {
  return state.active;
}

export function getHighestBid(state: AuctionState, tileId: number): number {
  return state.bids[tileId] ?? 0;
}