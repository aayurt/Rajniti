import { useEffect, useRef } from 'react';
import { TILES, tileArea, isBuyable } from '../data/tiles';
import type { Tile } from '../data/tiles';
import { useGame } from '../game/store';
import Dice from './Dice';

function TileView({ t, owned, tokens, selected, onSelect }: {
  t: Tile;
  owned: boolean;
  tokens: { color: string }[];
  selected: boolean;
  onSelect: () => void;
}) {
  const isTop = t.id <= 10;
  const cls = `tile ${t.side ? `side ${t.side}` : ''} ${isTop || (t.id >= 20 && t.id <= 30) ? 'top-tile bottom-tile' : ''} ${owned ? 'owned' : ''} ${selected ? 'selected' : ''}`;
  const bar = t.color ? (
    t.side ? (
      <div className="t-side-bar" style={{ background: t.color }} />
    ) : (
      <div className="t-top" style={{ background: t.color }} />
    )
  ) : null;

  let inner: React.ReactNode;
  if (t.kind === 'start') {
    inner = (
      <>
        <div className="t-big" style={{ color: '#7dff5e' }}>START</div>
        <div className="t-icon">▶▶</div>
      </>
    );
  } else if (t.kind === 'prison-pass' || t.kind === 'vacation' || t.kind === 'goto-prison') {
    inner = (
      <>
        <div className="t-icon">{t.icon}</div>
        <div className="t-name">{t.name}</div>
        {t.sub && <div className="t-sub">{t.sub}</div>}
      </>
    );
  } else if ((t.kind === 'treasure' || t.kind === 'surprise') && !t.price) {
    inner = (
      <>
        <div className="t-sub" style={{ color: t.kind === 'treasure' ? '#ff9f1c' : '#ff6b9d' }}>{t.name}</div>
        <div className="t-icon">{t.icon}</div>
      </>
    );
  } else {
    inner = (
      <>
        {t.icon && <div className="t-icon">{t.icon}</div>}
        <div className="t-name">{t.name}</div>
        {t.price !== undefined && <div className="t-price">{t.price}$</div>}
      </>
    );
  }

  return (
    <div className={cls} style={{ gridArea: tileArea(t.id) }} title={t.name} onClick={onSelect}>
      {bar}
      {inner}
      {t.flag && <div className="flag">{t.flag}</div>}
      {tokens.map((tk, i) => (
        <div key={i} className="token-dot" style={{ background: tk.color, left: 6 + i * 18, bottom: 6 }}>
          👀
        </div>
      ))}
    </div>
  );
}

export default function Board({ blurred = false, interactive = true }: { blurred?: boolean; interactive?: boolean }) {
  const { state, dispatch } = useGame();
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

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
    <div className="bg-[#121022] border border-[#26234a] rounded-[14px] p-2 h-full flex flex-col min-h-0">
      <div
        className="flex-1 grid min-h-0"
        style={{ gridTemplateColumns: 'repeat(11, 1fr)', gridTemplateRows: 'repeat(11, 1fr)', gap: 6 }}
      >
        {TILES.map((t) => (
          <TileView
            key={t.id}
            t={t}
            owned={state.owned[t.id] !== undefined}
            tokens={state.players.filter((p) => p.pos === t.id && !p.isOut).map((p) => ({ color: p.color }))}
            selected={state.selected === t.id}
            onSelect={() => interactive && !blurred && dispatch({ type: 'SELECT', id: t.id })}
          />
        ))}

        <div
          className="relative flex flex-col items-center justify-start px-3 overflow-hidden rounded-xl"
          style={{
            gridArea: '2 / 2 / 12 / 12',
            background: 'radial-gradient(ellipse at 50% 30%,#171434 0%,#0e0c1e 65%)',
            filter: blurred ? 'blur(6px)' : undefined,
            pointerEvents: blurred ? 'none' : undefined,
          }}
        >
          <div className="flex gap-7 mt-6 mb-2.5">
            <Dice value={state.dice[0]} rolling={state.rolling} tilt={-8} />
            <Dice value={state.dice[1]} rolling={state.rolling} tilt={10} />
          </div>

          {!blurred && (
            <>
              <p className="text-sm my-3.5">
                <span
                  className="inline-block w-4 h-4 rounded-full text-[10px] text-center mr-1"
                  style={{ background: currentPlayer.color }}
                >
                  👀
                </span>{' '}
                <b>{currentPlayer.name}</b> <span className="text-fog">is playing...</span>
              </p>
              <button
                onClick={roll}
                disabled={state.rolling}
                className="bg-lime text-ink font-extrabold rounded-[10px] px-8 py-2.5 text-[15px] mb-2 min-h-[48px] disabled:opacity-60"
              >
                🎲 {state.rolling ? 'ROLLING...' : 'ROLL DICE'}
              </button>

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

              <div className="text-[12.5px] leading-[1.9] text-center text-[#b9b4d6] max-w-[560px] overflow-y-auto">
                {[...state.log].reverse().slice(0, 12).map((l) => (
                  <div key={l.id} className={l.muted ? 'text-fog' : ''}>
                    {l.text}
                  </div>
                ))}
              </div>
              <div className="text-fog text-xs mt-1">
                My properties ({myProps.length})
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
