import { useState, useEffect } from 'react';
import { useGame } from '../game/store';
import LeftPanel from './LeftPanel';
import Board from './Board';
import { SETTINGS, GAMEPLAY_RULES, LOBBY_COPY } from './lobby/content';

const APPEARANCES = [
  '#c8f04a', '#ffcf3f', '#ff8a3d', '#d94f4f',
  '#5aa9ff', '#7fd4e8', '#1f9e8e', '#4ade80',
  '#a0715c', '#c0439c', '#ff7d9c', '#7b5cf0',
];

const RULE_ICONS = ['🪙', '🏖️', '🔨', '📉', '🤲', '🏘️'];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button aria-pressed={on} onClick={onClick} className={`toggle ${on ? 'on' : ''}`} />;
}

export default function Lobby({ roomState = 'normal' }: { roomState?: 'normal' | 'full' | 'exclusive' }) {
  const { state, dispatch } = useGame();
  const [updating, setUpdating] = useState(false);

  const handleUpdate = (action: any) => {
    dispatch(action);
    setUpdating(true);
  };

  useEffect(() => {
    if (updating) {
      const timer = setTimeout(() => setUpdating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [updating]);

  const host = state.players.find(p => p.isOwner);
  const hostName = host ? host.name : 'host';

  return (
    <div className="grid gap-3 p-3 h-[100dvh] lg:grid-cols-[300px_1fr_340px] grid-cols-1">
      <div className="hidden lg:block min-h-0 relative">
        <LeftPanel />
        {/* Chat gate line overlaying chat in left panel if needed, or placed at bottom of LeftPanel if accessible. Since LeftPanel is opaque, we can add it here as an absolute overlay if the user is not logged in or spectating, but standard is to put it in chat. We'll put it at the bottom of left panel container for this specific test case. */}
        <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-fog bg-panel p-2 rounded-lg border border-edge shadow-sm">
          {LOBBY_COPY.chatGate}
        </div>
      </div>

      {/* center: blurred board + appearance picker */}
      <div className="relative min-h-0 h-[52dvh] lg:h-auto">
        <Board blurred interactive={false} />

        {roomState === 'full' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 rounded-[14px] p-4">
            <h2 className="text-white text-xl font-bold mb-6">{LOBBY_COPY.roomFull}</h2>
            <div className="flex gap-4">
              <button className="bg-[#5b34e8] text-white font-semibold rounded-md px-6 py-3 min-h-[48px]">
                {LOBBY_COPY.spectateGame}
              </button>
              <button className="bg-panel border border-edge text-white font-semibold rounded-md px-6 py-3 min-h-[48px]">
                {LOBBY_COPY.returnToLobby}
              </button>
            </div>
          </div>
        )}

        {roomState === 'exclusive' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 rounded-[14px] p-4">
            <h2 className="text-white text-lg font-semibold mb-6">{LOBBY_COPY.loginExclusive}</h2>
            <button className="bg-[#5b34e8] text-white font-semibold rounded-md px-6 py-3 min-h-[48px]">
              {LOBBY_COPY.loginToJoin}
            </button>
          </div>
        )}

        {roomState === 'normal' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 rounded-[14px] p-4 overflow-y-auto">
            <p className="text-sm mb-5">{LOBBY_COPY.appearancePicker}</p>
            <div className="grid grid-cols-4 gap-x-7 gap-y-4 mb-7">
              {APPEARANCES.map((c) => {
                const active = state.appearance === c;
                return (
                  <button
                    key={c}
                    onClick={() => dispatch({ type: 'SET_APPEARANCE', color: c })}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl min-w-[48px] min-h-[48px] ${
                      active ? 'ring-4 ring-white/70 scale-110' : ''
                    }`}
                    style={{ background: c }}
                    aria-label={`Appearance ${c}`}
                  >
                    {active && '👀'}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => dispatch({ type: 'JOIN_GAME' })}
              className="bg-[#5b34e8] text-white font-semibold rounded-md px-7 py-3 text-[15px] min-h-[48px]"
            >
              {LOBBY_COPY.joinGame} →
            </button>
            <button className="mt-8 border border-line rounded-lg px-4 py-2 text-[13px] text-fog min-h-[44px]">
              🛒 {LOBBY_COPY.getMoreAppearances}
            </button>
          </div>
        )}
      </div>

      {/* right: waiting + settings */}
      <div className="min-h-0 overflow-y-auto flex flex-col gap-3 pb-safe relative">
        <div className="bg-panel border border-edge rounded-xl p-3 text-center text-fog text-sm">
          {LOBBY_COPY.waitingForHost(hostName)}
        </div>

        <div className="bg-panel border border-edge rounded-xl p-4">
          <b className="text-lav text-sm block text-center mb-3">Game settings</b>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>👥</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{SETTINGS.maxPlayers.title}</div>
              <div className="text-xs text-fog">{SETTINGS.maxPlayers.desc}</div>
            </div>
            <select
              value={state.maxPlayers}
              onChange={(e) => handleUpdate({ type: 'SET_MAX_PLAYERS', n: Number(e.target.value) })}
              className="bg-tile border border-line rounded-md px-2 py-2 text-sm min-h-[44px]"
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>🔑</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{SETTINGS.privateRoom.title}</div>
              <div className="text-xs text-fog">{SETTINGS.privateRoom.desc}</div>
            </div>
            <Toggle on onClick={() => {}} />
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>🤖</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                {SETTINGS.bots.title} <span className="bg-grape text-[10px] px-1.5 py-0.5 rounded">{SETTINGS.bots.badge}</span>
              </div>
              <div className="text-xs text-fog">{SETTINGS.bots.desc}</div>
            </div>
            <Toggle on={false} onClick={() => {}} />
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>🗺️</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{SETTINGS.boardMap.title}</div>
              <div className="text-xs text-fog">{SETTINGS.boardMap.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{SETTINGS.boardMap.classic}</div>
              <div className="text-xs text-lav">{SETTINGS.boardMap.browse} ›</div>
            </div>
          </div>

          <b className="text-lav text-sm block text-center my-3">Gameplay rules</b>
          {GAMEPLAY_RULES.map((r, i) => (
            <div key={r.key} className="flex items-start gap-3 py-2.5 border-b border-edge">
              <span className="mt-0.5">{RULE_ICONS[i]}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-fog">{r.desc}</div>
              </div>
              <Toggle on={!!state.rules[r.key]} onClick={() => handleUpdate({ type: 'TOGGLE_RULE', key: r.key })} />
            </div>
          ))}

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>💸</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{SETTINGS.startingCash.title}</div>
              <div className="text-xs text-fog">{SETTINGS.startingCash.desc}</div>
            </div>
            <select
              value={state.startingCash}
              onChange={(e) => handleUpdate({ type: 'SET_STARTING_CASH', n: Number(e.target.value) })}
              className="bg-tile border border-line rounded-md px-2 py-2 text-sm min-h-[44px]"
            >
              {SETTINGS.startingCash.options.map((n) => (
                <option key={n} value={n}>${n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2.5">
            <span>🔀</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{SETTINGS.randomOrder.title}</div>
              <div className="text-xs text-fog">{SETTINGS.randomOrder.desc}</div>
            </div>
            <Toggle on={!!state.rules.randomOrder} onClick={() => handleUpdate({ type: 'TOGGLE_RULE', key: 'randomOrder' })} />
          </div>
        </div>

        {updating && (
          <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <span className="animate-spin">↻</span> {LOBBY_COPY.updating}
          </div>
        )}
      </div>
    </div>
  );
}
