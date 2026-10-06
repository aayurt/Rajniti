import { TILES } from '../data/tiles';
import { useGame } from '../game/store';

export default function RightPanel() {
  const { state, dispatch } = useGame();
  const me = state.players.find((p) => p.isYou);
  const myTiles = Object.keys(state.owned)
    .map(Number)
    .filter((id) => state.owned[id] === me?.id)
    .map((id) => TILES[id]);

  const bankrupt = () => {
    if (window.confirm('Go bankrupt? You will leave the game.')) dispatch({ type: 'BANKRUPT_ME' });
  };

  return (
    <div className="flex flex-col gap-3 min-h-0 h-full relative">
      <button
        onClick={bankrupt}
        className="absolute -top-1 right-0 bg-[#e05e3a] text-white text-xs font-bold rounded-lg px-3 py-2 min-h-[40px]"
      >
        🏳 Bankrupt
      </button>

      <div className="bg-panel border border-edge rounded-xl p-2 mt-9">
        {state.players.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] relative ${
              i === state.current ? 'bg-tile' : ''
            } ${p.isOut ? 'opacity-40' : ''}`}
          >
            {i === state.current && (
              <div className="absolute left-0 top-2 bottom-2 w-1 rounded bg-[#ffcf3f]" />
            )}
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-base flex-shrink-0"
              style={{ background: p.color }}
            >
              👀
            </div>
            <div className="flex-1 text-[13px]">
              {p.name} {p.isOwner && <span>👑</span>} {p.isOut && <span className="text-fog">(out)</span>}
            </div>
            <div className="text-[13px]">${p.cash}</div>
          </div>
        ))}
      </div>

      <div className="bg-panel border border-edge rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <b className="text-lav text-sm mx-auto">Trades</b>
          <button
            onClick={() => dispatch({ type: 'CREATE_TRADE' })}
            className="bg-[#5b34e8] text-white text-xs font-bold rounded-lg px-3 py-2 min-h-[40px]"
          >
            ⊕ Create
          </button>
        </div>
        {state.tradeHint && (
          <div className="bg-tile rounded-lg p-3 text-center text-xs text-fog">
            ⓘ Make trades with other players to exchange properties, money and bonus cards. Use the
            “Create” button to create a new trade.
            <div>
              <button
                onClick={() => dispatch({ type: 'DISMISS_TRADE_HINT' })}
                className="mt-2 bg-panel border border-line rounded-md px-3 py-1.5 text-xs min-h-[36px]"
              >
                ✓ Got it
              </button>
            </div>
          </div>
        )}
        {state.trades.map((t) => (
          <div key={t.id} className="bg-tile rounded-lg p-2.5 text-xs mt-2 flex justify-between items-center">
            <span>{t.text}</span>
            <button
              onClick={() => dispatch({ type: 'CANCEL_TRADE', id: t.id })}
              className="text-fog px-2 py-1 min-h-[36px]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-panel border border-edge rounded-xl p-3.5 flex-1 min-h-0 overflow-y-auto">
        <b className="text-lav text-sm block text-center mb-2">My properties ({myTiles.length})</b>
        {myTiles.length === 0 && (
          <p className="text-fog text-xs text-center mt-4">Land on a tile and press Buy.</p>
        )}
        {myTiles.map((t) => (
          <div key={t.id} className="flex items-center gap-2 bg-tile rounded-lg p-2 mt-1.5 text-[13px]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color ?? '#8f8aa8' }} />
            <span className="flex-1">{t.name}</span>
            <span className="text-fog text-xs">${t.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
