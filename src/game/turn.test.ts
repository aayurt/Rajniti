import { describe, it, expect } from 'vitest';
import { createTurn, tickTurn, rollTurn, endTurn } from './turn';

describe('turn state machine', () => {
  it('creates turn with awaitRoll phase and 60s time', () => {
    const t = createTurn();
    expect(t.phase).toBe('awaitRoll');
    expect(t.timeLeft).toBe(60);
  });

  it('ticks down time', () => {
    let t = createTurn();
    t = tickTurn(t);
    expect(t.timeLeft).toBe(59);
  });

  it('stops ticking at 0', () => {
    let t = createTurn();
    t.timeLeft = 0;
    t = tickTurn(t);
    expect(t.timeLeft).toBe(0);
  });

  it('transitions from awaitRoll to rolled', () => {
    let t = createTurn();
    t = rollTurn(t);
    expect(t.phase).toBe('rolled');
  });

  it('ignores roll if already rolled', () => {
    let t = createTurn();
    t = rollTurn(t);
    t = rollTurn(t);
    expect(t.phase).toBe('rolled');
  });

  it('transitions to ended', () => {
    let t = createTurn();
    t = rollTurn(t);
    t = endTurn(t);
    expect(t.phase).toBe('ended');
  });
});
