import { describe, expect, it } from 'vitest';
import {
  auctionIsActive,
  createAuctionState,
  endAuction,
  getHighestBid,
  placeBid,
  startAuction,
} from './auctions';

describe('startAuction', () => {
  it('starts an auction with base price 0 and marks as active', () => {
    const state = startAuction(1, 60);
    expect(auctionIsActive(state)).toBe(true);
    expect(getHighestBid(state, 1)).toBe(0);
  });
});

describe('placeBid', () => {
  it('places a bid and updates highest bidder', () => {
    const state = startAuction(1, 60);
    const newState = placeBid(state, 1, 2, 100);
    expect(getHighestBid(newState, 1)).toBe(100);
    expect(newState.highestBidder).toBe(2);
  });

  it('updates highest bid when higher bid is placed', () => {
    const state = startAuction(1, 60);
    let s = placeBid(state, 1, 1, 50);
    s = placeBid(s, 1, 2, 80);
    expect(getHighestBid(s, 1)).toBe(80);
    expect(s.highestBidder).toBe(2);
  });

  it('preserves previous bids when placing a new bid', () => {
    const state = startAuction(1, 60);
    let s = placeBid(state, 1, 1, 50);
    s = placeBid(s, 1, 2, 80);
    // The latest bid overwrites
    expect(getHighestBid(s, 1)).toBe(80);
  });
});

describe('endAuction', () => {
  it('determines winner and adds bid to sellers cash', () => {
    const state = startAuction(1, 60);
    let s = placeBid(state, 1, 2, 100);
    s = placeBid(s, 1, 3, 150);
    const result = endAuction(s, 1, 0);
    expect(result.winner).toBe(3);
    expect(result.winningBid).toBe(150);
  });

  it('handles auction with no bids', () => {
    const state = startAuction(1, 60);
    const result = endAuction(state, 1, 0);
    expect(result.winner).toBe(0);
    expect(result.winningBid).toBe(0);
  });

  it('returns updated sellers cash', () => {
    const state = startAuction(1, 60);
    let s = placeBid(state, 1, 2, 100);
    const result = endAuction(s, 1, 500);
    expect(result.newSellersCash).toBe(600); // 500 + 100
  });
});

describe('getHighestBid', () => {
  it('returns 0 for auction with no bids', () => {
    const state = createAuctionState();
    expect(getHighestBid(state, 1)).toBe(0);
  });

  it('returns the highest bid amount', () => {
    const state = startAuction(1, 60);
    let s = placeBid(state, 1, 1, 30);
    s = placeBid(s, 1, 2, 75);
    expect(getHighestBid(s, 1)).toBe(75);
  });
});