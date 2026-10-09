import { useEffect, useRef } from 'react';
import { TILES, tileArea, isBuyable } from '../data/tiles';
import type { Tile } from '../data/tiles';
import { useGame } from '../game/store';
import Dice from './Dice';
import RichTile from './richtile/RichTile';
import type { RichOrient } from './richtile/RichTile';
import Character, { tokenSlot } from './richtile/Character';
import { flagCodeFromEmoji } from './richtile/flags';

function orientFor(id: number): RichOrient {
  if (id >= 1 && id <= 9) return 'top';
  if (id >= 11 && id <= 19) return 'right';
  if (id >= 31 && id <= 39) return 'left';
  return 'bottom';
}

function TileView({ t, ownedBy, tokens, selected, onSelect }: {
  t: Tile;
  ownedBy: string | undefined;
  tokens: { color: string }[];
  selected: boolean;
  onSelect: () => void;
}) {
  const orient = orientFor(t.id);
  return (
    <RichTile
      index={t.id}
      name={t.name}
      price={t.price}
      flag={flagCodeFromEmoji(t.flag)}
      groupColor={t.color}
      kind={t.kind}
      icon={t.icon}
      sub={t.sub}
      level={0}
      ownedBy={ownedBy}
      selected={selected}
      orient={orient}
      onSelect={onSelect}
      style={{ gridArea: tileArea(t.id) }}
    >
      {tokens.length > 0 && (
        <div className="rich-tokens">
          {tokens.map((tk, i) => {
            const slot = tokenSlot(i, tokens.length);
            return (
              <div
                key={i}
                className="rich-token"
                style={{ left: `${slot.x}%`, top: `${slot.y}%`, zIndex: tokens.length - i }}
              >
                <Character color={tk.color} flip={i % 2 === 1} orient={orient} />
              </div>
            );
          })}
        </div>
      )}
    </RichTile>
  );
}

export default function Board({ blurred = false, interactive = true }: { blurred?: boolean; interactive?: boolean }) {
  const { state, dispatch } = useGame();
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!interactive || blurred) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TURN' });
    }, 1000);
    return () => clearInterval(interval);
  }, [interactive, blurred, dispatch]);

  const roll = () => {
    if (state.rolling || blurred || !interactive) return;
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    dispatch({ type: 'ROLL', d1, d2 });
    timer.current = window.setTimeout(() => dispatch({ type: 'LANDED' }), 650);
  };

  const me = state.players.find((p) => p.isYou);
  const myProps = Object.entries(state.owned).filter(([, pid]) => pid === me?.id);
  const currentPlayer = state.players[state.current];
  const pendingTile = state.pendingBuy != null ? TILES[state.pendingBuy] : null;
  const canAfford = pendingTile && me && pendingTile.price !== undefined && me.cash >= pendingTile.price;

  return (
    <div className="aspect-square max-h-[calc(100dvh-28px)] max-w-full mx-auto flex flex-col min-h-0 p-1">
      <div
        className="flex-1 grid min-h-0"
        style={{ gridTemplateColumns: 'repeat(11, 1fr)', gridTemplateRows: 'repeat(11, 1fr)', gap: 4 }}
      >
        {TILES.map((t) => (
          <TileView
            key={t.id}
            t={t}
            ownedBy={state.owned[t.id]}
            tokens={state.players.filter((p) => p.pos === t.id && !p.isOut).map((p) => ({ color: p.color }))}
            selected={state.selected === t.id}
            onSelect={() => interactive && !blurred && dispatch({ type: 'SELECT', id: t.id })}
          />
        ))}

        <div
          className="relative flex flex-col items-center justify-start px-3 overflow-hidden rounded-xl"
          style={{
            gridArea: '2 / 2 / 11 / 11',
            background: 'radial-gradient(ellipse at 50% 30%,#171434 0%,#0e0c1e 65%)',
            filter: blurred ? 'blur(6px)' : undefined,
            pointerEvents: blurred ? 'none' : undefined,
          }}
        >
          <div className="flex gap-7 mt-6 mb-2.5">
            <Dice value={state.dice[0]} rolling={state.rolling} />
            <Dice value={state.dice[1]} rolling={state.rolling} />
          </div>

          {!blurred && (
            <>
              <p className="text-sm my-3.5 flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full text-[10px] text-center mr-1"
                  style={{ background: currentPlayer.color }}
                >
                  👀
                </span>{' '}
                <span><b>{currentPlayer.name}</b> <span className="text-fog">is playing...</span></span>
                <span className="text-fog font-mono ml-2">
                  {Math.floor(state.turn.timeLeft / 60).toString().padStart(2, '0')}:
                  {(state.turn.timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </p>
              {state.turn.phase === 'awaitRoll' ? (
                <button
                  onClick={roll}
                  disabled={state.rolling}
                  className="bg-lime text-ink font-extrabold rounded-[10px] px-8 py-2.5 text-[15px] mb-2 min-h-[48px] disabled:opacity-60"
                >
                  Roll the dice
                </button>
              ) : (
                <button
                  onClick={() => dispatch({ type: 'END_TURN' })}
                  disabled={state.rolling}
                  className="bg-rose text-ink font-extrabold rounded-[10px] px-8 py-2.5 text-[15px] mb-2 min-h-[48px] disabled:opacity-60"
                >
                  End turn
                </button>
              )}

              {pendingTile && isBuyable(pendingTile) && (
                <div className="bg-panel border border-lime rounded-xl px-5 py-3 text-center text-sm mb-2">
                  <b>
                    {pendingTile.icon ?? '📍'} {pendingTile.name}
                  </b>{' '}
                  — <span className="text-lime font-bold">${pendingTile.price}</span>
                  <div className="flex gap-2 mt-2 justify-center">
                    <button
                      onClick={() => dispatch({ type: 'BUY' })}
                      disabled={!canAfford}
                      className="bg-lime text-ink font-bold rounded-lg px-5 py-2 text-sm min-h-[44px] disabled:opacity-50"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'SKIP_BUY' })}
                      className="bg-tile border border-line rounded-lg px-5 py-2 text-sm min-h-[44px]"
                    >
                      Skip
                    </button>
                  </div>
                  {!canAfford && <div className="text-rose text-xs mt-1">Not enough cash</div>}
                </div>
              )}

              <div className="event-log max-w-[560px]">
                {[...state.log].reverse().slice(0, 10).map((l) => (
                  <div key={l.id} className={l.muted ? 'text-fog' : ''}>
                    {l.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
