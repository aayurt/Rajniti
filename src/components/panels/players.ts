import type { Player } from '../../game/store';

/**
 * Sorts players such that the host (isOwner) is always first.
 * If there are multiple owners (shouldn't happen), it preserves their relative order.
 * Non-hosts preserve their original order.
 */
export function sortPlayersWithHostFirst(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (a.isOwner && !b.isOwner) return -1;
    if (!a.isOwner && b.isOwner) return 1;
    return 0;
  });
}

/**
 * Formats cash to string, optionally could add commas or keep it simple.
 */
export function formatCash(amount: number): string {
  return `$${amount}`;
}
